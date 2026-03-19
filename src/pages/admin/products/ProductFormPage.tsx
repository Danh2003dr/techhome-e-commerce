import React from 'react';
import { useParams } from 'react-router-dom';

const ProductFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <section className="admin-card">
        <div className="admin-form-grid">
          <input placeholder="Product name" defaultValue={isEdit ? 'Apple Watch Series 4' : ''} />
          <input placeholder="Category" defaultValue={isEdit ? 'Digital Product' : ''} />
          <input placeholder="Price" defaultValue={isEdit ? '699.00' : ''} />
          <input placeholder="Stock quantity" defaultValue={isEdit ? '63' : ''} />
          <textarea placeholder="Short description" />
          <textarea placeholder="Specifications (key-value, one per line)" />
        </div>
        <div className="admin-form-actions">
          <button className="admin-btn secondary" type="button">
            Upload Images
          </button>
          <button className="admin-btn" type="button">
            Save Product
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductFormPage;
