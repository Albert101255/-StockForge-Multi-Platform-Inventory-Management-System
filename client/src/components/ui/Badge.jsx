import React from 'react';
import { cn } from './Button';

export const Badge = ({ status, className, children }) => {
  const statusStyles = {
    instock: 'bg-success/10 text-success border-success/20',
    low: 'bg-warning/10 text-warning border-warning/20',
    out: 'bg-danger/10 text-danger border-danger/20'
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded text-xs font-mono font-medium border uppercase tracking-wider inline-flex items-center",
      statusStyles[status] || 'bg-elevated text-text-secondary border-border',
      className
    )}>
      {status === 'instock' && <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5" />}
      {status === 'low' && <span className="w-1.5 h-1.5 rounded-full bg-warning mr-1.5" />}
      {status === 'out' && <span className="w-1.5 h-1.5 rounded-full bg-danger mr-1.5" />}
      {children}
    </span>
  );
};
