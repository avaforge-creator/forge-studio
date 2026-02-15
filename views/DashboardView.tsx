
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SCOPED_DATA } from '../constants';
import { useScope } from '../context/ScopeContext';

const DashboardView: React.FC = () => {
  const { scope, agents, tasks } = useScope();
  const navigate = useNavigate();
  const data = SCOPED_DATA[scope];

  const tasksCount = tasks.length;
  const blockedCount = tasks.filter(t => t.executionState === 'blocked').length;

  return (
    <div className="p-8 md:p-12 space-y-10 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#2C2E33]/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="flex flex-wrap justify-between items-end gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <p className="text-forge-text-muted text-sm tracking-wide uppercase">Tuesday, Oct 24 • <span className="text-forge-emerald font-bold">{scope} LIVE</span></p>
          <h2 className="text-display text-4xl md:text-5xl font-medium text-white tracking-tight">
            {scope === 'PRIVATE' ? 'Your Workspace, Director.' : 'Good morning, Director.'}
          </h2>
        </div>
      </header>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div 
          onClick={() => navigate('/workspace')}
          className="bg-forge-surface border border-forge-border rounded-pill px-6 py-4 flex items-center justify-between hover:border-forge-emerald/30 hover:bg-white/5 transition-all cursor-pointer group shadow-sm"
        >
          <div>
            <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block mb-1">Active Agents</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-medium text-white">{agents.length}</span>
              <span className="w-2 h-2 bg-forge-emerald rounded-full shadow-[0_0_8px_rgba(105,219,124,0.8)] animate-pulse"></span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-forge-emerald/10 flex items-center justify-center group-hover:bg-forge-emerald/20 transition-colors">
            <span className="material-symbols-outlined text-forge-emerald text-xl">smart_toy</span>
          </div>
        </div>

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

        <div 
          onClick={() => navigate('/projects')}
          className="bg-forge-surface border border-forge-border rounded-pill px-6 py-4 flex items-center justify-between hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group shadow-sm"
        >
          <div>
            <span className="text-[10px] text-forge-text-muted uppercase tracking-widest font-bold block mb-1">Daily Spend</span>
            <span className="text-2xl font-display font-medium text-white">${data.stats.spend.toFixed(2)}</span>
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

        <div className="space-y-4">
          <h3 className="text-display text-lg font-medium text-white px-2">Budget Vitality</h3>
          <div 
            onClick={() => navigate('/projects')}
            className="bg-forge-surface border border-forge-border rounded-3xl p-6 min-h-[300px] flex flex-col justify-between relative overflow-hidden cursor-pointer group hover:border-primary/30 transition-all"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-forge-emerald/5 rounded-full blur-3xl"></div>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm text-forge-text-muted block">Projected Monthly Spend</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-display font-medium text-white">${(data.stats.spend * 30).toFixed(0)}</span>
                    <span className="text-sm text-forge-text-muted">/ ${scope === 'PRIVATE' ? '100' : '1000'} Limit</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-8 bg-[#2C2E33] rounded-pill overflow-hidden relative border border-white/5">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-forge-emerald rounded-r-pill shadow-glow-emerald transition-all duration-1000" style={{ width: scope === 'PRIVATE' ? '5%' : '45%' }}></div>
                </div>
                <p className="text-[10px] text-forge-text-muted text-center uppercase tracking-widest">Click to view project allocation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-display text-lg font-medium text-white px-2">Agent Pulse</h3>
          <div className="space-y-3">
            {agents.slice(0, 3).map(agent => (
              <div 
                key={agent.id} 
                onClick={() => navigate('/workspace')}
                className="bg-forge-surface border border-forge-border rounded-3xl p-5 hover:border-primary/30 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={agent.avatar} className="w-10 h-10 rounded-full border border-forge-border" alt={agent.name} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-forge-surface ${agent.status === 'active' ? 'bg-forge-emerald shadow-glow-emerald' : 'bg-forge-text-muted'}`}></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block group-hover:text-primary transition-colors">{agent.name}</span>
                      <span className="text-[10px] text-forge-text-muted uppercase font-bold tracking-tighter">{agent.role}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-forge-text-muted text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
