
import React, { useState } from 'react';
import { useScope } from '../context/ScopeContext';
import { Agent } from '../types';

const AgentCard: React.FC<{ agent: Agent; pillarColor?: string }> = ({ agent, pillarColor }) => {
  const getStatusStyle = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-forge-emerald/10 text-forge-emerald border-forge-emerald/20';
      case 'scaffolded': return 'bg-forge-amber/10 text-forge-amber border-forge-amber/20';
      case 'deprecated': return 'bg-forge-rose/10 text-forge-rose border-forge-rose/20';
      default: return 'bg-forge-surface text-forge-text-muted border-forge-border';
    }
  };

  const getStatusDotColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-forge-emerald shadow-glow-emerald';
      case 'scaffolded': return 'bg-forge-amber';
      case 'waiting': return 'bg-forge-amber animate-pulse';
      case 'deprecated': return 'bg-forge-rose';
      default: return 'bg-forge-text-muted';
    }
  };

  return (
    <div className="group relative bg-forge-surface/50 border border-forge-border rounded-xl p-3 hover:border-primary/40 hover:bg-forge-surface transition-all duration-300 shadow-sm cursor-help">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
             <img src={agent.avatar} className="size-8 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt={agent.name} />
             <div className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-forge-bg ${agent.status === 'active' ? 'bg-forge-emerald shadow-glow-emerald' : 'bg-forge-text-muted'}`}></div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <div className={`size-1.5 rounded-full shrink-0 ${getStatusDotColor(agent.status)}`}></div>
              <p className="text-xs font-bold text-white truncate leading-tight">{agent.name || 'Initial Unit'}</p>
            </div>
            <p className="text-[9px] text-forge-text-muted truncate leading-tight mt-0.5">{agent.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
           <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${getStatusStyle(agent.status)}`}>
             {agent.status}
           </span>
           <span className="text-[7px] font-mono text-forge-text-muted bg-forge-bg/50 px-1 rounded">
             {agent.modelLabel || 'Gemini'}
           </span>
        </div>
      </div>
      
      {/* Tooltip on Hover */}
      <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all -top-12 left-1/2 -translate-x-1/2 bg-[#141517] border border-primary/20 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl pointer-events-none">
        <p className="text-[10px] text-white font-medium">{agent.description || 'No description provided.'}</p>
        <div className="flex gap-3 mt-1 text-[8px] text-forge-text-muted font-mono uppercase">
          <span>Model: {agent.modelLabel}</span>
          <span>Layer: {agent.layer}</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#141517] border-b border-r border-primary/20 rotate-45"></div>
      </div>
    </div>
  );
};

const FunctionalCluster: React.FC<{ 
  title: string; 
  agents: Agent[]; 
  isCollapsed: boolean;
  onToggle: () => void;
  accentColor: string;
}> = ({ title, agents, isCollapsed, onToggle, accentColor }) => {
  if (agents.length === 0) return null;

  return (
    <div className="w-full">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-1 hover:text-white group transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[16px] transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}>expand_more</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted group-hover:text-primary transition-colors">{title}</span>
        </div>
        <span className="text-[9px] font-mono text-forge-text-muted bg-white/5 px-1.5 rounded-full">{agents.length}</span>
      </button>
      
      {!isCollapsed && (
        <div className="mt-2 space-y-2 border-l-2 border-forge-border ml-3 pl-3 py-1">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
};

const PillarPerformanceCard: React.FC<{ 
  name: string; 
  agents: Agent[]; 
  accentColor: string; 
  glowColor: string;
}> = ({ name, agents, accentColor, glowColor }) => {
  const active = agents.filter(a => a.status === 'active').length;
  const total = agents.length;
  const health = total > 0 ? (active / total) * 100 : 0;
  
  return (
    <div className={`bg-forge-surface/30 backdrop-blur-sm border border-forge-border rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 transition-all ${glowColor}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">{name} Vitality</h4>
        <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${health >= 80 ? 'bg-forge-emerald/10 text-forge-emerald' : health >= 50 ? 'bg-forge-amber/10 text-forge-amber' : 'bg-forge-rose/10 text-forge-rose'}`}>
          {health >= 80 ? 'OPTIMAL' : health >= 50 ? 'STABLE' : 'DEGRADED'}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-medium text-white">{active}</span>
        <span className="text-sm text-forge-text-muted font-light">/ {total} Active Agents</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-mono text-forge-text-muted uppercase tracking-wider">
          <span>Resource Allocation</span>
          <span>{Math.round(health)}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#1A1B1E] rounded-full overflow-hidden">
          <div 
            className={`h-full ${accentColor} transition-all duration-1000 shadow-sm`} 
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const OrgChartView: React.FC = () => {
  const { scope, agents } = useScope();
  const [collapsedClusters, setCollapsedClusters] = useState<Record<string, boolean>>({});

  const toggleCluster = (clusterId: string) => {
    setCollapsedClusters(prev => ({ ...prev, [clusterId]: !prev[clusterId] }));
  };

  const expandAll = () => setCollapsedClusters({});
  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    const clusters = [...new Set(agents.map(a => a.cluster).filter(Boolean))] as string[];
    clusters.forEach(c => (all[c] = true));
    setCollapsedClusters(all);
  };

  const getPillarAgents = (layer: string) => agents.filter(a => a.layer === layer);
  const getDepartmentHead = (layer: string) => agents.find(a => a.layer === layer && !a.cluster) || agents.find(a => a.layer === layer);

  return (
    <div className="flex-1 overflow-y-auto bg-grid-subtle relative p-4 md:p-8 pb-24">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">Organization Chart</h2>
          <p className="text-forge-text-muted mt-1 text-sm font-light">
            Forge AI Studio • Workforce Topography • <span className="text-forge-emerald font-bold">{scope}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={expandAll}
            className="px-4 py-2 bg-forge-surface border border-forge-border rounded-pill text-[10px] font-bold uppercase tracking-widest text-forge-text-muted hover:text-white transition-all"
          >
            Expand All
          </button>
          <button 
            onClick={collapseAll}
            className="px-4 py-2 bg-forge-surface border border-forge-border rounded-pill text-[10px] font-bold uppercase tracking-widest text-forge-text-muted hover:text-white transition-all"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 mb-8 relative z-10">
        {[
          { label: 'Chiefs', val: agents.filter(a => a.role.includes('Chief') || a.role.includes('Director') || a.role.length < 5).length, icon: 'shield_person', color: 'text-primary' },
          { label: 'Total Units', val: agents.length, icon: 'group', color: 'text-white' },
          { label: 'Active', val: agents.filter(a => a.status === 'active').length, icon: 'bolt', color: 'text-forge-emerald' },
          { label: 'Scaffolded', val: agents.filter(a => a.status === 'scaffolded').length, icon: 'build', color: 'text-forge-amber' },
          { label: 'Deprecated', val: agents.filter(a => a.status === 'deprecated').length, icon: 'delete_forever', color: 'text-forge-rose' },
        ].map(stat => (
          <div key={stat.label} className="bg-forge-surface/40 backdrop-blur-md border border-forge-border rounded-2xl p-4 shadow-sm hover:border-primary/20 transition-all flex flex-col gap-1 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">{stat.label}</span>
              <span className={`material-symbols-outlined text-[16px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <span className="text-2xl font-display font-medium text-white group-hover:scale-105 transition-transform origin-left">{stat.val}</span>
          </div>
        ))}
      </div>

      {/* Pillar Performance Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
        <PillarPerformanceCard 
          name="Engineering" 
          agents={getPillarAgents('Engineering')} 
          accentColor="bg-blue-500" 
          glowColor="hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        />
        <PillarPerformanceCard 
          name="Marketing" 
          agents={getPillarAgents('Marketing')} 
          accentColor="bg-orange-500" 
          glowColor="hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]"
        />
        <PillarPerformanceCard 
          name="Growth" 
          agents={getPillarAgents('Growth')} 
          accentColor="bg-green-500" 
          glowColor="hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        />
      </div>

      {/* Executive Section */}
      <div className="flex flex-col items-center mb-16 relative z-10">
        <div className="bg-forge-surface p-1 rounded-2xl border-2 border-primary shadow-glow-gold w-full max-w-[320px] relative transition-transform hover:scale-105">
          <div className="flex items-center gap-4 p-4">
            <div className="relative">
              <img alt="Director" className="size-14 rounded-xl object-cover ring-2 ring-primary/20" src="https://picsum.photos/seed/director/200/200" />
              <div className="absolute -top-1 -right-1 size-3 bg-forge-emerald rounded-full border-2 border-forge-bg shadow-glow-emerald"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Director</h3>
                <span className="text-[8px] font-black bg-primary text-black px-1.5 py-0.5 rounded tracking-tighter">HUMAN</span>
              </div>
              <p className="text-primary text-[10px] font-semibold uppercase tracking-widest">Visionary Lead</p>
            </div>
          </div>
        </div>
        
        <div className="connecting-line h-12"></div>

        <div className="bg-[#121212]/80 backdrop-blur-md p-1 rounded-2xl border border-forge-emerald/40 shadow-glow-emerald w-full max-w-[320px] relative group hover:scale-105 transition-transform">
          <div className="flex items-center gap-4 p-4">
            <div className="relative">
              <img alt="AVA" className="size-14 rounded-xl object-cover ring-2 ring-forge-emerald/20 shadow-2xl" src="https://picsum.photos/seed/ava/200/200" />
              <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-xl"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">AVA</h3>
                <span className="text-[8px] font-black bg-forge-emerald text-black px-1.5 py-0.5 rounded tracking-tighter">AI CORE</span>
              </div>
              <p className="text-forge-emerald text-[10px] font-semibold uppercase tracking-widest">Chief Operations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Pillars Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 px-4">
        {[
          { id: 'Engineering', accent: 'border-blue-500/30', text: 'text-blue-400', clusters: ['Backend & Security', 'Frontend & DevOps', 'QA'] },
          { id: 'Marketing', accent: 'border-orange-500/30', text: 'text-orange-400', clusters: ['Content', 'Creative'] },
          { id: 'Growth', accent: 'border-green-500/30', text: 'text-green-400', clusters: ['Products', 'Revenue', 'Community'] },
        ].map((pillar) => {
          const head = getDepartmentHead(pillar.id);
          const pillarAgents = getPillarAgents(pillar.id);
          const customClusters = [...new Set(pillarAgents.map(a => a.cluster).filter(Boolean) as string[])];
          const allClusters = Array.from(new Set([...pillar.clusters, ...customClusters]));
          
          return (
            <div key={pillar.id} className="flex flex-col items-center">
              <div className="h-10 w-px border-l-2 border-forge-border mb-4"></div>
              
              <div className={`w-full bg-forge-surface/60 border ${pillar.accent} rounded-2xl p-4 shadow-xl hover:bg-forge-surface transition-colors cursor-pointer group`}>
                <div className="flex items-center gap-4">
                  <img alt={head?.name} className="size-12 rounded-xl object-cover ring-2 ring-white/5" src={head?.avatar} />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{head?.name || 'Layer Root'}</h4>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${pillar.text}`}>{pillar.id} Layer</p>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px border-l-2 border-forge-border"></div>

              <div className="w-full bg-[#1A1B1E]/40 border border-forge-border rounded-2xl p-4 space-y-4">
                {allClusters.map(clusterName => {
                  const clusterAgents = pillarAgents.filter(a => a.cluster === clusterName || (!a.cluster && clusterName === 'Other'));
                  if (clusterAgents.length === 0 && !pillar.clusters.includes(clusterName)) return null;
                  return (
                    <FunctionalCluster 
                      key={clusterName}
                      title={clusterName}
                      agents={clusterAgents}
                      accentColor={pillar.text}
                      isCollapsed={!!collapsedClusters[clusterName]}
                      onToggle={() => toggleCluster(clusterName)}
                    />
                  );
                })}
                {pillarAgents.filter(a => !a.cluster).map(a => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrgChartView;
