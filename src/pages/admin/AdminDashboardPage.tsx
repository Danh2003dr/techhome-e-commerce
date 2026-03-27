import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Bảng điều khiển</h1>

      <section className="admin-kpi-grid">
        <article className="admin-card admin-kpi-card">
          <h4>Tổng người dùng</h4>
          <div className="admin-kpi-value">40,689</div>
        </article>
        <article className="admin-card admin-kpi-card">
          <h4>Tổng đơn hàng</h4>
          <div className="admin-kpi-value">10,293</div>
        </article>
        <article className="admin-card admin-kpi-card">
          <h4>Tổng doanh thu</h4>
          <div className="admin-kpi-value">$89,000</div>
        </article>
        <article className="admin-card admin-kpi-card">
          <h4>Tổng đang chờ</h4>
          <div className="admin-kpi-value">2,040</div>
        </article>
      </section>

      <section className="admin-card">
        <h3>Chi tiết doanh thu</h3>
        <div className="admin-placeholder-chart">Placeholder biểu đồ (Dashboard #1/#2)</div>
      </section>

      <section className="admin-card">
        <h3>Chi tiết ưu đãi</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Khu vực</th>
              <th>Ngày</th>
              <th>Giá</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apple Watch</td>
              <td>6096 Marjolaine Landing</td>
              <td>12.09.2019</td>
              <td>$423</td>
              <td>
                <span className="admin-badge completed">Đã giao</span>
              </td>
            </tr>
            <tr>
              <td>iPhone X</td>
              <td>786 Destiny Lake</td>
              <td>05.02.2019</td>
              <td>$1000</td>
              <td>
                <span className="admin-badge processing">Đang xử lý</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
