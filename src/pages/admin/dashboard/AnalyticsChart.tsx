import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { analyticsYearData } from './dashboardMockData';

const chartHeight = 220;

const AnalyticsChart: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-full min-h-[280px]">
      <h2 className="text-base font-bold text-slate-900 mb-4">Sales Analytics</h2>
      <div className="flex-1 min-h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={analyticsYearData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="seriesA"
              name="Channel A"
              stroke="#4880FF"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="seriesB"
              name="Channel B"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
