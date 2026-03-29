import React from 'react';
import type { DashboardStat } from './dashboardTypes';

type StatCardProps = {
  stat: DashboardStat;
};

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{stat.value}</p>
          <p className="mt-2 text-xs text-slate-500 leading-snug">{stat.subtitle}</p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.iconWrapClass}`}
          aria-hidden
        >
          <span className="material-icons text-[22px]">{stat.icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
