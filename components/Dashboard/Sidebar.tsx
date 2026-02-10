import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../data';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-5rem)]">
      <nav className="flex-1 px-4 py-8 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${
              currentPath === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="material-icons">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3.5 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold">
          <span className="material-icons">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
