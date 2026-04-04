import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { formatApiErrorMessage, isApiConfigured } from '@/services/api';
import type { AuthResponse } from '@/types/api';

const LIFESTYLE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBRdFsiGk4SP_bjqG5nhQ3WnkqM5_kHiLF-HzDJE_CzwScqXmpJL3QwB150GmyuDskBohtdzEbtIE9FIvZHnjlwJ-dThhEzlz86iO9PZUAQsrU3uHTAS8OIdsvSksMprpdAUQl09DiwICQVQKAGvUAuCXs6-yqhr8PWpak4ZdQZlfdg3R5tHj986A884VRx_pzQRrsPmu0UoIC4wKvvZWAIp805uqdiIKueCNTM7UTV6W21NxWakcxMjHbuFN6ipipXQGvysqtBIec';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const resolveAfterLoginPath = (res: AuthResponse): string => {
    const trimmed = res.postLoginRedirect?.trim();
    if (trimmed) return trimmed;
    const role = String(res.user?.role ?? '').trim().toUpperCase();
    if (role === 'ADMIN') return '/admin';
    const raw = (location.state as { from?: { pathname?: string; search?: string } | string } | null)?.from;
    if (typeof raw === 'string' && raw.trim()) return raw;
    if (raw && typeof raw === 'object' && raw.pathname) {
      const path = String(raw.pathname);
      const q = raw.search != null && String(raw.search).trim() !== '' ? String(raw.search) : '';
      return `${path}${q}`;
    }
    return '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    if (isApiConfigured()) {
      setLoading(true);
      try {
        const res = await login({ email: email.trim(), password });
        navigate(resolveAfterLoginPath(res), { replace: true });
      } catch (err) {
        setError(formatApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center">
      <main className="flex w-full min-h-screen">
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
          <img
            alt="Modern home office with high-end tech accessories"
            className="absolute inset-0 w-full h-full object-cover"
            src={LIFESTYLE_IMAGE}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
          <div className="relative z-10 p-12 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2 text-white">
              <span className="material-icons text-3xl">developer_board</span>
              <span className="text-2xl font-bold tracking-tight">TechHome</span>
            </div>
            <div className="text-white max-w-md">
              <h1 className="text-5xl font-bold mb-6 leading-tight">Nâng tầm phong cách số.</h1>
              <p className="text-lg opacity-90">
                Trải nghiệm tương lai điện tử gia đình với thiết bị được chọn lọc cho người hiện đại.
              </p>
            </div>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span>© 2024 TechHome Inc.</span>
              <span className="h-1 w-1 bg-white/40 rounded-full" />
              <a href="#" className="hover:underline">Chính sách bảo mật</a>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden flex items-center gap-2 text-primary mb-8">
              <span className="material-icons text-4xl">developer_board</span>
              <span className="text-2xl font-bold tracking-tight">TechHome</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chào bạn trở lại</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Truy cập đơn hàng, danh sách yêu thích và gợi ý.
              </p>
            </div>

            {error && (
              <div
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm whitespace-pre-line"
                role="alert"
              >
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <span className="material-icons text-sm">alternate_email</span>
                    </span>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-primary/20 rounded-lg bg-gray-50 dark:bg-primary/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                      Mật khẩu
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <span className="material-icons text-sm">lock_outline</span>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-primary/20 rounded-lg bg-gray-50 dark:bg-primary/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      <span className="material-icons text-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="text-center text-gray-500 dark:text-gray-400">
              Chưa có tài khoản?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:underline">Tạo tài khoản</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
