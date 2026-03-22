import React, { useState } from 'react';
import {
  Area,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from 'recharts';
import { MONTH_OPTIONS, revenueAreaData } from './dashboardMockData';

const chartHeight = 320;

const RevenueChart: React.FC = () => {
  const [month, setMonth] = useState<(typeof MONTH_OPTIONS)[number]>('October');

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-bold text-slate-900">Revenue</h2>
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
          <AreaChart data={revenueAreaData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="revSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="revProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              formatter={(v: number, name: string) => [
                v.toLocaleString('en-US'),
                name === 'sales' ? 'Sales' : 'Profit',
              ]}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#fb923c"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revSales)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
