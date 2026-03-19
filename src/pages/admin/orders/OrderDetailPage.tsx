import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Order Detail #{orderId}</h1>

      <section className="admin-card">
        <div className="admin-toolbar">
          <select defaultValue="Processing">
            <option>Processing</option>
            <option>Shipping</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <Link to={`/admin/orders/${orderId}/invoice`} className="admin-btn secondary">
            Open Invoice
          </Link>
          <button type="button" className="admin-btn">
            Save Status
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>iPhone X</td>
              <td>4</td>
              <td>$1000</td>
              <td>$4000</td>
            </tr>
            <tr>
              <td>Children Toy</td>
              <td>2</td>
              <td>$20</td>
              <td>$40</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrderDetailPage;
