import React, { useState, useEffect } from 'react';
import { useScope } from '../context/ScopeContext';
import { useOpenClawData, formatContextDisplay } from '../hooks/useOpenClawData';

interface TopHeaderProps {
  onMenuClick: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick }) => {
  const { scope, setScope } = useScope();
  const [searchFocused, setSearchFocused] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get real OpenClaw data
  const { 
    contextUsed, 
    contextLimit, 
    contextPercent, 
    totalTokens,
    dailySpend,
    isLoading: dataLoading,
    lastUpdate 
  } = useOpenClawData(3000);

  // Update time every second for the clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global live status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Determine context bar color based on usage
  const getContextColor = () => {
    if (contextPercent > 80) return 'bg-forge-rose';
    if (contextPercent > 60) return 'bg-forge-amber';
    return 'bg-forge-emerald';
  };

  return (
    <header className="h-16 bg-[#1A1B1E] border-b border-forge-border flex items-center justify-between px-4 lg:px-8 shrink-0 z-40">
      <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-forge-text-muted hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Search - hidden on small mobile, simplified on mobile */}
        <div className={`relative group flex-1 ${searchFocused ? 'flex' : 'hidden md:flex'} max-w-96`}>
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-text-muted group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input 
            className="block w-full bg-[#121212] border-none rounded-lg py-2 pl-10 pr-3 text-sm text-forge-text-main focus:ring-1 focus:ring-primary transition-all placeholder:text-forge-text-muted/50 min-h-[44px]" 
            placeholder="Search agents, tasks, projects..." 
            type="text"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Mobile search toggle */}
        <button 
          className="md:hidden p-2 text-forge-text-muted hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setSearchFocused(!searchFocused)}
        >
          <span className="material-symbols-outlined text-[24px]">search</span>
        </button>

        {/* Global Scope Toggle - hidden on small mobile */}
        <div className="hidden sm:flex bg-[#121212] p-1 rounded-pill border border-forge-border ml-0 lg:ml-2">
          <button 
            onClick={() => setScope('PRIVATE')}
            className={`px-3 lg:px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 lg:gap-2 transition-all min-h-[36px] ${
              scope === 'PRIVATE' 
              ? 'bg-forge-surface text-primary shadow-glow-gold' 
              : 'text-forge-text-muted hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{scope === 'PRIVATE' ? 'lock' : 'lock_open'}</span>
            <span className="hidden lg:inline">Private</span>
          </button>
          <button 
            onClick={() => setScope('COMPANY')}
            className={`px-3 lg:px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 lg:gap-2 transition-all min-h-[36px] ${
              scope === 'COMPANY' 
              ? 'bg-forge-surface text-forge-emerald shadow-glow-emerald' 
              : 'text-forge-text-muted hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
            <span className="hidden lg:inline">Company</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Context Limit Display - REAL DATA */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121212] rounded-pill border border-forge-border">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-forge-text-muted uppercase font-bold tracking-wider">Context</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-white">
                {formatContextDisplay(contextUsed, contextLimit)}
              </span>
              <span className="text-[10px] font-mono text-forge-text-muted">
                ({Math.round(contextPercent)}%)
              </span>
            </div>
          </div>
          {/* Context bar */}
          <div className="w-16 h-2 bg-[#2C2E33] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getContextColor()}`}
              style={{ width: `${Math.min(contextPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Mobile context display */}
        <div className="md:hidden flex items-center gap-1 px-2 py-1 bg-[#121212] rounded-pill border border-forge-border">
          <span className="material-symbols-outlined text-[14px] text-forge-emerald">memory</span>
          <span className="text-[10px] font-mono font-bold text-white">
            {formatContextDisplay(contextUsed, contextLimit)}
          </span>
        </div>

        {/* Mobile scope toggle */}
        <div className="sm:hidden flex bg-[#121212] p-0.5 rounded-pill border border-forge-border">
          <button 
            onClick={() => setScope('PRIVATE')}
            className={`px-2 py-1 rounded-pill text-[8px] font-black uppercase tracking-[0.1em] flex items-center gap-1 transition-all min-h-[32px] ${
              scope === 'PRIVATE' ? 'bg-forge-surface text-primary' : 'text-forge-text-muted'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">{scope === 'PRIVATE' ? 'lock' : 'lock_open'}</span>
          </button>
          <button 
            onClick={() => setScope('COMPANY')}
            className={`px-2 py-1 rounded-pill text-[8px] font-black uppercase tracking-[0.1em] flex items-center gap-1 transition-all min-h-[32px] ${
              scope === 'COMPANY' ? 'bg-forge-surface text-forge-emerald' : 'text-forge-text-muted'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">corporate_fare</span>
          </button>
        </div>

        {/* Environment selector */}
        <button className="hidden sm:flex items-center gap-2 lg:gap-3 bg-[#2C2E33] hover:bg-[#34363b] border border-[#3C3E44] pl-3 lg:pl-4 pr-2 lg:pr-3 py-1.5 rounded-pill transition-colors group min-h-[44px]">
          <div className="w-2 h-2 rounded-full bg-forge-emerald shadow-[0_0_8px_rgba(105,219,124,0.6)] animate-pulse"></div>
          <span className="text-xs font-medium text-forge-text-main hidden lg:inline">Production Env</span>
          <span className="material-symbols-outlined text-forge-text-muted text-[18px] group-hover:text-white transition-colors">expand_more</span>
        </button>
        
        {/* Notifications */}
        <button className="text-forge-text-muted hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
