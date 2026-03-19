import React from 'react';
import { Link } from 'react-router-dom';

const ProductListPage: React.FC = () => {
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
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apple Watch Series 4</td>
              <td>Digital Product</td>
              <td>$699.00</td>
              <td>63</td>
              <td>
                <Link to="/admin/products/1" className="admin-btn secondary">
                  Edit
                </Link>
              </td>
            </tr>
            <tr>
              <td>Microsoft Headsquare</td>
              <td>Digital Product</td>
              <td>$190.00</td>
              <td>13</td>
              <td>
                <Link to="/admin/products/2" className="admin-btn secondary">
                  Edit
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ProductListPage;
