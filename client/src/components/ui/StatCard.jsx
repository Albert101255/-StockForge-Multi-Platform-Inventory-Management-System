import React from 'react';

export const StatCard = ({ title, value, iconPath }) => {
  return (
    <div className="bg-surface border border-border rounded p-6 flex items-center space-x-4 hover:-translate-y-1 hover:border-l-4 hover:border-l-accent hover:border-r-border hover:border-y-border transition-all duration-200 cursor-default group">
      <div className="flex-shrink-0 w-16 h-16 bg-elevated rounded flex items-center justify-center p-3 opacity-80 group-hover:opacity-100 transition-opacity">
        <img src={iconPath} alt={title} className="w-full h-full object-contain" />
      </div>
      <div>
        <p className="text-text-secondary text-sm font-sans uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-display font-bold text-text-primary mt-1">{value}</p>
      </div>
    </div>
  );
};
