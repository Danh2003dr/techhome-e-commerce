import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const ProfilePage: React.FC = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10">
        <AccountSidebar />

        {/* Main */}
        <main className="flex-grow space-y-8 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <Breadcrumb
                items={[
                  { label: 'Home', path: '/' },
                  { label: 'Account', path: '/profile' },
                  { label: 'Profile' },
                ]}
              />
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
              <p className="text-slate-500 mt-1.5">Manage your account settings and security preferences.</p>
            </div>
            <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md w-full lg:w-auto">
              <div className="relative group flex-shrink-0">
                <img
                  alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr-5cpNGoo6_fXpCQEnJFpyIGX4571JMorTIFS1W_oR0yGp1IBTI1_wLO51A6b6JfC_35uve5CoPYM2-is77gcOReXdd7VPBeLws-awri7PskL8u2xh1eUq1gEueTXzsqrp1FazpahCNs2KQX5oD6Y71wxx9yphpqUC_70AN9j0OhuIPUMTQtlrRSkHGsR-Ae0MukU5Jd4FVlVWsEW6CT2kWvy2xncJ-4KiWGLTbYe6MdSfuaEhKi8EN4oTy2OdUS4X6E2bOW0w5E"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800"
                />
                <button type="button" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons text-white">photo_camera</span>
                </button>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Profile Picture</h3>
                <p className="text-[12px] text-slate-500 mb-3">JPG, GIF or PNG. Max 2MB.</p>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-2 bg-primary text-white text-[12px] font-bold rounded-lg hover:bg-blue-600 transition-colors">Upload New</button>
                  <button type="button" className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[12px] font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-icons text-primary">badge</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-primary text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="material-icons text-lg">edit</span>
                  Edit
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                  <input readOnly className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary transition-all" type="text" value="Alex Johnson" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                  <input readOnly className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary transition-all" type="email" value="alex.johnson@example.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                  <input readOnly className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary transition-all" type="tel" value="+1 (555) 000-1234" />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <span className="material-icons text-primary">security</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security</h2>
              </div>
              <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Current Password</label>
                  <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••••••" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">New Password</label>
                    <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••••••" type="password" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Confirm Password</label>
                    <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••••••" type="password" />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">Update Password</button>
                </div>
              </form>
            </section>
          </div>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <span className="material-icons text-primary">notifications</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
            </div>
            <div className="px-8 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-slate-500 mt-0.5">Receive order updates and newsletter.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary after:border-gray-300" />
                </label>
              </div>
              <div className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">SMS Alerts</p>
                  <p className="text-sm text-slate-500 mt-0.5">Real-time shipping notifications via text.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary after:border-gray-300" />
                </label>
              </div>
              <div className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                </div>
                <button type="button" className="text-primary text-sm font-bold border-2 border-primary/20 bg-primary/5 px-6 py-2 rounded-xl hover:bg-primary/10 transition-colors">Enable</button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default ProfilePage;
