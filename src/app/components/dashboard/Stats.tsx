import React from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
};

export function StatCard({ label, value, change, trend }: StatCardProps) {
  return (
    <div className="bg-white px-4 py-5 shadow rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      {change && (
        <div className="mt-2">
          <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}

export function StatsGrid({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}