import React from 'react';
import { Link } from 'react-router-dom';

const SEOSettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">SEO Settings</h1>
          <p className="text-xs font-semibold text-slate-500">Trống (sẽ nối API + save)</p>
        </div>

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">SEO Form (placeholder)</div>
          <div className="text-xs font-semibold text-slate-500">Title / Description / Keywords / Meta tags</div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-bold text-slate-600">SEO Title</span>
            <input
              disabled
              placeholder="(Placeholder)"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-600">SEO Keywords</span>
            <input
              disabled
              placeholder="(Placeholder)"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-xs font-bold text-slate-600">SEO Description</span>
            <textarea
              disabled
              placeholder="(Placeholder)"
              rows={5}
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-xs font-bold text-slate-600">Meta Tags (raw)</span>
            <textarea
              disabled
              placeholder="og:title, og:description, twitter:card ..."
              rows={3}
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700 cursor-not-allowed"
            />
          </label>

          <div className="lg:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled
              className="opacity-60 cursor-not-allowed inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold"
            >
              <span className="material-icons text-[18px]">save</span>
              Save (disabled)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SEOSettingsPage;

