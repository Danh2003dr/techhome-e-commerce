import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAvatar } from '@/context/AvatarContext';
import { isApiConfigured, ApiError, getStoredUser, setStoredUser } from '@/services/api';
import { getProfile, changePassword, updateProfile, uploadAvatarFile } from '@/services/backend';
import type { ProfileDto, SavedAddressDto } from '@/types/api';
import {
  emptySavedAddressForm,
  validateSavedAddressForm,
  composeSavedAddressLine,
  savedAddressDtoToForm,
  buildSavedAddressDto,
  type SavedAddressFormFields,
} from '@/utils/savedAddressForm';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/user';

const PROFILE_STORAGE_KEY = 'techhome_profile';
const PASSWORD_UPDATED_KEY = 'techhome_password_updated';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export interface ProfileExtension {
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  defaultAddress: string;
  savedAddresses: SavedAddressDto[];
}

const emptyProfile = (): ProfileExtension => ({
  fullName: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  defaultAddress: '',
  savedAddresses: [],
});

function loadProfile(): ProfileExtension {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as Partial<ProfileExtension>;
    return { ...emptyProfile(), ...parsed };
  } catch {
    return emptyProfile();
  }
}

function saveProfile(p: ProfileExtension) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p));
}

function loadPasswordUpdated(): string {
  return localStorage.getItem(PASSWORD_UPDATED_KEY) || '';
}

/** Format ISO date to "dd/MM/yyyy HH:mm" */
function formatPasswordChangedAt(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${h}:${m}`;
  } catch {
    return '';
  }
}

function displayValue(value: string, placeholder: string) {
  return value?.trim() ? value : placeholder;
}

function mapApiProfileToExtension(dto: ProfileDto): ProfileExtension {
  const saved = Array.isArray(dto.savedAddresses)
    ? dto.savedAddresses.filter((a) => a && String(a.id).trim() && String(a.line).trim())
    : [];
  return {
    fullName: dto.name || '',
    phone: dto.phone || '',
    gender: dto.gender || '',
    dateOfBirth: dto.dateOfBirth || '',
    defaultAddress: dto.defaultAddress || '',
    savedAddresses: saved.map((a) => ({
      ...a,
      id: String(a.id).trim(),
      label: String(a.label ?? '').trim(),
      line: String(a.line).trim(),
    })),
  };
}

function newSavedAddressId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [addressesSaving, setAddressesSaving] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressEditingId, setAddressEditingId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<SavedAddressFormFields>(() => emptySavedAddressForm());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const INPUT_ROW =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary';
  const LABEL_CLS = 'block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1';

  const currentAvatar = avatarUrl ?? DEFAULT_PROFILE_IMAGE;
  const displayName = (user?.name ?? profile.fullName)?.trim() || '—';
  const displayEmail = user?.email?.trim() || '—';

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

  const persistSavedAddresses = useCallback(async (next: SavedAddressDto[]) => {
    setAddressesError(null);
    const list = next.slice(0, 20);
    if (!isApiConfigured()) {
      setProfile((prev) => {
        const merged = { ...prev, savedAddresses: list };
        saveProfile(merged);
        return merged;
      });
      return;
    }
    setAddressesSaving(true);
    try {
      const updated = await updateProfile({ savedAddresses: list });
      setApiProfile(updated);
      syncStoredUserFromProfile(updated);
      const mapped = mapApiProfileToExtension(updated);
      setProfile(mapped);
      saveProfile(mapped);
    } catch (err: unknown) {
      setAddressesError(err instanceof ApiError ? err.message : 'Không lưu được sổ địa chỉ.');
    } finally {
      setAddressesSaving(false);
    }
  }, []);

  const openAddressModalNew = useCallback(() => {
    setAddressesError(null);
    setAddressEditingId(null);
    setAddrForm(emptySavedAddressForm());
    setAddressModalOpen(true);
  }, []);

  const openAddressModalEdit = useCallback((a: SavedAddressDto) => {
    setAddressesError(null);
    setAddressEditingId(a.id);
    setAddrForm(savedAddressDtoToForm(a));
    setAddressModalOpen(true);
  }, []);

  const closeAddressModal = useCallback(() => {
    setAddressModalOpen(false);
    setAddressEditingId(null);
  }, []);

  const submitAddressModal = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const err = validateSavedAddressForm(addrForm);
      if (err) {
        setAddressesError(err);
        return;
      }
      const line = composeSavedAddressLine(addrForm);
      const id = addressEditingId ?? newSavedAddressId();
      const item = buildSavedAddressDto(id, addrForm, line);
      let next: SavedAddressDto[];
      if (addressEditingId) {
        next = profile.savedAddresses.map((x) => (x.id === addressEditingId ? item : x));
      } else {
        if (profile.savedAddresses.length >= 20) {
          setAddressesError('Tối đa 20 địa chỉ.');
          return;
        }
        next = [...profile.savedAddresses, item];
      }
      setAddressesError(null);
      closeAddressModal();
      void persistSavedAddresses(next);
    },
    [addrForm, addressEditingId, profile.savedAddresses, persistSavedAddresses, closeAddressModal]
  );

  const handleRemoveSavedAddress = useCallback(
    (id: string) => {
      const next = profile.savedAddresses.filter((a) => a.id !== id);
      void persistSavedAddresses(next);
    },
    [profile.savedAddresses, persistSavedAddresses]
  );

  const handleMakeDefaultFromSaved = useCallback(
    async (line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      setAddressesError(null);
      if (!isApiConfigured()) {
        setProfile((prev) => {
          const merged = { ...prev, defaultAddress: trimmed };
          saveProfile(merged);
          return merged;
        });
        return;
      }
      setAddressesSaving(true);
      try {
        const updated = await updateProfile({ defaultAddress: trimmed });
        setApiProfile(updated);
        syncStoredUserFromProfile(updated);
        const mapped = mapApiProfileToExtension(updated);
        setProfile(mapped);
        saveProfile(mapped);
      } catch (err: unknown) {
        setAddressesError(err instanceof ApiError ? err.message : 'Không cập nhật được địa chỉ mặc định.');
      } finally {
        setAddressesSaving(false);
      }
    },
    []
  );

  const displayPasswordUpdated =
    (isApiConfigured() && apiProfile?.passwordChangedAt
      ? formatPasswordChangedAt(apiProfile.passwordChangedAt)
      : passwordUpdated.trim()) || '—';

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
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.phone, '—')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Giới tính</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.gender, '—')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayEmail}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ngày sinh</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.dateOfBirth, '—')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Địa chỉ mặc định</p>
                <p className="text-slate-900 dark:text-white font-medium">{displayValue(profile.defaultAddress, '—')}</p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sổ địa chỉ giao hàng</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Thêm địa chỉ tại đây — khi thanh toán bạn có thể chọn một dòng trong sổ để điền nhanh ô giao hàng.
              </p>
            </div>
            <div className="p-8 space-y-4">
              {addressesError && !addressModalOpen && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {addressesError}
                </p>
              )}
              {profile.savedAddresses.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có địa chỉ đã lưu.</p>
              ) : (
                <ul className="space-y-3">
                  {profile.savedAddresses.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="font-bold text-slate-900 dark:text-white">{a.label.trim() || 'Địa chỉ'}</p>
                        {(a.recipientName || a.recipientPhone) && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="text-slate-500">Người nhận: </span>
                            {[a.recipientName, a.recipientPhone].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        {(a.street || a.ward || a.district || a.province) && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {[a.street, a.ward, a.district, a.province].filter(Boolean).join(', ')}
                          </p>
                        )}
                        {a.note?.trim() && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">Ghi chú: {a.note.trim()}</p>
                        )}
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap break-words border-t border-slate-100 dark:border-slate-800 pt-2">
                          {a.line}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => void handleMakeDefaultFromSaved(a.line)}
                          disabled={addressesSaving}
                          className="px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-xs font-bold hover:bg-primary/10 disabled:opacity-50"
                        >
                          Đặt làm mặc định
                        </button>
                        <button
                          type="button"
                          onClick={() => openAddressModalEdit(a)}
                          disabled={addressesSaving}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedAddress(a.id)}
                          disabled={addressesSaving}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!isApiConfigured() && (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  Bật <span className="font-mono">VITE_API_URL</span> để đồng bộ sổ địa chỉ lên tài khoản. Hiện chỉ lưu tạm trên trình duyệt này.
                </p>
              )}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={openAddressModalNew}
                  disabled={addressesSaving || profile.savedAddresses.length >= 20}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-600 disabled:opacity-50"
                >
                  Thêm địa chỉ
                </button>
                {profile.savedAddresses.length >= 20 && (
                  <p className="text-xs text-slate-500 mt-2">Đã đạt tối đa 20 địa chỉ.</p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Mật khẩu */}
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

          <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/30 px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
            Đăng nhập bằng email và mật khẩu. Liên kết mạng xã hội (Google, Zalo, …) sẽ được bổ sung khi có tích hợp thật trên
            server.
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

      {/* Modal địa chỉ giao hàng */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={closeAddressModal}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {addressEditingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
              </h3>
              <button
                type="button"
                onClick={closeAddressModal}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={submitAddressModal}>
              <div>
                <label htmlFor="addr-label" className={LABEL_CLS}>
                  Tên gợi nhớ <span className="text-slate-500 font-normal normal-case">(tuỳ chọn)</span>
                </label>
                <input
                  id="addr-label"
                  type="text"
                  value={addrForm.label}
                  onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Nhà, Công ty, …"
                  disabled={addressesSaving}
                  className={INPUT_ROW}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="addr-name" className={LABEL_CLS}>
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addr-name"
                    type="text"
                    autoComplete="name"
                    value={addrForm.recipientName}
                    onChange={(e) => setAddrForm((f) => ({ ...f, recipientName: e.target.value }))}
                    disabled={addressesSaving}
                    className={INPUT_ROW}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="addr-phone" className={LABEL_CLS}>
                    Số điện thoại người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addr-phone"
                    type="tel"
                    autoComplete="tel"
                    value={addrForm.recipientPhone}
                    onChange={(e) => setAddrForm((f) => ({ ...f, recipientPhone: e.target.value }))}
                    disabled={addressesSaving}
                    className={INPUT_ROW}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="addr-street" className={LABEL_CLS}>
                  Số nhà, tên đường <span className="text-red-500">*</span>
                </label>
                <input
                  id="addr-street"
                  type="text"
                  autoComplete="street-address"
                  value={addrForm.street}
                  onChange={(e) => setAddrForm((f) => ({ ...f, street: e.target.value }))}
                  disabled={addressesSaving}
                  className={INPUT_ROW}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="addr-ward" className={LABEL_CLS}>
                    Phường / xã <span className="text-slate-500 font-normal normal-case">(tuỳ chọn)</span>
                  </label>
                  <input
                    id="addr-ward"
                    type="text"
                    value={addrForm.ward}
                    onChange={(e) => setAddrForm((f) => ({ ...f, ward: e.target.value }))}
                    disabled={addressesSaving}
                    className={INPUT_ROW}
                  />
                </div>
                <div>
                  <label htmlFor="addr-district" className={LABEL_CLS}>
                    Quận / huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addr-district"
                    type="text"
                    value={addrForm.district}
                    onChange={(e) => setAddrForm((f) => ({ ...f, district: e.target.value }))}
                    disabled={addressesSaving}
                    className={INPUT_ROW}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="addr-province" className={LABEL_CLS}>
                    Tỉnh / thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addr-province"
                    type="text"
                    value={addrForm.province}
                    onChange={(e) => setAddrForm((f) => ({ ...f, province: e.target.value }))}
                    disabled={addressesSaving}
                    className={INPUT_ROW}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="addr-note" className={LABEL_CLS}>
                  Ghi chú giao hàng <span className="text-slate-500 font-normal normal-case">(tuỳ chọn)</span>
                </label>
                <textarea
                  id="addr-note"
                  value={addrForm.note}
                  onChange={(e) => setAddrForm((f) => ({ ...f, note: e.target.value }))}
                  disabled={addressesSaving}
                  rows={2}
                  className={INPUT_ROW}
                />
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Xem trước gửi đơn</p>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
                  {composeSavedAddressLine(addrForm) || '—'}
                </p>
              </div>
              {addressesError && addressModalOpen && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {addressesError}
                </p>
              )}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={addressesSaving}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {addressesSaving ? 'Đang lưu…' : addressEditingId ? 'Lưu thay đổi' : 'Thêm vào sổ'}
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
