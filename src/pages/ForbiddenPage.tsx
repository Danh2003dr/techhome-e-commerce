import React from 'react';
import { Link } from 'react-router-dom';

const ForbiddenPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">403</h1>
    <p className="text-slate-500 mt-2">Bạn không có quyền truy cập trang này.</p>
    <Link to="/" className="mt-6 text-primary font-semibold hover:underline">Về trang chủ</Link>
  </div>
);

export default ForbiddenPage;
