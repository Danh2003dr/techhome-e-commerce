import React from 'react';
import { useParams } from 'react-router-dom';

import ProductImageUpload from './ProductImageUpload';
import ProductSpecsManager from './ProductSpecsManager';

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
          <select defaultValue={isEdit ? 'yes' : 'no'}>
            <option value="yes">Featured</option>
            <option value="no">Not Featured</option>
          </select>
          <textarea placeholder="Short description" defaultValue={isEdit ? 'Placeholder short description for UI alignment.' : ''} />
          <textarea placeholder="Available colors (comma-separated)" defaultValue={isEdit ? 'Black, Silver, Blue' : ''} />
        </div>

        <div className="admin-form-actions" style={{ justifyContent: 'space-between' }}>
          <button className="admin-btn secondary" type="button">
            Save Draft
          </button>
          <button className="admin-btn" type="button">
            {isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>

        <div className="admin-product-form-sections">
          <ProductImageUpload />
          <ProductSpecsManager />
        </div>
      </section>
    </div>
  );
};

export default ProductFormPage;
