import React from 'react';
import { Link } from 'react-router-dom';

const AccountFooter: React.FC = () => {
  return (
    <footer className="mt-20 py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-icons text-white text-xl">devices</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tech<span className="text-primary">Home</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your one-stop destination for premium electronics and smart home solutions. We provide high-quality gadgets for modern living.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
          <ul className="text-[14px] text-slate-500 space-y-3">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Returns & Refunds
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
          <ul className="text-[14px] text-slate-500 space-y-3">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6">Newsletter</h4>
          <p className="text-[14px] text-slate-500 mb-5 leading-relaxed">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary"
              placeholder="Email address"
              type="email"
            />
            <button type="submit" className="bg-primary text-white px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-md">
              <span className="material-icons">send</span>
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-slate-400">© 2024 TechHome E-commerce. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">leaderboard</span>
          </a>
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">share</span>
          </a>
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">rss_feed</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AccountFooter;

