import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile');
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
              <h1 className="text-5xl font-bold leading-tight mb-6">Elevate your home experience.</h1>
              <p className="text-xl text-slate-200">
                Join thousands of smart homeowners who trust TechHome for the latest in energy-efficient climate control and home automation.
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
              <span className="text-sm font-medium">Over 50k+ active users worldwide</span>
            </div>
          </div>
        </section>

        {/* Right: Sign-Up Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white dark:bg-background-dark">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Get started with your TechHome journey today.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full_name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person_outline</span>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">phone_iphone</span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail_outline</span>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_open</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-icons text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirm_password">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_outline</span>
                  <input
                    id="confirm_password"
                    type="password"
                    placeholder="••••••••"
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
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-bold ml-1 transition-colors">
                  Log In
                </Link>
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                  aria-label="Sign up with Google"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.292-1.908 4.292-1.28 1.28-3.32 2.672-7.84 2.672-7.14 0-12.86-5.78-12.86-12.86s5.72-12.86 12.86-12.86c3.84 0 6.8 1.512 9.04 3.648l2.56-2.56c-2.4-2.28-5.56-4.048-11.6-4.048-10.4 0-19.04 8.64-19.04 19.04s8.64 19.04 19.04 19.04c5.64 0 9.88-1.88 13.08-5.24 3.32-3.32 4.36-7.96 4.36-11.6 0-.84-.08-1.64-.24-2.36h-17.2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                  aria-label="Sign up with Apple"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M16.365 1.43c-1.14 0-2.812.63-3.722 1.583-.934 1.01-1.467 2.457-1.467 3.9 0 .15.02.296.04.425a3.29 3.29 0 0 0 2.21-1.076c.866-.94 1.48-2.404 1.48-3.834a3.17 3.17 0 0 0-.04-.425c-.173-.027-.346-.043-.5-.043zM15.46 8.163c-.888 0-2.316.533-3.084.533-.77 0-1.89-.505-2.61-.505-2.022 0-4.04 1.523-4.04 4.333 0 1.235.295 2.827 1.025 4.34.424.873 1.157 1.956 2.13 2.012.89.05 1.114-.543 2.193-.543 1.08 0 1.25.568 2.22.54 1.045-.028 1.636-.957 2.13-1.666.565-.815.795-1.636.812-1.674-.02-.008-1.572-.614-1.587-2.42-.016-1.515 1.223-2.243 1.278-2.278-.716-1.05-1.815-1.173-2.467-1.21z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUpPage;
