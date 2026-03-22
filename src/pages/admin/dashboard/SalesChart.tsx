import React, { useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MONTH_OPTIONS, salesLineData } from './dashboardMockData';

const chartHeight = 320;

const SalesChart: React.FC = () => {
  const [month, setMonth] = useState<(typeof MONTH_OPTIONS)[number]>('October');

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-bold text-slate-900">Sales Details</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="sr-only">Month</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value as (typeof MONTH_OPTIONS)[number])}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart data={salesLineData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesLineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4880FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4880FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(v: number) => [
                v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                'Sales',
              ]}
              labelFormatter={(label) => `Range ${label}`}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="value" stroke="none" fill="url(#salesLineFill)" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4880FF"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#4880FF', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
