import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { formatApiErrorMessage, isApiConfigured } from '@/services/api';

const LIFESTYLE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC87hFHibc21XzN6pKfUGXFhj4yTrJHGYw95G2qu_hwuI7PbqfxbaUyrFVbLVMe9QX7nEIqlXQLKR_ZDRWU2WMOWxHBhJKv7J0WCfB0pgvI9RFVozBIKn3JCkAa3Dbo0zY2TdwfVmOAKOBhgLFhr4cwxgl8qNTAsYizTJQWo0jRcrAJa4ZxsdmPQKW9zBQz76DMwtX_A6Agv8J4cncmOCLi2ErhEmV0H4OU7YmMLtk-IRFDvNp-yiwCpinBNqqua2sdY2rpsw12bt4';

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAmeXbvQ3wnHbLbWiH8TtW_u4L5-Me18oi9_RC9-C29Ri4Ubt0Z0y3VrEOuQjsshOf8JXSHjYs9Sqg43FO2KzSXZ2DWCq2gBgF47vwNuTnkYg53lY30l0_cXUn8h1m7yr8xd4GotmFLdPi-stQhkmsX_UgLT7nhednmfggjVyfhnX022_gCpc-Nq68tzbFI4sRqOqlTowFHOoZZ4PfRdWfsjY2tvaNJ8IGmR2989aI40qkEpXZT6gg4Ls_Mle4SRW5SVffo3K8qHoU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqaeKUYc-wLwUsht1aAUUIBCtzr1NReSkqMhkeAeYsvmGi0zoSO6_hmowOXznk-2dQIaM5nQmNJw0pTXv9sqV7L7a8Ywz0v-R1UHk4SPgzLpDdXhR8QC4R17OpHZbeHpKGjxcyR5P7c2cZ6mFDXbBXU15gJ1I6sPZft3-0pYMxNftgMo-qw4MspwEKbm0U0NFge9Jy7yB2VO2vxfgeQ7dAkP0I9ZTHbzfvUxiyWt6YdhIFWro9NPJtXVwsmqHNNuv5wdGybID9sw8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBvz9Rj9dO83PhAaMKkYh7IkTBkA8k93NvcRhLgnrLMiNrKfadxGRHUG4Vwhnd_oBqdGIs7c1e-p75LGOTJwKrcmeDrauluKRENKAcpJKZzA3Sz5MlMf4Sk2fT8CdI2aUCx3nanCvxWlE0tLBJYegW3DvmX_0CxAza_Qq6S1CSUTMgNHXZc2iMi5EjFH9WBDrxe3JWLItZhX46hIzcVCWul-a2gds5gFyZu7fieKNVtJAqy4lX9ZSv_H--9h7nXrRsBVvtvLGw83JA',
];

const INPUT_CLASS =
  'w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none text-slate-900 dark:text-slate-100';

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Vui lòng nhập họ tên.');
      return;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }
    if (password.length < 8) {
      setError('Mật khẩu cần ít nhất 8 ký tự (gồm chữ hoa, chữ thường, số và ký tự đặc biệt).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (isApiConfigured()) {
      setLoading(true);
      try {
        const res = await register({ name: name.trim(), email: email.trim(), password });
        const path = res.postLoginRedirect?.trim() || '/profile';
        navigate(path, { replace: true });
      } catch (err) {
        setError(formatApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="flex min-h-screen overflow-hidden">
        {/* Left: Lifestyle / Branding */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/60 z-10" />
          <img
            alt="Modern living room with sleek air conditioner"
            className="absolute inset-0 w-full h-full object-cover"
            src={LIFESTYLE_IMAGE}
          />
          <div className="relative z-20 flex flex-col justify-between p-12 text-white w-full">
            <div className="flex items-center gap-2">
              <span className="material-icons text-3xl text-primary">settings_input_component</span>
              <span className="text-2xl font-bold tracking-tight">TechHome</span>
            </div>
            <div className="max-w-md">
              <h1 className="text-5xl font-bold leading-tight mb-6">Nâng tầm trải nghiệm gia đình.</h1>
              <p className="text-xl text-slate-200">
                Cùng hàng nghìn gia chủ thông minh tin dùng TechHome cho giải pháp điều hòa tiết kiệm năng lượng và smart home.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src={src}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">Hơn 50k+ người dùng trên toàn cầu</span>
            </div>
          </div>
        </section>

        {/* Right: Sign-Up Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white dark:bg-background-dark">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tạo tài khoản</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Bắt đầu hành trình TechHome của bạn ngay hôm nay.</p>
            </div>

            {error && (
              <div
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm whitespace-pre-line"
                role="alert"
              >
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full_name">
                  Họ và tên
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person_outline</span>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
                  Địa chỉ email
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail_outline</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">
                  Mật khẩu (≥8 ký tự: chữ hoa, chữ thường, số, ký tự đặc biệt)
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_open</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <span className="material-icons text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirm_password">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_outline</span>
                  <input
                    id="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${INPUT_CLASS} pr-12`}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <label className="ml-3 text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Chính sách bảo mật
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary hover:underline font-bold ml-1 transition-colors">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUpPage;
