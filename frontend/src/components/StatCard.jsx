import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    indigo: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    },
  };

  const currentTheme = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 ${currentTheme.bg} border ${currentTheme.border} transition-all duration-200 shadow-sm hover:shadow-md group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-3xl font-extrabold font-display text-slate-900 mt-1.5 tracking-tight">
            {value}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl ${currentTheme.iconBg} shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
