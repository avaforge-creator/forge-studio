
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/projects', label: 'Projects', icon: 'folder_open' },
  { path: '/standup', label: 'Executive Standup', icon: 'groups' },
  { path: '/tasks', label: 'Task Manager', icon: 'view_kanban' },
  { path: '/org', label: 'Org Chart', icon: 'account_tree' },
  { path: '/workspace', label: 'Agent Workspace', icon: 'smart_toy' },
  { path: '/logs', label: 'Overnight Log', icon: 'bedtime' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#141414] border-r border-forge-border flex flex-col shrink-0 h-screen z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#b38b4d] rounded-xl flex items-center justify-center shadow-glow-gold">
          <span className="material-symbols-outlined text-black font-bold">bolt</span>
        </div>
        <div>
          <h1 className="font-extrabold text-lg leading-tight text-white font-display">Forge AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-primary/80 font-medium">Studio</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-pill transition-all group ${
                isActive 
                ? 'bg-[#2C2E33]/50 text-white border border-primary/20 shadow-sm' 
                : 'text-forge-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-8 space-y-4">
        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-pill text-forge-text-muted hover:text-white hover:bg-white/5 transition-all group">
          <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 border-t border-forge-border pt-4">
          <img 
            alt="Director" 
            className="w-10 h-10 rounded-full border border-forge-border object-cover"
            src="https://picsum.photos/seed/director/100/100" 
          />
          <div className="flex flex-col">
            <p className="text-sm font-bold text-white leading-tight">Director</p>
            <button className="text-[10px] text-forge-text-muted text-left hover:text-white transition-colors">Logout</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
