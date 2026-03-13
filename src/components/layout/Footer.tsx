import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg text-white">
                <span className="material-icons text-xl">devices</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tech<span className="text-primary">Home</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Your one-stop destination for the latest technology and smart home solutions.
            </p>
            <h5 className="font-bold text-sm mb-4">Subscribe to our newsletter</h5>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="flex-grow bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary px-4 py-2"
                placeholder="Email address"
              />
              <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Customer Service</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary">Shipping Information</a></li>
              <li><a href="#" className="hover:text-primary">Order Status</a></li>
              <li><a href="#" className="hover:text-primary">Store Locator</a></li>
            </ul>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="material-icons text-sm text-primary">local_shipping</span>
                <span>Free Shipping over $35</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="material-icons text-sm text-primary">verified</span>
                <span>Price Match Guarantee</span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">About Us</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary">Our Story</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Sustainability</a></li>
              <li><a href="#" className="hover:text-primary">Investor Relations</a></li>
              <li><a href="#" className="hover:text-primary">TechHome Blog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Stay Connected</h5>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                <span className="material-icons text-xl">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                <span className="material-icons text-xl">alternate_email</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                <span className="material-icons text-xl">camera_alt</span>
              </a>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Need help? Call us</p>
              <p className="text-lg font-bold text-primary">1-800-TECH-HOME</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2024 TechHome E-Commerce. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Use</a>
            <a href="#" className="hover:text-primary">Accessibility</a>
            <a href="#" className="hover:text-primary">Cookie Settings</a>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">VISA</div>
            <div className="h-6 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">MASTER</div>
            <div className="h-6 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">AMEX</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
