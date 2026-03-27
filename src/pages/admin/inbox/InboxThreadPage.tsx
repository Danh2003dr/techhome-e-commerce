import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type Message = {
  id: string;
  side: 'left' | 'right';
  title: string;
  body: string;
  time: string;
};

const InboxThreadPage: React.FC = () => {
  const { threadId } = useParams();
  const [messageDraft, setMessageDraft] = useState('');

  const { headerName, messages } = useMemo(() => {
    const id = threadId ?? '1';
    if (id === '1') {
      return {
        headerName: 'Minerva Barnett',
        messages: [
          {
            id: 'm1',
            side: 'left',
            title: 'Our Bachelor of Commerce program is ACBSP-accredited.',
            body: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            time: '8:38 AM',
          },
          {
            id: 'm2',
            side: 'right',
            title: 'Thanks!',
            body: 'This is a reply message placeholder aligned to the right.',
            time: '8:41 AM',
          },
        ] satisfies Message[],
      };
    }

    if (id === '2') {
      return {
        headerName: 'Peter Lewis',
        messages: [
          {
            id: 'm1',
            side: 'left',
            title: 'Vacation Home Rental Success',
            body: 'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
            time: '7:52 PM',
          },
          {
            id: 'm2',
            side: 'left',
            title: 'Next steps',
            body: 'Please review and we will follow up shortly.',
            time: '7:54 PM',
          },
        ] satisfies Message[],
      };
    }

    return {
      headerName: 'Cecile Webster',
      messages: [
        {
          id: 'm1',
          side: 'left',
          title: 'Always Look On The Bright Side Of Life',
          body: 'All messages here are static UI placeholders for the admin template.',
          time: '3:52 PM',
        },
      ] satisfies Message[],
    };
  }, [threadId]);

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Inbox</h1>

      <section className="admin-chat">
        <aside className="admin-card">
          <button className="admin-btn" type="button">
            Compose
          </button>
          <ul className="admin-list">
            <li>
              <Link to="/admin/inbox" className="admin-btn link">
                Inbox (1253)
              </Link>
            </li>
            <li>Starred (245)</li>
            <li>Sent (24532)</li>
            <li>Draft (9)</li>
            <li>Spam (14)</li>
          </ul>
        </aside>

        <div className="admin-card admin-chat-thread">
          <div className="admin-chat-header">
            <div style={{ fontWeight: 900, color: '#2a3448' }}>{headerName}</div>
            <div className="admin-chat-header-actions" aria-label="Conversation actions">
              <button type="button" className="admin-icon-btn" aria-label="Archive">
                <span className="material-icons" aria-hidden>
                  archive
                </span>
              </button>
              <button type="button" className="admin-icon-btn" aria-label="Delete">
                <span className="material-icons" aria-hidden>
                  delete
                </span>
              </button>
            </div>
          </div>

          <div className="admin-message-list" aria-label="Message list">
            {messages.map((m) => (
              <div key={m.id} className={`admin-bubble ${m.side}`}>
                <div style={{ fontWeight: 800, fontSize: 12, color: '#2a3448', marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.4 }}>{m.body}</div>
                <div style={{ fontSize: 11, color: '#6a748b', marginTop: 8 }}>{m.time}</div>
              </div>
            ))}
          </div>

          <div className="admin-chat-input">
            <input
              value={messageDraft}
              onChange={(e) => setMessageDraft(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button
              type="button"
              className="admin-btn"
              onClick={() => setMessageDraft('')}
              aria-label="Gửi tin nhắn"
            >
              Gửi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InboxThreadPage;

