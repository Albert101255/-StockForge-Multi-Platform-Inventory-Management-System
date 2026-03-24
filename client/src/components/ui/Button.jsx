import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium rounded transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent text-[#0F0F0F] hover:bg-accent-dim border border-transparent font-bold",
    secondary: "bg-transparent text-accent border border-accent hover:bg-elevated",
    danger: "bg-danger text-text-primary hover:bg-opacity-80 border border-transparent",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-elevated border border-transparent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
