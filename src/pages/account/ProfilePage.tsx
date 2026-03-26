import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAvatar } from '@/context/AvatarContext';
import { isApiConfigured, ApiError, getStoredUser, setStoredUser } from '@/services/api';
import { getProfile, changePassword, updateProfile, uploadAvatarFile } from '@/services/backend';
import type { ProfileDto } from '@/types/api';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const PROFILE_STORAGE_KEY = 'techhome_profile';
const PASSWORD_UPDATED_KEY = 'techhome_password_updated';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr-5cpNGoo6_fXpCQEnJFpyIGX4571JMorTIFS1W_oR0yGp1IBTI1_wLO51A6b6JfC_35uve5CoPYM2-is77gcOReXdd7VPBeLws-awri7PskL8u2xh1eUq1gEueTXzsqrp1FazpahCNs2KQX5oD6Y71wxx9yphpqUC_70AN9j0OhuIPUMTQtlrRSkHGsR-Ae0MukU5Jd4FVlVWsEW6CT2kWvy2xncJ-4KiWGLTbYe6MdSfuaEhKi8EN4oTy2OdUS4X6E2bOW0w5E';
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export interface ProfileExtension {
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  defaultAddress: string;
}

const defaultProfile: ProfileExtension = {
  fullName: 'Danh Lê',
  phone: '0913955274',
  gender: '',
  dateOfBirth: '',
  defaultAddress: '',
};

const DEFAULT_PASSWORD_UPDATED = '24/01/2024 11:46';

function loadProfile(): ProfileExtension {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...defaultProfile };
    const parsed = JSON.parse(raw);
    return { ...defaultProfile, ...parsed };
  } catch {
    return { ...defaultProfile };
  }
}

function saveProfile(p: ProfileExtension) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p));
}

function loadPasswordUpdated(): string {
  return localStorage.getItem(PASSWORD_UPDATED_KEY) || DEFAULT_PASSWORD_UPDATED;
}

/** Format ISO date to "dd/MM/yyyy HH:mm" */
function formatPasswordChangedAt(iso: string | null | undefined): string {
  if (!iso) return loadPasswordUpdated();
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return loadPasswordUpdated();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${h}:${m}`;
  } catch {
    return loadPasswordUpdated();
  }
}

function displayValue(value: string, placeholder: string) {
  return value?.trim() ? value : placeholder;
}

function mapApiProfileToExtension(dto: ProfileDto): ProfileExtension {
  return {
    fullName: dto.name || '',
    phone: dto.phone || '',
    gender: dto.gender || '',
    dateOfBirth: dto.dateOfBirth || '',
    defaultAddress: dto.defaultAddress || '',
  };
}

/** Giữ techhome_user khớp profile (avatar/name) để sau reload Auth không xóa avatar. */
function syncStoredUserFromProfile(p: ProfileDto) {
  const u = getStoredUser();
  if (!u) return;
  setStoredUser({
    ...u,
    name: typeof p.name === 'string' && p.name.trim() ? p.name.trim() : u.name,
    avatarUrl: p.avatarUrl ?? null,
  });
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const [profile, setProfile] = useState<ProfileExtension>(loadProfile);
  const [passwordUpdated, setPasswordUpdated] = useState(loadPasswordUpdated);
  const [apiProfile, setApiProfile] = useState<ProfileDto | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProfileExtension>({ ...profile });
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [saveProfileError, setSaveProfileError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSaveLoading, setAvatarSaveLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAvatar = avatarUrl ?? DEFAULT_AVATAR;
  const displayName = user?.name ?? profile.fullName;
  const displayEmail = user?.email ?? 'danh1924.d@gmail.com';

  useEffect(() => {
    setProfile(loadProfile());
    setPasswordUpdated(loadPasswordUpdated());
  }, []);

  useEffect(() => {
    if (!isApiConfigured() || !isAuthenticated) return;
    getProfile()
      .then((p) => {
        setApiProfile(p);
        setAvatarUrl(p.avatarUrl ?? null);
        syncStoredUserFromProfile(p);
        const mapped = mapApiProfileToExtension(p);
        setProfile(mapped);
        saveProfile(mapped);
      })
      .catch(() => setApiProfile(null));
  }, [isAuthenticated, setAvatarUrl]);

  const handleUploadClick = () => {
    setAvatarError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError('Vui lòng chọn ảnh JPG, PNG hoặc GIF.');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError('Ảnh tối đa 2MB.');
      return;
    }
    setAvatarError(null);
    if (!isApiConfigured() || !isAuthenticated) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    setAvatarSaveLoading(true);
    uploadAvatarFile(file)
      .then((updated) => {
        setApiProfile(updated);
        setAvatarUrl(updated.avatarUrl ?? null);
        syncStoredUserFromProfile(updated);
        setAvatarError(null);
      })
      .catch((err: unknown) => {
        if (
          err instanceof ApiError &&
          (err.status === 503 || err.body?.code === 'AVATAR_STORAGE_NOT_CONFIGURED')
        ) {
          const reader = new FileReader();
          reader.onload = () => {
            setAvatarUrl(reader.result as string);
            setAvatarError(
              'Chưa cấu hình lưu ảnh (Cloudflare R2 / biến môi trường) trên server — ảnh chỉ lưu trên trình duyệt này, không đồng bộ tài khoản.'
            );
          };
          reader.readAsDataURL(file);
          return;
        }
        const msg =
          err instanceof ApiError && err.body?.message
            ? String(err.body.message)
            : err instanceof Error
              ? err.message
              : 'Không thể tải ảnh lên.';
        setAvatarError(msg);
      })
      .finally(() => setAvatarSaveLoading(false));
  };

  const openEdit = useCallback(() => {
    setSaveProfileError(null);
    setEditForm({ ...profile });
    setEditOpen(true);
  }, [profile]);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
  }, []);

  const saveEdit = useCallback(async () => {
    setSaveProfileError(null);
    if (!isApiConfigured()) {
      setProfile(editForm);
      saveProfile(editForm);
      setEditOpen(false);
      return;
    }
    setSaveProfileLoading(true);
    try {
      const updated = await updateProfile({
        name: editForm.fullName,
        phone: editForm.phone,
        gender: editForm.gender,
        dateOfBirth: editForm.dateOfBirth,
        defaultAddress: editForm.defaultAddress,
      });
      setApiProfile(updated);
      syncStoredUserFromProfile(updated);
      const mapped = mapApiProfileToExtension(updated);
      setProfile(mapped);
      saveProfile(mapped);
      setEditOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError && err.body?.message
          ? String(err.body.message)
          : err instanceof Error
            ? err.message
            : 'Cập nhật hồ sơ thất bại.';
      setSaveProfileError(msg);
    } finally {
      setSaveProfileLoading(false);
    }
  }, [editForm]);

  const displayPasswordUpdated = isApiConfigured() && apiProfile?.passwordChangedAt
    ? formatPasswordChangedAt(apiProfile.passwordChangedAt)
    : passwordUpdated;

  const openPasswordModal = useCallback(() => {
    setChangePasswordError(null);
    setPasswordModalOpen(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setPasswordModalOpen(false);
    setChangePasswordError(null);
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }, []);

  const handleSubmitChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setChangePasswordError(null);
      const { currentPassword, newPassword, confirmPassword } = pwForm;
      if (!currentPassword.trim()) {
        setChangePasswordError('Vui lòng nhập mật khẩu hiện tại.');
        return;
      }
      if (!newPassword.trim()) {
        setChangePasswordError('Vui lòng nhập mật khẩu mới.');
        return;
      }
      if (newPassword.length < 6) {
        setChangePasswordError('Mật khẩu mới tối thiểu 6 ký tự.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setChangePasswordError('Mật khẩu mới và xác nhận không khớp.');
        return;
      }
      if (!isApiConfigured()) {
        const now = new Date();
        const str = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        localStorage.setItem(PASSWORD_UPDATED_KEY, str);
        setPasswordUpdated(str);
        closePasswordModal();
        return;
      }
      setChangePasswordLoading(true);
      try {
        await changePassword(currentPassword, newPassword);
        const updated = await getProfile();
        setApiProfile(updated);
        closePasswordModal();
      } catch (err: unknown) {
        const msg =
          err instanceof ApiError && err.body?.message
            ? String(err.body.message)
            : err instanceof Error
              ? err.message
              : 'Đổi mật khẩu thất bại. Kiểm tra mật khẩu hiện tại.';
        setChangePasswordError(msg);
      } finally {
        setChangePasswordLoading(false);
      }
    },
    [pwForm, closePasswordModal]
  );

  if (isInitialized && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10">
        <AccountSidebar />

        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <Breadcrumb
              items={[
                { label: 'Trang chủ', path: '/' },
                { label: 'Tài khoản', path: '/profile' },
                { label: 'Hồ sơ' },
              ]}
            />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Hồ sơ cá nhân</h1>
            <p className="text-slate-500 mt-1.5">Quản lý thông tin và bảo mật tài khoản.</p>
          </div>

          {/* Avatar */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <span className="material-icons text-primary">photo_camera</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ảnh đại diện</h2>
            </div>
            <div className="p-8 flex items-center gap-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="relative group flex-shrink-0">
                <img
                  alt="Avatar"
                  src={currentAvatar}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={avatarSaveLoading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Đổi ảnh"
                >
                  <span className="material-icons text-white">photo_camera</span>
                </button>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">JPG, PNG hoặc GIF. Tối đa 2MB.</p>
                {avatarError && <p className="text-sm text-red-500 mb-2">{avatarError}</p>}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={avatarSaveLoading}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {avatarSaveLoading ? 'Đang lưu…' : 'Tải ảnh lên'}
                </button>
              </div>
            </div>
          </section>

          {/* 1. Thông tin cá nhân */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h2>
              <button
                type="button"
                onClick={openEdit}
                className="flex items-center gap-2 text-primary text-sm font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors"
              >
                <span className="material-icons text-lg">edit</span>
                Cập nhật
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Họ và tên</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Số điện thoại</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.phone, '-')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Giới tính</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.gender, '- (Chưa cập nhật)')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayEmail}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ngày sinh</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.dateOfBirth, '- (Chưa cập nhật)')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Địa chỉ mặc định</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.defaultAddress, '- (Chưa cập nhật)')}</p>
              </div>
            </div>
          </section>

          {/* 2. Sổ địa chỉ */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sổ địa chỉ</h2>
              <Link
                to="/account/addresses"
                className="flex items-center gap-2 text-primary text-sm font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors"
              >
                <span className="material-icons text-lg">add</span>
                + Thêm địa chỉ
              </Link>
            </div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <span className="material-icons text-6xl text-slate-400 dark:text-slate-500">location_off</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Bạn chưa có địa chỉ nào được tạo</p>
              <p className="text-sm text-slate-500 mt-1 mb-6">Thêm địa chỉ để giao hàng nhanh hơn</p>
              <Link
                to="/account/addresses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                <span className="material-icons">add</span>
                Thêm địa chỉ
              </Link>
            </div>
          </section>

          {/* 3. Mật khẩu */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mật khẩu</h2>
              <button
                type="button"
                onClick={openPasswordModal}
                className="flex items-center gap-2 text-primary text-sm font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors"
              >
                <span className="material-icons text-lg">lock</span>
                Thay đổi mật khẩu
              </button>
            </div>
            <div className="p-8 space-y-2">
              <p className="text-slate-600 dark:text-slate-400">
                Mật khẩu: <span className="font-mono font-semibold text-slate-900 dark:text-white">••••••••</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Cập nhật lần cuối lúc: <span className="font-semibold text-slate-900 dark:text-white">{displayPasswordUpdated}</span>
              </p>
            </div>
          </section>

          {/* 4. Tài khoản liên kết */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tài khoản liên kết</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-icons text-slate-600 dark:text-slate-400">mail</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Google</p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Đã liên kết</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Hủy liên kết
                </button>
              </div>
              <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-icons text-slate-600 dark:text-slate-400">chat</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Zalo</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chưa liên kết</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Liên kết
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Modal Cập nhật thông tin */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={closeEdit}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cập nhật thông tin</h3>
              <button type="button" onClick={closeEdit} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void saveEdit();
              }}
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Giới tính</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Địa chỉ mặc định</label>
                <input
                  type="text"
                  value={editForm.defaultAddress}
                  onChange={(e) => setEditForm((f) => ({ ...f, defaultAddress: e.target.value }))}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              {saveProfileError && (
                <p className="text-sm text-red-600 dark:text-red-400">{saveProfileError}</p>
              )}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saveProfileLoading}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {saveProfileLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thay đổi mật khẩu */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={closePasswordModal}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thay đổi mật khẩu</h3>
              <button type="button" onClick={closePasswordModal} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmitChangePassword}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                  autoComplete="new-password"
                />
              </div>
              {changePasswordError && (
                <p className="text-sm text-red-600 dark:text-red-400">{changePasswordError}</p>
              )}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {changePasswordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AccountFooter />
    </div>
  );
};

export default ProfilePage;
