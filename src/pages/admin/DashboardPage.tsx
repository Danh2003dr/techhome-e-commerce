import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>

      {/* Trống theo yêu cầu: để dành cho KPI / chart / table sau */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[420px] shadow-sm" />
    </div>
  );
};

export default DashboardPage;

