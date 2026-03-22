import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { customerSegments } from './dashboardMockData';

const chartSize = 200;

const CustomerChart: React.FC = () => {
  const data = useMemo(
    () =>
      customerSegments.map((s) => ({
        name: s.label,
        value: s.value,
        color: s.color,
      })),
    [],
  );

  const newCustomers = customerSegments.find((s) => s.key === 'new')?.value ?? 0;
  const repeated = customerSegments.find((s) => s.key === 'repeated')?.value ?? 0;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-full min-h-[280px]">
      <h2 className="text-base font-bold text-slate-900 mb-4">Customers</h2>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={86}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => v.toLocaleString('en-US')}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center sm:text-left space-y-2 max-w-[200px]">
          <p className="text-lg font-bold text-slate-900">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 align-middle mr-2" aria-hidden />
            {newCustomers.toLocaleString('en-US')} New Customers
          </p>
          <p className="text-sm font-semibold text-slate-500">{repeated.toLocaleString('en-US')} Repeated</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerChart;
