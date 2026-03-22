import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  description: string;
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const days = Array.from({ length: 35 }, (_, i) => i + 1);

const CalendarPage: React.FC = () => {
  const events = useMemo<CalendarEvent[]>(
    () => [
      {
        id: 'e1',
        title: 'Design Conference',
        date: 'Oct 5',
        location: 'Lyndon Convention Center',
        time: '12:30 BOT',
        description: 'A design conference placeholder event with static data to match the template UI state.',
      },
      {
        id: 'e2',
        title: 'Weekend Festival',
        date: 'Oct 12',
        location: 'Central Park',
        time: '8:00 PM',
        description: 'Festival details placeholder for Dashboard #19 event detail overlay.',
      },
      {
        id: 'e3',
        title: 'Glastonbury Festival',
        date: 'Oct 16',
        location: 'Glastonbury',
        time: '6:00 PM',
        description: 'Glastonbury festival placeholder.',
      },
    ],
    []
  );

  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? 'e1');
  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? events[0];

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Calendar</h1>
      <section className="admin-inbox">
        <aside className="admin-card">
          <Link to="/admin/calendar/new" className="admin-btn" aria-label="Add New Event">
            Add New Event
          </Link>
          <ul className="admin-list">
            {events.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  className={`admin-filter-button`}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: e.id === selectedEventId ? '#edf2ff' : '#ffffff',
                    borderColor: e.id === selectedEventId ? '#2f6ef7' : '#e3e9f4',
                    color: e.id === selectedEventId ? '#2f6ef7' : undefined,
                  }}
                  onClick={() => setSelectedEventId(e.id)}
                >
                  {e.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="admin-card">
          <div className="admin-toolbar">
            <strong>October 2019</strong>
          </div>
          <div className="admin-calendar-grid">
            {weekDays.map((d) => (
              <div key={d} className="admin-calendar-cell">
                <strong>{d}</strong>
              </div>
            ))}
            {days.map((d) => (
              <div key={d} className="admin-calendar-cell">
                {d}
              </div>
            ))}
          </div>

          {selectedEvent && (
            <div
              style={{
                marginTop: 12,
                borderTop: '1px solid #eef2f8',
                paddingTop: 12,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{selectedEvent.title}</div>
              <div style={{ color: '#6a748b', fontSize: 13, lineHeight: 1.4, marginBottom: 8 }}>
                {selectedEvent.date} · {selectedEvent.time}
              </div>
              <div style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.4 }}>{selectedEvent.description}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CalendarPage;
