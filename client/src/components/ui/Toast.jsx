import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from './Button';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={cn(
              "flex items-center p-4 rounded shadow-2xl border pointer-events-auto transform transition-all duration-300 animate-in slide-in-from-right-8 fade-in",
              toast.type === 'success' ? "bg-surface border-success text-text-primary" : "bg-surface border-danger text-text-primary"
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="text-success mr-3" size={20} />
            ) : (
              <XCircle className="text-danger mr-3" size={20} />
            )}
            <p className="mr-8 font-sans text-sm">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
