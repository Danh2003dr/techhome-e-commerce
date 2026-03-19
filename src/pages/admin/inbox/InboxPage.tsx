import React from 'react';

const InboxPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Inbox</h1>
      <section className="admin-inbox">
        <aside className="admin-card">
          <button className="admin-btn" type="button">
            Compose
          </button>
          <ul className="admin-list">
            <li>Inbox (1253)</li>
            <li>Starred (245)</li>
            <li>Sent (24532)</li>
            <li>Draft (9)</li>
            <li>Spam (14)</li>
          </ul>
        </aside>

        <div className="admin-card">
          <div className="admin-toolbar">
            <input type="text" placeholder="Search mail" />
          </div>
          <table className="admin-table">
            <tbody>
              <tr>
                <td>Minerva Barnett</td>
                <td>
                  <span className="admin-badge completed">Primary</span>
                </td>
                <td>Our Bachelor of Commerce program is ACBSP-accredited.</td>
                <td>8:38 AM</td>
              </tr>
              <tr>
                <td>Peter Lewis</td>
                <td>
                  <span className="admin-badge processing">Friends</span>
                </td>
                <td>Vacation Home Rental Success</td>
                <td>7:52 PM</td>
              </tr>
              <tr>
                <td>Cecile Webster</td>
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
