import React from 'react';

const SEOSettingsPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">SEO Settings</h1>
      <section className="admin-card">
        <div className="admin-form-grid">
          <input placeholder="SEO Title" defaultValue="TechHome e-commerce" />
          <input placeholder="SEO Keywords" defaultValue="techhome, ecommerce, mobile, audio" />
          <textarea placeholder="SEO Description" defaultValue="TechHome is an e-commerce platform for modern devices." />
          <textarea placeholder="Meta tags (JSON or comma-separated)" defaultValue="og:title, og:description, twitter:card" />
          <div />
          <div />
        </div>

        <div className="admin-logo-upload">
          <div className="admin-logo-preview" aria-label="Logo preview">
            Logo preview
          </div>
          <label className="admin-btn secondary admin-logo-choose">
            Choose logo
            <input type="file" accept="image/*" />
          </label>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn">
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default SEOSettingsPage;
