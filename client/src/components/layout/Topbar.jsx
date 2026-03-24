import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0 relative z-20 shadow-sm">
      <div className="flex-1">
        <div className="text-text-muted font-mono text-xs hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-text-secondary hover:text-accent transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-elevated border border-border flex items-center justify-center text-accent">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary capitalize leading-tight">{user?.name}</span>
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">{user?.role}</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="ml-4 text-text-secondary hover:text-danger transition-colors p-2 rounded hover:bg-danger/10 focus:outline-none"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
