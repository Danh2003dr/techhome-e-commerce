import React from 'react';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const days = Array.from({ length: 35 }, (_, i) => i + 1);

const CalendarPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Calendar</h1>
      <section className="admin-inbox">
        <aside className="admin-card">
          <button className="admin-btn" type="button">
            Add New Event
          </button>
          <ul className="admin-list">
            <li>Design Conference</li>
            <li>Weekend Festival</li>
            <li>Glastonbury Festival</li>
            <li>Ultra Europe</li>
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
        </div>
      </section>
    </div>
  );
};

export default CalendarPage;
