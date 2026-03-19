import React from 'react';
import { useParams } from 'react-router-dom';

import { generateInvoicePDF } from '@/utils/generateInvoicePDF';

const InvoicePage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Invoice #{orderId}</h1>

      <section className="admin-card">
        <div className="admin-invoice-meta">
          <div>
            <div className="admin-invoice-meta-title">Invoice To</div>
            <div className="admin-invoice-meta-value">Christine Brooks</div>
            <div className="admin-invoice-meta-sub">089 Kutch Green Apt.</div>
          </div>
          <div>
            <div className="admin-invoice-meta-title">Invoice From</div>
            <div className="admin-invoice-meta-value">TechHome E-Commerce</div>
            <div className="admin-invoice-meta-sub">support@techhome.example</div>
          </div>
          <div>
            <div className="admin-invoice-meta-title">Issue Date</div>
            <div className="admin-invoice-meta-value">04 Sep 2019</div>
          </div>
          <div>
            <div className="admin-invoice-meta-title">Due Date</div>
            <div className="admin-invoice-meta-value">04 Oct 2019</div>
          </div>
        </div>

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

        <div className="admin-invoice-summary">
          <div />
          <div />
          <div />
          <div className="admin-invoice-total">
            <div style={{ fontWeight: 800, marginBottom: 6, color: '#2a3448' }}>Total</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>$4640</div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button
            className="admin-btn secondary"
            type="button"
            onClick={() => {
              void generateInvoicePDF({ orderId });
            }}
          >
            Print
          </button>
          <button
            className="admin-btn"
            type="button"
            onClick={() => {
              // Placeholder: download/pdf generation can be wired later.
              void generateInvoicePDF({ orderId });
            }}
          >
            Download PDF
          </button>
        </div>
      </section>
    </div>
  );
};

export default InvoicePage;
