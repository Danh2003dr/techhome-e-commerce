import React from 'react';
import { Link, useParams } from 'react-router-dom';

const InboxListVariantPage: React.FC = () => {
  const { variantId } = useParams();
  const id = Number(variantId);

  // #6: no row selected
  // #7: select one row to show the template interaction state
  const selectedRow = id === 7 ? '2' : null;

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
              {[
                {
                  rowId: '1',
                  to: '/admin/inbox/1',
                  sender: 'Minerva Barnett',
                  label: <span className="admin-badge completed">Primary</span>,
                  message: 'Our Bachelor of Commerce program is ACBSP-accredited.',
                  time: '8:38 AM',
                  star: '☆',
                },
                {
                  rowId: '2',
                  to: '/admin/inbox/2',
                  sender: 'Peter Lewis',
                  label: <span className="admin-badge processing">Friends</span>,
                  message: 'Vacation Home Rental Success',
                  time: '7:52 PM',
                  star: '★',
                },
                {
                  rowId: '3',
                  to: '/admin/inbox/3',
                  sender: 'Cecile Webster',
                  label: <span className="admin-badge rejected">Social</span>,
                  message: 'Always Look On The Bright Side Of Life',
                  time: '3:52 PM',
                  star: '☆',
                },
              ].map((row) => (
                <tr key={row.rowId} className={selectedRow === row.rowId ? 'admin-inbox-row-selected' : undefined}>
                  <td>
                    <input type="checkbox" aria-label="Select message" />
                  </td>
                  <td style={{ textAlign: 'center' }}>{row.star}</td>
                  <td>
                    <Link to={row.to} className="admin-btn link">
                      {row.sender}
                    </Link>
                  </td>
                  <td>{row.label}</td>
                  <td>{row.message}</td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InboxListVariantPage;

