
import React from 'react';
import { useScope } from '../context/ScopeContext';

const TopHeader: React.FC = () => {
  const { scope, setScope } = useScope();

  return (
    <header className="h-16 bg-[#1A1B1E] border-b border-forge-border flex items-center justify-between px-8 shrink-0 z-40">
      <div className="flex items-center gap-6">
        <div className="relative w-96 group">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-text-muted group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input 
            className="block w-full bg-[#121212] border-none rounded-lg py-2 pl-10 pr-3 text-sm text-forge-text-main focus:ring-1 focus:ring-primary transition-all placeholder:text-forge-text-muted/50" 
            placeholder="Search architecture, agents, or tasks..." 
            type="text"
          />
        </div>

        {/* Global Scope Toggle */}
        <div className="flex bg-[#121212] p-1 rounded-pill border border-forge-border ml-2">
          <button 
            onClick={() => setScope('PRIVATE')}
            className={`px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all ${
              scope === 'PRIVATE' 
              ? 'bg-forge-surface text-primary shadow-glow-gold' 
              : 'text-forge-text-muted hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{scope === 'PRIVATE' ? 'lock' : 'lock_open'}</span>
            Private
          </button>
          <button 
            onClick={() => setScope('COMPANY')}
            className={`px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all ${
              scope === 'COMPANY' 
              ? 'bg-forge-surface text-forge-emerald shadow-glow-emerald' 
              : 'text-forge-text-muted hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
            Company
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-3 bg-[#2C2E33] hover:bg-[#34363b] border border-[#3C3E44] pl-4 pr-3 py-1.5 rounded-pill transition-colors group">
          <div className="w-2 h-2 rounded-full bg-forge-emerald shadow-[0_0_8px_rgba(105,219,124,0.6)] animate-pulse"></div>
          <span className="text-xs font-medium text-forge-text-main">Production Env</span>
          <span className="material-symbols-outlined text-forge-text-muted text-[18px] group-hover:text-white transition-colors">expand_more</span>
        </button>
        
        <button className="text-forge-text-muted hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
