import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LIFESTYLE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBRdFsiGk4SP_bjqG5nhQ3WnkqM5_kHiLF-HzDJE_CzwScqXmpJL3QwB150GmyuDskBohtdzEbtIE9FIvZHnjlwJ-dThhEzlz86iO9PZUAQsrU3uHTAS8OIdsvSksMprpdAUQl09DiwICQVQKAGvUAuCXs6-yqhr8PWpak4ZdQZlfdg3R5tHj986A884VRx_pzQRrsPmu0UoIC4wKvvZWAIp805uqdiIKueCNTM7UTV6W21NxWakcxMjHbuFN6ipipXQGvysqtBIec';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile');
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
              <h1 className="text-5xl font-bold mb-6 leading-tight">Elevate Your Digital Lifestyle.</h1>
              <p className="text-lg opacity-90">
                Experience the future of home electronics with curated gear for the modern professional.
              </p>
            </div>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span>© 2024 TechHome Inc.</span>
              <span className="h-1 w-1 bg-white/40 rounded-full" />
              <a href="#" className="hover:underline">Privacy Policy</a>
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Access your orders, wishlist, and recommendations.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <span className="material-icons text-sm">alternate_email</span>
                    </span>
                    <input
                      id="email"
                      type="text"
                      placeholder="name@example.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-primary/20 rounded-lg bg-gray-50 dark:bg-primary/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
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
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-primary/20 rounded-lg bg-gray-50 dark:bg-primary/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-primary/10" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white dark:bg-background-dark px-4 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-primary/20 rounded-lg hover:bg-gray-50 dark:hover:bg-primary/10 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-primary/20 rounded-lg hover:bg-gray-50 dark:hover:bg-primary/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Facebook</span>
              </button>
            </div>

            <p className="text-center text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
