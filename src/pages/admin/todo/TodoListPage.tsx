import React from 'react';
import { Link } from 'react-router-dom';

const todoList = [
  'Meeting with CEO',
  'Pick up kids from school',
  'Shopping with Brother',
  "Going to Dia's School",
  'Check design files',
  'Update file',
];

const TodoListPage: React.FC = () => {
  return (
    <div className="admin-content-grid">
      <h1 className="admin-page-title">To-Do List</h1>
      <section className="admin-card">
        <div className="admin-toolbar">
          <Link to="/admin/todo/new" className="admin-btn" aria-label="Add New Task">
            Add New Task
          </Link>
        </div>

        {todoList.map((todo) => (
          <div className="admin-todo-item" key={todo}>
            <div>
              <input type="checkbox" /> <span>{todo}</span>
            </div>
            <div>Star | Delete</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TodoListPage;
