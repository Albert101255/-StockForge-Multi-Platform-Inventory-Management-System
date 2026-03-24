import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Trash2, FolderTree } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/inventory', icon: Package },
    { label: 'Categories', path: '/categories', icon: FolderTree },
    { label: 'Trash', path: '/trash', icon: Trash2 },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      <div className="p-6 flex items-center space-x-3 border-b border-border">
        <img src="/assets/icons/logo.svg" alt="StockForge Logo" className="w-8 h-8" />
        <span className="text-2xl font-display font-bold text-accent tracking-wider leading-none mt-1">STOCKFORGE</span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 font-sans ${
                  isActive
                    ? 'bg-elevated text-accent border-l-4 border-accent shadow-sm'
                    : 'text-text-secondary hover:bg-elevated hover:text-text-primary border-l-4 border-transparent'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border text-xs text-text-muted font-mono text-center">
        SYSTEM VER 1.0.0-BETA
      </div>
    </aside>
  );
};

export default Sidebar;
