import React from 'react';
import { Link } from 'react-router-dom';

const OrderListPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Order Lists</h1>
      <section className="admin-card">
        <div className="admin-toolbar">
          <select defaultValue="">
            <option value="" disabled>
              Filter by date
            </option>
            <option>14 Feb 2019</option>
            <option>15 Feb 2019</option>
          </select>
          <select defaultValue="">
            <option value="" disabled>
              Order type
            </option>
            <option>Electric</option>
            <option>Book</option>
            <option>Medicine</option>
          </select>
          <select defaultValue="">
            <option value="" disabled>
              Order status
            </option>
            <option>Processing</option>
            <option>Shipping</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <button className="admin-btn secondary" type="button">
            Reset Filter
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00001</td>
              <td>Christine Brooks</td>
              <td>089 Kutch Green Apt.</td>
              <td>04 Sep 2019</td>
              <td>Electric</td>
              <td>
                <span className="admin-badge completed">Completed</span>
              </td>
              <td>
                <Link className="admin-btn secondary" to="/admin/orders/00001">
                  View
                </Link>
              </td>
            </tr>
            <tr>
              <td>00002</td>
              <td>Rosie Pearson</td>
              <td>979 Immanuel Ferry Suite 526</td>
              <td>28 May 2019</td>
              <td>Book</td>
              <td>
                <span className="admin-badge processing">Processing</span>
              </td>
              <td>
                <Link className="admin-btn secondary" to="/admin/orders/00002">
                  View
                </Link>
              </td>
            </tr>
            <tr>
              <td>00003</td>
              <td>Darrel Caldwell</td>
              <td>8587 Frida Ports</td>
              <td>23 Nov 2019</td>
              <td>Medicine</td>
              <td>
                <span className="admin-badge rejected">Rejected</span>
              </td>
              <td>
                <Link className="admin-btn secondary" to="/admin/orders/00003">
                  View
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrderListPage;
