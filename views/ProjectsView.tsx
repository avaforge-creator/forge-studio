
import React, { useState, useMemo } from 'react';
import { useScope } from '../context/ScopeContext';
import { Project, Agent } from '../types';

const StatusBadge: React.FC<{ status: Project['status'] }> = ({ status }) => {
  const styles = {
    Active: 'bg-forge-emerald/10 text-forge-emerald border-forge-emerald/30',
    Paused: 'bg-forge-amber/10 text-forge-amber border-forge-amber/30',
    Done: 'bg-white/10 text-white border-white/20',
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles[status]}`}>
      {status}
    </span>
  );
};

const ProjectEditor: React.FC<{ 
  project: Project; 
  agents: Agent[];
  onClose: () => void; 
  onSave: (updatedProject: Project) => void;
  isNew?: boolean;
}> = ({ project, agents, onClose, onSave, isNew }) => {
  const [formData, setFormData] = useState<Project>({ ...project });
  const [activeTab, setActiveTab] = useState<'info' | 'team' | 'logistics'>('info');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'progress' || name === 'tokensUsed' || name === 'estimatedCost' ? parseFloat(value) : value 
    }));
  };

  const toggleAgent = (agentId: string) => {
    setFormData(prev => {
      const assigned = prev.assignedAgents.includes(agentId)
        ? prev.assignedAgents.filter(id => id !== agentId)
        : [...prev.assignedAgents, agentId];
      return { ...prev, assignedAgents: assigned };
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-forge-surface border border-forge-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-forge-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-xl flex items-center justify-center border bg-primary/10 border-primary/20`}>
              <span className={`material-symbols-outlined text-primary`}>
                edit_note
              </span>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">Configure Project</h2>
              <p className="text-xs text-forge-text-muted">
                Updating operational parameters for {project.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-forge-text-muted">close</span>
          </button>
        </div>

        <div className="flex px-6 border-b border-forge-border shrink-0">
          {[
            { id: 'info', label: 'Definitions', icon: 'info' },
            { id: 'team', label: 'Unit Allocation', icon: 'group' },
            { id: 'logistics', label: 'Logistics', icon: 'analytics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-forge-text-muted hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Project Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Initiative Codename..."
                  className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Initial Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Brief Summary</label>
                <input 
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="One sentence overview..."
                  className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Deep Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detailed objectives and success criteria..."
                  className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Allocate Agents to Task</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agents.map(agent => (
                  <button 
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                      formData.assignedAgents.includes(agent.id)
                      ? 'bg-primary/10 border-primary shadow-glow-gold/10'
                      : 'bg-forge-bg/30 border-forge-border hover:border-white/10'
                    }`}
                  >
                    <img src={agent.avatar} className="size-8 rounded-lg" alt={agent.name} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${formData.assignedAgents.includes(agent.id) ? 'text-white' : 'text-forge-text-muted'}`}>{agent.name}</p>
                      <p className="text-[9px] text-forge-text-muted uppercase truncate">{agent.role}</p>
                    </div>
                    {formData.assignedAgents.includes(agent.id) && (
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Performance Vitals</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-forge-text-muted uppercase">Progress Completion</label>
                      <span className="text-[10px] font-mono text-primary font-bold">{formData.progress}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      name="progress"
                      value={formData.progress}
                      onChange={handleChange}
                      className="w-full accent-primary bg-forge-border rounded-lg h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Resource Utilization</h4>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-forge-text-muted uppercase">Tokens Consumed</label>
                      <input 
                        type="number"
                        name="tokensUsed"
                        value={formData.tokensUsed}
                        onChange={handleChange}
                        className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-2 text-white text-sm outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-forge-text-muted uppercase">Estimated Budget ($)</label>
                      <input 
                        type="number"
                        name="estimatedCost"
                        step="0.01"
                        value={formData.estimatedCost}
                        onChange={handleChange}
                        className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-2 text-white text-sm outline-none"
                      />
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-forge-border bg-forge-bg/50 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-pill text-[10px] font-black uppercase tracking-widest text-forge-text-muted hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className={`px-8 py-2.5 bg-primary text-black rounded-pill text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:opacity-90 transition-all`}
          >
            Apply Config
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectsView: React.FC = () => {
  const { scope, agents, projects, setProjects } = useScope();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [selectedProjectId, projects]
  );

  const getAgentById = (id: string) => agents.find(a => a.id === id);

  const handleSaveProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  };

  const openEditor = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
  };

  if (selectedProject) {
    return (
      <div className="flex-1 overflow-y-auto bg-forge-bg p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedProjectId(null)}
          className="flex items-center gap-2 text-forge-text-muted hover:text-white transition-colors mb-8 group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-medium">Back to Projects</span>
        </button>

        <div className="max-w-5xl mx-auto space-y-12">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">{selectedProject.name}</h1>
                <StatusBadge status={selectedProject.status} />
              </div>
              <p className="text-lg text-forge-text-muted font-light max-w-2xl">{selectedProject.description || 'No detailed description provided.'}</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-forge-surface/50 border border-forge-border rounded-2xl p-6 flex gap-8 shadow-sm">
                <div className="text-center">
                  <span className="text-[10px] text-forge-text-muted uppercase tracking-[0.2em] block mb-1">Tokens</span>
                  <span className="text-xl font-display font-medium text-white">{selectedProject.tokensUsed.toLocaleString()}</span>
                </div>
                <div className="w-px h-10 bg-forge-border"></div>
                <div className="text-center">
                  <span className="text-[10px] text-forge-text-muted uppercase tracking-[0.2em] block mb-1">Cost</span>
                  <span className="text-xl font-display font-medium text-primary">${selectedProject.estimatedCost.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={(e) => openEditor(e, selectedProject)}
                className="w-full py-2 bg-forge-surface border border-forge-border text-forge-text-muted rounded-pill text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-primary/40 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Manage Settings
              </button>
            </div>
          </div>

          {/* Progress Breakdown */}
          <section className="bg-forge-surface/30 border border-forge-border rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-display font-medium text-white">Progress Breakdown</h3>
              <span className="text-3xl font-display font-bold text-primary">{selectedProject.progress}%</span>
            </div>
            <div className="h-4 w-full bg-[#1A1B1E] rounded-full overflow-hidden border border-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-forge-emerald rounded-full transition-all duration-1000"
                style={{ width: `${selectedProject.progress}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {['Data Analysis', 'Agent Coordination', 'Final Export'].map((step, idx) => (
                 <div key={step} className="flex items-center gap-3 p-4 bg-[#121212]/50 rounded-2xl border border-forge-border">
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 2 ? 'bg-forge-emerald text-black' : 'border border-forge-text-muted text-forge-text-muted'}`}>
                     {idx < 2 ? '✓' : idx + 1}
                   </div>
                   <span className={`text-xs ${idx < 2 ? 'text-white' : 'text-forge-text-muted'}`}>{step}</span>
                 </div>
               ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Agent Contributions */}
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forge-text-muted">Agent Contributions</h3>
              <div className="space-y-4">
                {selectedProject.assignedAgents.map(id => {
                  const agent = getAgentById(id);
                  if (!agent) return null;
                  return (
                    <div key={id} className="bg-forge-surface/40 border border-forge-border rounded-2xl p-4 flex items-center justify-between group hover:bg-forge-surface transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={agent.avatar} className="size-10 rounded-xl" alt={agent.name} />
                        <div>
                          <p className="text-sm font-bold text-white">{agent.name}</p>
                          <p className="text-[10px] text-primary uppercase font-bold tracking-tighter">{agent.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-forge-text-muted block font-mono">Tasks Complete</span>
                        <span className="text-sm font-bold text-white">{Math.floor(Math.random() * 20) + 5}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Timeline / Activity */}
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forge-text-muted">Project Timeline</h3>
              <div className="relative pl-6 space-y-8">
                <div className="absolute left-[7px] top-2 bottom-0 w-px bg-forge-border"></div>
                {selectedProject.timeline.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[23px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-forge-bg"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-forge-text-muted uppercase tracking-widest">
                        <span>{act.agentName}</span>
                        <span>•</span>
                        <span>{act.timestamp}</span>
                      </div>
                      <p className="text-sm text-white leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                ))}
                {selectedProject.timeline.length === 0 && (
                  <p className="text-xs text-forge-text-muted italic">No activity recorded yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-forge-bg relative p-8 md:p-12">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10">
        <div>
          <h2 className="text-display text-4xl font-bold text-white tracking-tight">Project Hub</h2>
          <p className="text-forge-text-muted text-sm font-light">
            Overview of active initiatives and token resource allocation.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className="group bg-forge-surface/40 backdrop-blur-sm border border-forge-border rounded-3xl p-6 hover:bg-forge-surface hover:border-primary/30 transition-all cursor-pointer shadow-sm flex flex-col gap-6"
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors truncate">{project.name || 'Unnamed Project'}</h3>
                <p className="text-[10px] text-forge-text-muted font-mono mt-0.5">Updated {project.lastUpdated}</p>
              </div>
              <StatusBadge status={project.status} />
            </div>

            <p className="text-xs text-forge-text-muted leading-relaxed line-clamp-2 min-h-[32px]">
              {project.summary || 'Initial initiative pending detailed briefing.'}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-forge-text-muted">
                <span>Progress</span>
                <span className="text-white">{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A1B1E] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-forge-border/50 mt-auto">
              <div className="flex -space-x-2">
                {project.assignedAgents.length > 0 ? project.assignedAgents.map((id, idx) => {
                  const agent = getAgentById(id);
                  return (
                    <img 
                      key={id} 
                      src={agent?.avatar} 
                      className="size-7 rounded-full border-2 border-forge-bg ring-1 ring-white/5 object-cover" 
                      title={agent?.name}
                      alt={agent?.name}
                    />
                  );
                }) : <span className="text-[9px] text-forge-text-muted italic">No agents assigned</span>}
              </div>
              <div className="text-right">
                <span className="text-[9px] text-forge-text-muted uppercase tracking-widest block font-bold">Estimated Cost</span>
                <span className="text-sm font-display font-medium text-white">${project.estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <ProjectEditor 
          project={editingProject}
          agents={agents}
          onClose={() => {
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default ProjectsView;
