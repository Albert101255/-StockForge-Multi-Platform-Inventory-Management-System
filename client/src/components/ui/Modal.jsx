import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './Button';

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-base/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className={cn(
        "relative w-full max-w-lg bg-surface border border-border shadow-2xl rounded p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200",
        className
      )}>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border sticky top-0 bg-surface z-10 pt-2 -mt-2">
          <h2 className="text-2xl font-display font-semibold text-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mt-2 text-text-primary">
          {children}
        </div>
      </div>
    </div>
  );
};
