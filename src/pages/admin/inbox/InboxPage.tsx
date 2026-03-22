import React from 'react';
import { Link } from 'react-router-dom';

const InboxPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Inbox</h1>
      <section className="admin-inbox">
        <aside className="admin-card">
          <button className="admin-btn" type="button">
            Compose
          </button>

          <div className="admin-inbox-sidebar-title">My Email</div>
          <ul className="admin-list">
            <li>
              <button type="button" className="admin-folder-item active">
                <span>Inbox</span>
                <span className="admin-folder-count">1253</span>
              </button>
            </li>
            <li>
              <button type="button" className="admin-folder-item" style={{ cursor: 'default' }}>
                <span>Starred</span>
                <span className="admin-folder-count">245</span>
              </button>
            </li>
            <li>
              <button type="button" className="admin-folder-item" style={{ cursor: 'default' }}>
                <span>Sent</span>
                <span className="admin-folder-count">24532</span>
              </button>
            </li>
            <li>
              <button type="button" className="admin-folder-item" style={{ cursor: 'default' }}>
                <span>Draft</span>
                <span className="admin-folder-count">9</span>
              </button>
            </li>
            <li>
              <button type="button" className="admin-folder-item" style={{ cursor: 'default' }}>
                <span>Spam</span>
                <span className="admin-folder-count">14</span>
              </button>
            </li>
          </ul>

          <div className="admin-inbox-sidebar-title">Label</div>
          <div>
            <div className="admin-label-item">
              <span className="admin-label-row">
                <span className="admin-label-dot" style={{ background: '#3b82f6' }} />
                Primary
              </span>
            </div>
            <div className="admin-label-item">
              <span className="admin-label-row">
                <span className="admin-label-dot" style={{ background: '#f472b6' }} />
                Social
              </span>
            </div>
            <div className="admin-label-item">
              <span className="admin-label-row">
                <span className="admin-label-dot" style={{ background: '#8b5cf6' }} />
                Work
              </span>
            </div>
            <div className="admin-label-item">
              <span className="admin-label-row">
                <span className="admin-label-dot" style={{ background: '#22c55e' }} />
                Friends
              </span>
            </div>
          </div>
        </aside>

        <div className="admin-card">
          <div className="admin-toolbar">
            <input type="text" placeholder="Search mail" />
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 44 }} />
                <th style={{ width: 44 }} />
                <th>Sender</th>
                <th>Label</th>
                <th>Message</th>
                <th style={{ width: 90 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" aria-label="Select message" />
                </td>
                <td style={{ textAlign: 'center' }}>☆</td>
                <td>
                  <Link to="/admin/inbox/1" className="admin-btn link">
                    Minerva Barnett
                  </Link>
                </td>
                <td>
                  <span className="admin-badge completed">Primary</span>
                </td>
                <td>Our Bachelor of Commerce program is ACBSP-accredited.</td>
                <td>8:38 AM</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" aria-label="Select message" />
                </td>
                <td style={{ textAlign: 'center' }}>★</td>
                <td>
                  <Link to="/admin/inbox/2" className="admin-btn link">
                    Peter Lewis
                  </Link>
                </td>
                <td>
                  <span className="admin-badge processing">Friends</span>
                </td>
                <td>Vacation Home Rental Success</td>
                <td>7:52 PM</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" aria-label="Select message" />
                </td>
                <td style={{ textAlign: 'center' }}>☆</td>
                <td>
                  <Link to="/admin/inbox/3" className="admin-btn link">
                    Cecile Webster
                  </Link>
                </td>
                <td>
                  <span className="admin-badge rejected">Social</span>
                </td>
                <td>Always Look On The Bright Side Of Life</td>
                <td>3:52 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InboxPage;
