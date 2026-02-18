import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCOPED_DATA } from '../constants';
import { useScope } from '../context/ScopeContext';
import { useAuth } from '../context/AuthContext';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { useOpenClawData, formatTokens } from '../hooks/useOpenClawData';

const DashboardView: React.FC = () => {
  const { scope, agents, tasks, setAgents, setTasks } = useScope();
  const { user } = useAuth();
  const navigate = useNavigate();
  const data = SCOPED_DATA[scope];

  // Get REAL OpenClaw data
  const { 
    totalTokens, 
    dailySpend, 
    contextUsed, 
    contextLimit,
    contextPercent,
    agents: openclawAgents,
    isLoading: dataLoading 
  } = useOpenClawData(3000);

  const tasksCount = tasks.length;
  const blockedCount = tasks.filter(t => t.executionState === 'blocked').length;

  // Live updates hook
  const { isLive, isUpdating, lastUpdate, toggleLive } = useLiveUpdates(
    agents, 
    tasks, 
    setAgents, 
    setTasks, 
    4000
  );

  // Get current date info
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Get all sessions for context tokens table
  const { sessions: allSessions } = useOpenClawData(3000);
  
  // Calculate total context tokens across all sessions
  const totalContextUsed = allSessions.reduce((sum, s) => sum + (s.totalTokens || 0), 0);
  const totalContextLimit = allSessions.reduce((sum, s) => sum + (s.contextTokens || 200000), 0);
  const totalContextPercent = totalContextLimit > 0 ? (totalContextUsed / totalContextLimit) * 100 : 0;

  // Helper to format age
  const formatAge = (ageMs: number) => {
    const mins = Math.floor(ageMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (mins > 0) return `${mins}m`;
    return 'now';
  };

  // Helper to get session display name
  const getSessionDisplayName = (key: string) => {
    // Forge AI Group Chat
    if (key.includes('telegram:group') && key.includes('-5243448271')) return 'Forge AI Group';
    if (key.includes('telegram:group')) return 'Telegram Group';
    if (key.includes('telegram')) return 'Telegram DM';
    if (key.includes('cron')) return 'Cron Job';
    
    // Main agent
    if (key === 'agent:main:main' || key.includes('agent:main:')) return 'Ava (Main)';
    
    // Subagents - extract agent name
    if (key.includes(':subagent:')) {
      const match = key.match(/agent:(\w+):subagent/);
      if (match) {
        const agentName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        return `${agentName}`;
      }
      return 'Subagent';
    }
    
    // Other agent sessions - extract agent name
    const agentMatch = key.match(/agent:(\w+)/);
    if (agentMatch) {
      const agentName = agentMatch[1].charAt(0).toUpperCase() + agentMatch[1].slice(1);
      return agentName;
    }
    
    return key.split(':').pop() || key;
  };

  // Calculate monthly projection
  const monthlyProjection = dailySpend * 30;

  return (
    <div className="p-8 md:p-12 space-y-10 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#2C2E33]/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="flex flex-wrap justify-between items-end gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <p className="text-forge-text-muted text-sm tracking-wide uppercase">{dayName}, {dateStr} • <span className="text-forge-emerald font-bold">{scope} LIVE</span></p>
          <h2 className="text-display text-4xl md:text-5xl font-medium text-white tracking-tight">
            {scope === 'PRIVATE' ? `Your Workspace, ${user?.name || 'Director'}.` : `Welcome back, ${user?.name || 'Director'}.`}
          </h2>
        </div>
        
        {/* Live Control */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-pill border transition-all ${
            isLive 
            ? 'bg-forge-emerald/10 border-forge-emerald/30' 
            : 'bg-forge-surface border-forge-border'
          }`}>
            <button 
              onClick={toggleLive}
              className={`flex items-center gap-2 ${isLive ? 'text-forge-emerald' : 'text-forge-text-muted'} hover:opacity-80 transition-all`}
            >
              <div className={`relative flex items-center justify-center`}>
                {isUpdating && (
                  <span className="absolute inset-0 bg-forge-emerald/30 rounded-full animate-ping"></span>
                )}
                <span className={`size-2 rounded-full ${isLive ? 'bg-forge-emerald shadow-glow-emerald' : 'bg-forge-text-muted'}`}></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </button>
          </div>
          {isLive && (
            <span className="text-[9px] text-forge-text-muted font-mono">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {/* Metric Cards - REAL DATA */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {/* Active Agents - REAL from OpenClaw */}
        <div 
          onClick={() => navigate('/workspace')}
          className="bg-forge-surface border border-forge-border rounded-pill px-6 py-4 flex items-center justify-between hover:border-forge-emerald/30 hover:bg-white/5 transition-all cursor-pointer group shadow-sm"
        >
          <div>
            <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block mb-1">Active Agents</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-medium text-white">{openclawAgents.length}</span>
              <span className="w-2 h-2 bg-forge-emerald rounded-full shadow-[0_0_8px_rgba(105,219,124,0.8)] animate-pulse"></span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-forge-emerald/10 flex items-center justify-center group-hover:bg-forge-emerald/20 transition-colors">
            <span className="material-symbols-outlined text-forge-emerald text-xl">smart_toy</span>
          </div>
        </div>

        {/* Tasks In Flight */}
        <div 
          onClick={() => navigate('/tasks')}
          className="bg-forge-surface border border-forge-border rounded-pill px-6 py-4 flex items-center justify-between hover:border-primary/30 hover:bg-white/5 transition-all cursor-pointer group shadow-sm"
        >
          <div>
            <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block mb-1">Tasks In Flight</span>
            <span className="text-2xl font-display font-medium text-white">{tasksCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary text-xl">rocket_launch</span>
          </div>
        </div>

        {/* Blocked */}
        <div 
          onClick={() => navigate('/tasks')}
          className={`bg-forge-surface border rounded-pill px-6 py-4 flex items-center justify-between transition-all cursor-pointer group ${blockedCount > 0 ? 'border-forge-amber/30 shadow-glow-amber bg-forge-amber/5' : 'border-forge-border hover:bg-white/5'}`}
        >
          <div>
            <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block mb-1">Blocked</span>
            <span className={`text-2xl font-display font-medium ${blockedCount > 0 ? 'text-forge-amber' : 'text-white'}`}>{blockedCount}</span>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${blockedCount > 0 ? 'bg-forge-amber/10 animate-bounce' : 'bg-white/5'}`}>
            <span className={`material-symbols-outlined text-xl ${blockedCount > 0 ? 'text-forge-amber' : 'text-forge-text-muted'}`}>warning</span>
          </div>
        </div>

        {/* Daily Spend - REAL from OpenClaw */}
        <div 
          onClick={() => navigate('/projects')}
          className="bg-forge-surface border border-forge-border rounded-pill px-6 py-4 flex items-center justify-between hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group shadow-sm"
        >
          <div>
            <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block mb-1">Today's Spend</span>
            <span className="text-2xl font-display font-medium text-white">${dailySpend.toFixed(2)}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-forge-text-muted group-hover:text-white text-xl">attach_money</span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="space-y-4">
          <h3 className="text-display text-lg font-medium text-white px-2">Today's Priorities</h3>
          <div className="bg-forge-surface border border-forge-border rounded-3xl p-2 min-h-[300px] flex flex-col gap-1">
            {tasks.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                onClick={() => navigate('/tasks')}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="w-6 h-6 rounded-full border-2 border-forge-border group-hover:border-primary flex items-center justify-center transition-colors">
                   <span className="material-symbols-outlined text-[14px] text-primary opacity-0 group-hover:opacity-100">check</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{task.title}</p>
                  <p className="text-xs text-forge-text-muted flex items-center gap-1 mt-1">
                    Assigned to <span className="text-primary/70">{task.assignedTo}</span>
                  </p>
                </div>
                {task.executionState === 'blocked' && <span className="text-[8px] bg-forge-amber/10 text-forge-amber px-2 py-0.5 rounded-full font-bold">URGENT</span>}
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                <span className="text-xs text-forge-text-muted">No priorities found</span>
              </div>
            )}
          </div>
        </div>

        {/* Budget Vitality - REAL DATA */}
        <div className="space-y-4">
          <h3 className="text-display text-lg font-medium text-white px-2">Budget Vitality</h3>
          <div 
            onClick={() => navigate('/projects')}
            className="bg-forge-surface border border-forge-border rounded-3xl p-6 min-h-[300px] flex flex-col justify-between relative overflow-hidden cursor-pointer group hover:border-primary/30 transition-all"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-forge-emerald/5 rounded-full blur-3xl"></div>
            <div className="space-y-6 relative z-10">
              {/* Total Tokens Used - REAL */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm text-forge-text-muted block">Total Tokens Used</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-display font-medium text-white">{formatTokens(totalTokens)}</span>
                    <span className="text-sm text-forge-text-muted">tokens</span>
                  </div>
                </div>
              </div>

              {/* Context Usage - REAL */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-forge-text-muted">Context Usage</span>
                  <span className="text-white font-medium">{formatTokens(contextUsed)} / {formatTokens(contextLimit)}</span>
                </div>
                <div className="w-full h-8 bg-[#2C2E33] rounded-pill overflow-hidden relative border border-white/5">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r rounded-r-pill transition-all duration-1000 ${
                      contextPercent > 80 ? 'from-rose-600 to-forge-rose' :
                      contextPercent > 60 ? 'from-amber-600 to-forge-amber' :
                      'from-emerald-600 to-forge-emerald'
                    }`}
                    style={{ width: `${Math.min(contextPercent, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-forge-text-muted text-center uppercase tracking-widest">
                  {contextPercent.toFixed(1)}% of context • ${monthlyProjection.toFixed(0)}/mo projected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Pulse - REAL from OpenClaw */}
        <div className="space-y-4">
          <h3 className="text-display text-lg font-medium text-white px-2">Agent Pulse</h3>
          <div className="space-y-3">
            {openclawAgents.slice(0, 3).map((agent, idx) => {
              const isActive = agent.lastActiveAgeMs !== null && agent.lastActiveAgeMs < 60000;
              return (
                <div 
                  key={agent.agentId} 
                  onClick={() => navigate('/workspace')}
                  className={`bg-forge-surface border border-forge-border rounded-3xl p-5 hover:border-primary/30 hover:bg-white/5 transition-all cursor-pointer group ${
                    isActive && isLive ? 'relative overflow-hidden' : ''
                  }`}
                >
                  {/* Live activity indicator strip */}
                  {isActive && isLive && (
                    <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-forge-emerald to-primary animate-pulse" style={{ width: `${60 + idx * 15}%` }}></div>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-forge-surface border border-forge-border flex items-center justify-center">
                          <span className="material-symbols-outlined text-forge-emerald">smart_toy</span>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-forge-surface ${
                          isActive 
                            ? 'bg-forge-emerald shadow-glow-emerald animate-pulse' 
                            : agent.lastActiveAgeMs === null
                            ? 'bg-forge-text-muted'
                            : 'bg-forge-amber'
                        }`}></div>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block group-hover:text-primary transition-colors capitalize">{agent.agentId}</span>
                        <span className="text-[10px] text-forge-text-muted uppercase font-bold tracking-tighter">{agent.sessionsCount} sessions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive && isLive && (
                        <span className="text-[8px] bg-forge-emerald/10 text-forge-emerald px-2 py-0.5 rounded font-bold animate-pulse">ACTIVE</span>
                      )}
                      <span className="material-symbols-outlined text-forge-text-muted text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {openclawAgents.length === 0 && (
              <div className="bg-forge-surface border border-forge-border rounded-3xl p-5 flex items-center justify-center">
                <span className="text-forge-text-muted text-sm">No active agents</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Context Tokens - All Sessions Table */}
      <section className="relative z-10">
        <h3 className="text-display text-lg font-medium text-white px-2 mb-4">Context Tokens</h3>
        <div className="bg-forge-surface border border-forge-border rounded-3xl overflow-hidden">
          {/* Summary */}
          <div className="p-4 border-b border-forge-border flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block">Total Used</span>
                <span className="text-xl font-display font-medium text-white">{formatTokens(totalContextUsed)}</span>
              </div>
              <div>
                <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block">Limit</span>
                <span className="text-xl font-display font-medium text-white">{formatTokens(totalContextLimit)}</span>
              </div>
              <div>
                <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block">Percent</span>
                <span className={`text-xl font-display font-medium ${totalContextPercent > 80 ? 'text-forge-rose' : totalContextPercent > 50 ? 'text-forge-amber' : 'text-forge-emerald'}`}>
                  {totalContextPercent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-forge-text-muted">
              {allSessions.length} active sessions
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-forge-text-muted uppercase tracking-widest font-bold border-b border-forge-border">
                  <th className="px-6 py-3">Session</th>
                  <th className="px-6 py-3">Kind</th>
                  <th className="px-6 py-3">Age</th>
                  <th className="px-6 py-3">Tokens</th>
                  <th className="px-6 py-3">Percent</th>
                </tr>
              </thead>
              <tbody>
                {allSessions.map((session, idx) => (
                  <tr key={session.sessionId || idx} className="border-b border-forge-border/50 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white" title={session.key}>
                        {getSessionDisplayName(session.key)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        session.kind === 'direct' ? 'bg-primary/20 text-primary' :
                        session.kind === 'group' ? 'bg-forge-emerald/20 text-forge-emerald' :
                        'bg-forge-amber/20 text-forge-amber'
                      }`}>
                        {session.kind}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-forge-text-muted">
                      {formatAge(session.age)}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-white">
                      {formatTokens(session.totalTokens)} / {formatTokens(session.contextTokens || 200000)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-[#2C2E33] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              session.percentUsed > 80 ? 'bg-forge-rose' :
                              session.percentUsed > 50 ? 'bg-forge-amber' :
                              'bg-forge-emerald'
                            }`}
                            style={{ width: `${Math.min(session.percentUsed, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-forge-text-muted w-10">{session.percentUsed?.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allSessions.length === 0 && (
            <div className="p-8 text-center text-forge-text-muted">
              No active sessions
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
