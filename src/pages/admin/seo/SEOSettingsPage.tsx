import React from 'react';

const SEOSettingsPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">General Settings</h1>
      <section className="admin-card">
        <div className="admin-form-grid">
          <input placeholder="Site name" defaultValue="TechHome" />
          <input placeholder="Copyright" defaultValue="All rights reserved by TechHome" />
          <input placeholder="SEO title" defaultValue="TechHome e-commerce" />
          <input placeholder="SEO keywords" defaultValue="techhome, ecommerce, mobile, audio" />
          <textarea placeholder="SEO description" defaultValue="TechHome is an e-commerce platform for modern devices." />
          <textarea placeholder="Meta tags (JSON or comma-separated)" defaultValue="og:title, og:description, twitter:card" />
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
