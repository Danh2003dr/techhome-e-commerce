import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lDtOWdtvTAComqx_FIcYGd0LKUHzj1yVoEkdeFRs4gma9bRJXwiHagA2GM38DCjjunKNiwmDDa_XtnxjO-vlxrviz5xR3JYqNkfIXb3JxGK6NPhoFCHOmCcIsAVlJjrZ-6JHIDrFrjERrwfCr2IVGv1n1p0LOP_n_TGjAE9GBj5b3f71v12Wo7SrvlT8fkGZFwgVotVa9_GpoaWLlLlLxE2TSMNnCZo_OIaBhNXnVojXqoEtNM8ZHYeEs4bMNGr9AP9N_PLXCGU';

const COMPARE_PRODUCTS = [
  { id: 'lumina-pro-15', name: 'Lumina Pro 15', price: 1099, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUoCsMK4JWh-g9lFOfFuegtLvslfewfjOyEwIgCNbpXJE_i5PeN9W-BKjojc40J-9ptVOmY0dUmawouxKWtkbml7y15qU8nfxpHC-OVx3eS941d66O4TB2gntWg2H4sfFA54rDLOjJ7w37M5ZhSuK1fuxb_R5cAFhcbdmNq1tzxcPXyTKKYQxxeRlwUqe-AfB2bZLwP34njiPIMScvsk95Ayx5AlW66TYWKu7uudFvzpLZ2f0LBeZZHWorrxdkGtYaMoDdV6gWEQo' },
  { id: 'apex-ultra-x', name: 'Apex Ultra X', price: 1199, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjMYF9ZsFYNVV0v0Pw78mevjEodhVlPRRNdgfFdtOqAk-NR4jB3Ba4eLzvG5eMWV0okj8HTI1Bu04ECNKDFl9tkaPh9t5wop7AHAG1emd4fHtir7O-LW93la5qPqtg2cXxWp3umOKql7EpPuP7JMH-ERQXg8TVbw4VLT-0NuLPKTb5r-8WCqQ3udJSboxJxG3U-DFrnEaq320K0IlrF9VExpkFDmA2HnnTQGYpsBcwR84TqhYlI-t7DRzLiYO59TZhIDtVxioTwg8' },
  { id: 'zenith-fold-5', name: 'Zenith Fold 5', price: 1499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGL86Fncdl6dNJw_QFM5EVOu234jik3PXWuO8K5GVirrQMIyUHxB1Jpf8_CyIXRAhU90FWY4AYOAf3xq1dKib5oPBD8pJOPVhTiBIP3yGT20PT05rasJiMMqnc4NT9sUNZjlu5xAr-cWO2kNJus-8frTCXA6jmjmGmK49KWVWzROqf241WuPaYsX-GYFcfQOBqOUow0dH9E9UUFz3jwNdmsEwvYSCflk22qX349wlHevWcWg0c0ERiHPsyXPf13yZU7NybevBJ4Q8' },
];

const COMPARE_SECTIONS = [
  {
    title: 'Display',
    icon: 'smartphone',
    rows: [
      { label: 'Screen Size', values: ['6.1-inch Super Retina', '6.8-inch Dynamic AMOLED', '7.6-inch Foldable OLED'], highlight: false },
      { label: 'Refresh Rate', values: ['120Hz ProMotion', '1-120Hz Adaptive', '120Hz LTPO'], highlight: true },
      { label: 'Peak Brightness', values: ['2000 nits', '2600 nits', '1750 nits'], highlight: false },
    ],
  },
  {
    title: 'Performance',
    icon: 'memory',
    rows: [
      { label: 'Processor', values: ['A17 Bionic Chip', 'Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2'], highlight: true },
      { label: 'RAM', values: ['8GB LPDDR5X', '12GB LPDDR5X', '12GB LPDDR5X'], highlight: false },
      { label: 'Storage Options', values: ['128GB, 256GB, 512GB, 1TB', '256GB, 512GB, 1TB', '256GB, 512GB, 1TB'], highlight: false },
    ],
  },
  {
    title: 'Camera System',
    icon: 'photo_camera',
    rows: [
      { label: 'Main Sensor', values: ['48MP Wide (f/1.78)', '200MP Wide (f/1.7)', '50MP Wide (f/1.8)'], highlight: true },
      { label: 'Optical Zoom', values: ['3x Optical', '5x & 10x Optical', '3x Optical'], highlight: false },
      { label: 'Video', values: ['4K60 Dolby Vision', '8K30 / 4K120', '4K60 HDR10+'], highlight: false },
    ],
  },
  {
    title: 'Battery & Power',
    icon: 'battery_charging_full',
    rows: [
      { label: 'Capacity', values: ['3,274 mAh', '5,000 mAh', '4,400 mAh'], highlight: false },
      { label: 'Wired Charging', values: ['20W Fast Charge', '45W Super Fast', '25W Fast Charge'], highlight: true },
      { label: 'Wireless', values: ['15W MagSafe', '15W Qi', '15W Qi'], highlight: false },
    ],
  },
  {
    title: 'Connectivity',
    icon: 'wifi',
    rows: [
      { label: 'Network', values: ['5G Sub-6 & mmWave', '5G Sub-6 & mmWave', '5G Sub-6 & mmWave'], highlight: false },
      { label: 'WiFi Standard', values: ['Wi-Fi 6E', 'Wi-Fi 7 Ready', 'Wi-Fi 6E'], highlight: true },
    ],
  },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

const ComparePage: React.FC = () => {
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="material-icons">devices</span>
              TechHome
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/search" className="hover:text-primary transition-colors">Products</Link>
              <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
              <Link to="/compare" className="text-primary border-b-2 border-primary">Compare</Link>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search devices..." type="text" />
            </div>
            <Link to="/cart" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <span className="material-icons">shopping_cart</span>
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
              <img alt="Profile" className="w-full h-full object-cover" src={PROFILE_IMAGE} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header & toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <nav className="flex text-sm text-slate-500 mb-2 gap-2">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/category/mobile" className="hover:text-primary">Smartphones</Link>
              <span>/</span>
              <span className="text-primary">Comparison</span>
            </nav>
            <h1 className="text-3xl font-bold">Compare Flagship Devices</h1>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-2">Highlight differences</span>
            <button
              type="button"
              role="switch"
              aria-checked={highlightDifferences}
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${highlightDifferences ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${highlightDifferences ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Sticky comparison header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 -mx-6 px-6 py-4 mb-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 items-center">
            <div className="col-span-3 text-lg font-bold text-slate-400">Comparing {COMPARE_PRODUCTS.length} Items</div>
            {COMPARE_PRODUCTS.map((p) => (
              <div key={p.id} className="col-span-3 flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-lg flex-shrink-0">
                  <img alt={p.name} className="w-full h-full object-contain p-2" src={p.image} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{p.name}</h3>
                  <p className="text-primary font-bold">{formatPrice(p.price)}</p>
                  <Link to="/cart" className="mt-1 inline-block text-[10px] bg-primary text-white px-2 py-1 rounded font-bold uppercase tracking-wider hover:bg-blue-600">
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {COMPARE_SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex items-center gap-2 font-bold text-slate-500 uppercase text-xs tracking-widest">
                <span className="material-icons text-sm">{section.icon}</span>
                {section.title}
              </div>
              {section.rows.map((row) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-12 divide-x divide-slate-100 dark:divide-slate-800 ${highlightDifferences && row.highlight ? 'bg-primary/5' : ''}`}
                >
                  <div className="col-span-3 p-6 text-sm font-medium text-slate-500">{row.label}</div>
                  {row.values.map((val, i) => (
                    <div key={i} className="col-span-3 p-6 text-sm">
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          {/* Table footer actions */}
          <div className="grid grid-cols-12 divide-x divide-slate-100 dark:divide-slate-800">
            <div className="col-span-3 p-6 bg-slate-50 dark:bg-slate-800/50" />
            {COMPARE_PRODUCTS.map((p) => (
              <div key={p.id} className="col-span-3 p-6 text-center">
                <Link to="/cart" className="block w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors mb-3">
                  Add to Cart
                </Link>
                <Link to="/wishlist" className="text-xs font-bold text-primary hover:underline">
                  Save to Wishlist
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA blocks */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 flex items-center gap-6">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-3xl">verified_user</span>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-1 text-primary">Need Expert Help?</h4>
              <p className="text-slate-600 dark:text-slate-400">Our tech specialists are available 24/7 to help you choose the perfect device for your needs.</p>
              <button type="button" className="mt-4 text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Chat with an expert <span className="material-icons text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-8 flex items-center gap-6">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-3xl">swap_horiz</span>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-1">TechHome Trade-In</h4>
              <p className="text-slate-400">Get up to $800 credit towards your new flagship when you trade in your old smartphone.</p>
              <button type="button" className="mt-4 text-white font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Estimate trade-in value <span className="material-icons text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-icons">devices</span>
            TechHome
          </Link>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Refund Policy</a>
            <a href="#" className="hover:text-primary">Shipping Info</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
              <span className="material-icons">facebook</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
              <span className="material-icons">language</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-12 text-xs text-slate-400">© 2024 TechHome Electronics Inc. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default ComparePage;
