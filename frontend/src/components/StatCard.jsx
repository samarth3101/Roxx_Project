import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="craft-card p-4 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8A8578] font-normal">{title}</span>
        {Icon && (
          <div className="text-[#8A8578]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-[28px] font-semibold text-[#1A1815] leading-none tabular-nums tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-[#8A8578] mt-1.5 font-normal">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
