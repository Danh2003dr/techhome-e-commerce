import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Dashboard</h1>

      <section className="admin-kpi-grid">
        <article className="admin-card admin-kpi-card">
          <h4>Total User</h4>
          <div className="admin-kpi-value">40,689</div>
        </article>
        <article className="admin-card admin-kpi-card">
          <h4>Total Order</h4>
          <div className="admin-kpi-value">10,293</div>
        </article>
        <article className="admin-card admin-kpi-card">
          <h4>Total Sales</h4>
          <div className="admin-kpi-value">$89,000</div>
        </article>
        <article className="admin-card admin-kpi-card">
          <h4>Total Pending</h4>
          <div className="admin-kpi-value">2,040</div>
        </article>
      </section>

      <section className="admin-card">
        <h3>Sales Details</h3>
        <div className="admin-placeholder-chart">Line chart placeholder (Dashboard #1/#2)</div>
      </section>

      <section className="admin-card">
        <h3>Deals Details</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Location</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apple Watch</td>
              <td>6096 Marjolaine Landing</td>
              <td>12.09.2019</td>
              <td>$423</td>
              <td>
                <span className="admin-badge completed">Delivered</span>
              </td>
            </tr>
            <tr>
              <td>iPhone X</td>
              <td>786 Destiny Lake</td>
              <td>05.02.2019</td>
              <td>$1000</td>
              <td>
                <span className="admin-badge processing">Processing</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
