import React, { useState } from 'react';

const defaultTodos = [
  { id: 't1', text: 'Meeting with CEO', done: false, starred: false },
  { id: 't2', text: 'Pick up kids from school', done: false, starred: true },
  { id: 't3', text: 'Shopping with Brother', done: false, starred: false },
  { id: 't4', text: "Going to Dia's School", done: false, starred: false },
  { id: 't5', text: 'Check design files', done: false, starred: true },
  { id: 't6', text: 'Update file', done: false, starred: false },
];

const TodoAddPage: React.FC = () => {
  const [draft, setDraft] = useState('');

  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">Add New To-Do</h1>

      <section className="admin-card">
        <div className="admin-toolbar">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your task name here"
          />
          <button className="admin-btn" type="button">
            Save
          </button>
        </div>

        {defaultTodos.map((t) => (
          <div className="admin-todo-item" key={t.id}>
            <div>
              <input type="checkbox" checked={t.done} readOnly /> <span>{t.text}</span>
            </div>
            <div>{t.starred ? '★' : '☆'} | Delete</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TodoAddPage;

