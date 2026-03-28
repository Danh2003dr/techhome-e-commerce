import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/services/backend';
import { isApiConfigured, ApiError } from '@/services/api';

const SECURITY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqeTky2EF0emIjNnM_0pjrnKys9zUrmLnNV0kjkD1sSVB97ENQmrdNsFns5A6gOh0M5JJzQH3_wlz-9qzmhK026d2yfHl-ALw3a-smEwolCdsFp1jLfMzWTuPtmW3LcucfV_OsVCpoov5Fnux6i3VQ-pB0R1n83TJyz0A69RuUB8OhcIsz2pa4gi0fVWr-IrqVdZu8b-pb7-yDJXHZ37JT-UpJcofRN5soQVI2bClUmCmBWKmehqx1XBI1jHDudyn69gVHs6urE';

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDaILXrw4OVSOgSEnleUL5yOdVl2LiwjyO3JNMSg7BtsvEVDWbSy7TJKSUBeHzgOK78aqzRs4UHDIHa5cFZb14ZwpO86afhg8p51wrHg2ShRQ_yXohhU90Og677Se0qLSSyC74gt5lrJ1kc1MtqCZkx1YFzNkX9cv_P8cYfVSDUmZ4Yvg04DIZmd_AEz1b-_bRbBU1wO6wWF48ex2LPA38LFZ_ToOqBhA6ECgHNWqjVS4lFiOhFWrR6q_maqOUD7qI0GsWMxLD79oA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTYf4z77k3PjM91Lnxt8lnHOUwF53yTOv3eyHVoMG3i1lCdAf89RLe1j3sGLWMXdsL85a-fB6SZjn0bsDo1kjudBkEAU6FuLVcuQuoszzb4WktCjSuY3RNypcXXnEk3vsN89FEn0ZnMZTwgmr2dYA1gNj2nVOLu8mBoUvT08g61FLVZwUUC6vMG6pPOJAxLHGuVpn3OgfkiPDc-8kgRkJcLT-2DsZs1kJakIyHdRZ4419SB0l95cmdlr-qpvTNTKURV_WmMgIh33E',
];

function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError('Vui lòng nhập email hợp lệ (định dạng user@domain).');
      return;
    }
    if (!isApiConfigured()) {
      setError('Chưa cấu hình API (VITE_API_URL). Không thể gửi yêu cầu.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(trimmed);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gửi yêu cầu thất bại. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex min-h-screen overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img alt="Secure digital interface" className="w-full h-full object-cover opacity-40 mix-blend-overlay" src={SECURITY_IMAGE} />
          </div>
          <div className="relative z-10 p-12 text-white max-w-lg">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-icons text-4xl">devices</span>
              <span className="text-3xl font-bold tracking-tight">TechHome</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">Bảo mật của bạn là ưu tiên hàng đầu.</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Chúng tôi sử dụng mã hóa chuẩn và xác thực đa yếu tố để đảm bảo trải nghiệm mua sắm an toàn.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="h-10 w-10 rounded-full border-2 border-primary bg-blue-400 flex items-center justify-center overflow-hidden">
                  <img alt="" className="w-full h-full object-cover" src={AVATARS[0]} />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-primary bg-blue-500 flex items-center justify-center overflow-hidden">
                  <img alt="" className="w-full h-full object-cover" src={AVATARS[1]} />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-primary bg-blue-600 flex items-center justify-center overflow-hidden text-xs font-bold">+10k</div>
              </div>
              <span className="text-sm font-medium">Được hàng triệu người yêu công nghệ tin dùng</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-background-light dark:bg-background-dark relative">
          <div className="lg:hidden mb-8 flex items-center gap-2 text-primary">
            <span className="material-icons text-3xl">devices</span>
            <span className="text-2xl font-bold tracking-tight">TechHome</span>
          </div>

          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                <span className="material-icons text-primary text-4xl">lock_reset</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quên mật khẩu?</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Nhập email đã đăng ký. Nếu tài khoản tồn tại, hệ thống sẽ gửi hướng dẫn qua email (kiểm tra cả thư mục spam).
              </p>
            </div>

            {success ? (
              <div
                className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 p-4 text-sm text-emerald-900 dark:text-emerald-100"
                role="status"
              >
                <p className="font-semibold mb-1">Đã gửi yêu cầu</p>
                <p>Vui lòng kiểm tra email để biết bước tiếp theo.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="forgot_email">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-slate-400 text-xl">contact_mail</span>
                    </div>
                    <input
                      id="forgot_email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      disabled={loading}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                  <span>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                  {!loading && <span className="material-icons text-lg">arrow_forward</span>}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:text-blue-700 font-medium transition-colors">
                <span className="material-icons text-sm">arrow_back</span>
                Quay lại đăng nhập
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500">
                Cần thêm hỗ trợ? <a href="#" className="text-primary hover:underline">Liên hệ</a>
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 lg:left-auto lg:right-6">
            <button type="button" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors" aria-label="Đổi giao diện">
              <span className="material-icons">dark_mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
