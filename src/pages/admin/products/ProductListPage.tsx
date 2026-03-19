import React from 'react';
import { Link } from 'react-router-dom';

const ProductListPage: React.FC = () => {
  const products = [
    {
      id: '1',
      name: 'Apple Watch Series 4',
      category: 'Digital Product',
      price: 699,
      stock: 63,
      colors: ['Black', 'Silver', 'Blue'],
    },
    {
      id: '2',
      name: 'Microsoft Headsquare',
      category: 'Digital Product',
      price: 190,
      stock: 13,
      colors: ['Red', 'Green'],
    },
  ];

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Products</h1>

      <section className="admin-card">
        <div className="admin-toolbar">
          <input type="text" placeholder="Search product name" />
          <Link className="admin-btn" to="/admin/products/new">
            Add New Product
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Piece</th>
              <th>Available Color</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="admin-product-thumb" aria-hidden />
                </td>
                <td style={{ fontWeight: 800 }}>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="admin-color-chips">
                    {p.colors.map((c) => (
                      <span key={c} className="admin-color-chip">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <Link to={`/admin/products/${p.id}`} className="admin-btn secondary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ProductListPage;
