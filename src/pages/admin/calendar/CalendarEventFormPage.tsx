import React from 'react';

const CalendarEventFormPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Add New Event</h1>

      <section className="admin-card">
        <div className="admin-form-grid">
          <input placeholder="Event name" defaultValue="Design Conference" />
          <input placeholder="Time" defaultValue="12:34 BOT" />
          <input placeholder="Date" defaultValue="11-09-2019" />
          <input placeholder="Address" defaultValue="Design Center address" />
          <input placeholder="Contact Number" defaultValue="0123 456 789" />
          <div />
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn">
            Add Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default CalendarEventFormPage;

