import React from 'react';
import { useParams } from 'react-router-dom';

const InvoicePage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Invoice #{orderId}</h1>

      <section className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Base Cost</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Children Toy</td>
              <td>2</td>
              <td>$20</td>
              <td>$40</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Makeup</td>
              <td>2</td>
              <td>$50</td>
              <td>$100</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Asian Laptop</td>
              <td>5</td>
              <td>$100</td>
              <td>$500</td>
            </tr>
            <tr>
              <td>4</td>
              <td>iPhone X</td>
              <td>4</td>
              <td>$1000</td>
              <td>$4000</td>
            </tr>
          </tbody>
        </table>
        <div className="admin-form-actions">
          <button className="admin-btn secondary" type="button">
            Print
          </button>
          <button className="admin-btn" type="button">
            Send
          </button>
        </div>
      </section>
    </div>
  );
};

export default InvoicePage;
