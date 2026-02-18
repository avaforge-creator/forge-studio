
import React, { useState, useEffect, useMemo } from 'react';
import { Agent, Task } from '../types';
import { useScope } from '../context/ScopeContext';
import { useLiveUpdates } from '../hooks/useLiveUpdates';

const BLANK_AGENT = (id: string): Agent => ({
  id,
  name: '',
  role: '',
  layer: 'Operations',
  avatar: `https://picsum.photos/seed/${id}/200/200`,
  status: 'scaffolded',
  model: 'gemini-3-flash-preview',
  modelLabel: 'Flash 3',
  description: '',
  personalityMarkdown: '# New Agent Instructions\n\nDefine the operational parameters for this agent here.',
  capabilities: [],
  specs: { version: '1.0-scaffold', temp: 0.7, context: '128k', latency: '300ms' },
  reasoningLog: ['Instance initialized. Awaiting system instruction...']
});

const AgentEditor: React.FC<{ 
  agent: Agent; 
  onClose: () => void; 
  onSave: (updatedAgent: Agent) => void;
  isNew?: boolean;
}> = ({ agent, onClose, onSave, isNew }) => {
  const [formData, setFormData] = useState<Agent>({ ...agent });
  const [activeTab, setActiveTab] = useState<'info' | 'instructions' | 'specs'>('info');
  const [newCap, setNewCap] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs!, [name]: name === 'temp' ? parseFloat(value) : value }
    }));
  };

  const addCapability = () => {
    const trimmed = newCap.trim();
    if (trimmed && !formData.capabilities?.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...(prev.capabilities || []), trimmed]
      }));
      setNewCap('');
    }
  };

  const removeCapability = (capToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities?.filter(c => c !== capToRemove) || []
    }));
  };

  const handleCapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCapability();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-forge-surface border border-forge-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-forge-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-xl flex items-center justify-center border ${isNew ? 'bg-forge-emerald/10 border-forge-emerald/20' : 'bg-primary/10 border-primary/20'}`}>
              <span className={`material-symbols-outlined ${isNew ? 'text-forge-emerald' : 'text-primary'}`}>
                {isNew ? 'person_add' : 'edit_square'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">{isNew ? 'Deploy New Agent' : 'Edit Agent Archive'}</h2>
              <p className="text-xs text-forge-text-muted">
                {isNew ? 'Provisioning new neural sub-process' : `Modifying parameters for ${agent.name}`} ({agent.id})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-forge-text-muted">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-forge-border shrink-0">
          {[
            { id: 'info', label: 'General Identity', icon: 'badge' },
            { id: 'instructions', label: 'Personality (.md)', icon: 'description' },
            { id: 'specs', label: 'Technical Specs', icon: 'settings_input_component' },
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'info' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Agent Name</label>
                  <input 
                    name="name"
                    placeholder="e.g. Nova"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Role / Designation</label>
                  <input 
                    name="role"
                    placeholder="e.g. Security Auditor"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Organizational Layer</label>
                  <select 
                    name="layer"
                    value={formData.layer}
                    onChange={handleChange}
                    className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Initial Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="scaffolded">Scaffolded</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Public Bio</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Briefly describe the agent's core function..."
                    className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Capabilities Management Section */}
              <div className="pt-4 border-t border-forge-border space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest mb-1">Agent Capabilities</h3>
                    <p className="text-[10px] text-forge-text-muted opacity-60 italic">Define specific skills or specialized tools this agent handles.</p>
                  </div>
                  <span className="text-[9px] font-mono text-primary font-bold">TAG_COUNT: {formData.capabilities?.length || 0}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 p-4 bg-forge-bg/30 border border-forge-border rounded-2xl min-h-[80px]">
                  {formData.capabilities?.map(cap => (
                    <div key={cap} className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full group">
                      {cap}
                      <button 
                        onClick={() => removeCapability(cap)}
                        className="hover:text-forge-rose transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                  {(!formData.capabilities || formData.capabilities.length === 0) && (
                    <p className="text-[10px] text-forge-text-muted/40 self-center">No capabilities defined yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-text-muted pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">add_task</span>
                    </span>
                    <input 
                      type="text"
                      value={newCap}
                      onChange={(e) => setNewCap(e.target.value)}
                      onKeyDown={handleCapKeyDown}
                      placeholder="Add a capability (e.g. SEO Optimization)..."
                      className="w-full bg-forge-bg border border-forge-border rounded-pill py-2.5 pl-10 pr-4 text-xs text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <button 
                    onClick={addCapability}
                    disabled={!newCap.trim()}
                    className="px-6 py-2 bg-forge-surface border border-forge-border text-forge-text-muted hover:text-white hover:border-primary/40 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'instructions' && (
            <div className="h-full flex flex-col gap-4">
               <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">System Instruction File (.md)</label>
                 <span className="text-[9px] font-mono text-forge-emerald bg-forge-emerald/10 px-2 py-0.5 rounded">Markdown Enabled</span>
               </div>
               <textarea 
                name="personalityMarkdown"
                value={formData.personalityMarkdown}
                onChange={handleChange}
                rows={12}
                placeholder="# Agent Personality..."
                className="w-full flex-1 bg-[#121212] border border-forge-border rounded-xl px-6 py-6 text-forge-emerald font-mono text-xs focus:ring-1 focus:ring-forge-emerald outline-none transition-all resize-none"
              />
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Model Configuration</h4>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-forge-text-muted uppercase">Model Label</label>
                      <input 
                        name="modelLabel"
                        value={formData.modelLabel}
                        onChange={handleChange}
                        className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-2 text-white text-sm outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-forge-text-muted uppercase">Version</label>
                      <input 
                        name="version"
                        value={formData.specs?.version}
                        onChange={handleSpecChange}
                        className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-2 text-white text-sm outline-none"
                      />
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Inference Parameters</h4>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold text-forge-text-muted uppercase">Temperature</label>
                        <span className="text-[10px] font-mono text-primary font-bold">{formData.specs?.temp}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        name="temp"
                        value={formData.specs?.temp}
                        onChange={handleSpecChange}
                        className="w-full accent-primary bg-forge-border rounded-lg h-1.5 cursor-pointer"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-forge-text-muted uppercase">Context Window</label>
                      <input 
                        name="context"
                        value={formData.specs?.context}
                        onChange={handleSpecChange}
                        className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-2 text-white text-sm outline-none"
                      />
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-forge-border bg-forge-bg/50 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-pill text-[10px] font-black uppercase tracking-widest text-forge-text-muted hover:text-white transition-all"
          >
            Discard
          </button>
          <button 
            onClick={() => onSave(formData)}
            className={`px-8 py-2.5 ${isNew ? 'bg-forge-emerald' : 'bg-primary'} text-black rounded-pill text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:opacity-90 transition-all`}
          >
            {isNew ? 'Initialize Agent' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AgentWorkspaceView: React.FC = () => {
  const { scope, agents, setAgents, tasks, setTasks } = useScope();
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // File management state
  const [agentFiles, setAgentFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [isSavingFile, setIsSavingFile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // Live updates hook - updates every 3 seconds
  const { isLive, isUpdating, lastUpdate, toggleLive } = useLiveUpdates(
    agents,
    tasks,
    setAgents,
    setTasks,
    3000
  );

  // Ensure selection remains valid if agents change or scope changes
  useEffect(() => {
    if (!agents.find(a => a.id === selectedAgent?.id)) {
      setSelectedAgent(agents[0]);
    }
  }, [agents]);

  // Legacy syncing effect (for display purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 800);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch files when selected agent changes
  useEffect(() => {
    if (selectedAgent) {
      // Convert agent name to lowercase for API call (folder names are lowercase)
      const agentFolderName = selectedAgent.name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
      fetchFilesForAgent(agentFolderName);
    }
  }, [selectedAgent?.id]);

  // Fetch file content when selected file changes
  useEffect(() => {
    if (selectedAgent && selectedFile) {
      const agentFolderName = selectedAgent.name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
      fetchFileContent(agentFolderName, selectedFile);
      setIsFileModalOpen(true); // Open modal when file is selected
    }
  }, [selectedFile]);

  const fetchFilesForAgent = async (agentName: string) => {
    setFilesLoading(true);
    try {
      const res = await fetch(`/api/agents/${agentName}/files`);
      const data = await res.json();
      setAgentFiles(data || []);
      setSelectedFile(null);
      setFileContent('');
    } catch (e) {
      console.error('Failed to fetch files:', e);
      setAgentFiles([]);
    }
    setFilesLoading(false);
  };

  const fetchFileContent = async (agentName: string, filename: string) => {
    try {
      const res = await fetch(`/api/agents/${agentName}/files/${filename}`);
      const text = await res.text();
      setFileContent(text);
      setIsEditingFile(false);
    } catch (e) {
      console.error('Failed to fetch file:', e);
    }
  };

  const saveFile = async () => {
    if (!selectedAgent || !selectedFile) return;
    
    setIsSavingFile(true);
    setSaveMessage(null);
    
    try {
      const agentFolderName = selectedAgent.name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
      const res = await fetch(`/api/agents/${agentFolderName}/files/${selectedFile}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: fileContent
      });
      
      if (res.ok) {
        setSaveMessage('Saved successfully!');
        setTimeout(() => setSaveMessage(null), 2000);
        setIsEditingFile(false);
      } else {
        setSaveMessage('Failed to save');
      }
    } catch (e) {
      console.error('Failed to save file:', e);
      setSaveMessage('Failed to save');
    }
    
    setIsSavingFile(false);
  };

  const agentTasks = useMemo(() => {
    return tasks.filter(t => t.assignedTo === selectedAgent?.id);
  }, [tasks, selectedAgent]);

  const handleSaveAgent = (updatedAgent: Agent) => {
    if (isCreating) {
      setAgents(prev => [...prev, updatedAgent]);
      setSelectedAgent(updatedAgent);
    } else {
      setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
      setSelectedAgent(updatedAgent);
    }
    setEditingAgent(null);
    setIsCreating(false);
  };

  const handleAddNew = () => {
    const newId = `AGENT-NEW-${Math.floor(Math.random() * 9000) + 1000}`;
    setEditingAgent(BLANK_AGENT(newId));
    setIsCreating(true);
  };

  const getMetrics = (agentId: string) => ({
    completionRate: '98%',
    avgTokens: '2.5k',
    reliability: '99%',
    uptime: '14 days',
    costToday: '$0.42'
  });

  const metrics = getMetrics(selectedAgent?.id);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-forge-emerald shadow-glow-emerald';
      case 'waiting': return 'bg-forge-amber shadow-glow-amber';
      case 'offline': return 'bg-forge-rose';
      default: return 'bg-forge-text-muted';
    }
  };

  if (!selectedAgent && agents.length > 0) return null; // Wait for effect
  if (agents.length === 0) return <div className="p-20 text-center text-forge-text-muted">No agents in this scope.</div>;

  return (
    <div className="flex-1 flex overflow-hidden bg-forge-bg">
      {/* Sidebar Roster - hidden on mobile */}
      <aside className="hidden md:flex w-64 flex-col border-r border-forge-border shrink-0 z-10 bg-forge-surface/30 backdrop-blur-md">
        <div className="p-5 border-b border-forge-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forge-text-muted">{scope} Roster</h3>
            <div className="flex items-center gap-2">
              {/* Live Toggle */}
              <button 
                onClick={toggleLive}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase transition-all ${
                  isLive 
                    ? 'bg-forge-emerald/10 text-forge-emerald border border-forge-emerald/30' 
                    : 'bg-forge-surface text-forge-text-muted border border-forge-border'
                }`}
              >
                {isUpdating && (
                  <span className="absolute inset-0 bg-forge-emerald/20 rounded-full animate-ping"></span>
                )}
                <span className={`size-1.5 rounded-full ${isLive ? 'bg-forge-emerald animate-pulse' : 'bg-forge-text-muted'}`}></span>
                {isLive ? 'LIVE' : 'OFF'}
              </button>
              <div className={`flex items-center gap-1.5 transition-opacity duration-500 ${isUpdating ? 'opacity-100' : 'opacity-40'}`}>
                <span className={`size-1.5 rounded-full bg-primary ${isUpdating ? 'animate-ping' : ''}`}></span>
                <span className="text-[9px] font-mono text-primary font-bold">SYNC</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {agents.map((agent) => (
            <button 
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all border-l-[3px] ${
                selectedAgent.id === agent.id 
                ? 'bg-primary/10 border-primary' 
                : 'border-transparent hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={agent.avatar} className="size-10 rounded-full ring-2 ring-forge-border object-cover" alt={agent.name} />
                <div className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-forge-surface transition-colors duration-500 ${getStatusColor(agent.status)}`}></div>
              </div>
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className={`text-sm font-bold truncate w-full ${selectedAgent.id === agent.id ? 'text-white' : 'text-forge-text-muted'}`}>{agent.name || 'New Agent'}</span>
                <span className="text-[10px] text-primary truncate w-full font-bold uppercase tracking-tighter opacity-80">{agent.role || 'Assigning...'}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Add Agent Button */}
        <div className="p-4 border-t border-forge-border bg-forge-surface/50">
          <button 
            onClick={handleAddNew}
            className="w-full py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-pill text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 group shadow-glow-gold/10"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">add</span>
            Add New Agent
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-grid-subtle">
        {/* Mobile Agent Selector */}
        <div className="md:hidden p-4 border-b border-forge-border bg-forge-surface/50">
          <select 
            value={selectedAgent?.id || ''}
            onChange={(e) => {
              const agent = agents.find(a => a.id === e.target.value);
              if (agent) setSelectedAgent(agent);
            }}
            className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name} - {agent.role}</option>
            ))}
          </select>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        
        <header className="px-4 md:px-10 pt-6 md:pt-10 pb-6 shrink-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative shrink-0">
                <img src={selectedAgent.avatar} className="size-12 md:size-16 rounded-2xl ring-2 md:ring-4 ring-forge-border shadow-2xl object-cover" alt={selectedAgent.name} />
                <div className={`absolute -bottom-1 -right-1 size-4 md:size-5 rounded-full border-2 md:border-4 border-forge-bg shadow-lg ${getStatusColor(selectedAgent.status)}`}></div>
              </div>
              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                  <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">{selectedAgent.name || 'Agent Initializing'}</h1>
                  <span className="bg-forge-surface border border-forge-border text-forge-text-muted text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest hidden md:inline">{selectedAgent.id}</span>
                  <button 
                    onClick={() => setEditingAgent(selectedAgent)}
                    className="size-8 md:size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 text-forge-text-muted hover:text-primary transition-all group touch-manipulation"
                    aria-label="Edit agent"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110">edit</span>
                  </button>
                </div>
                <p className="text-primary text-xs font-black uppercase tracking-[0.25em]">{selectedAgent.role || 'Awaiting Definition'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-forge-surface border border-forge-border rounded-pill text-[10px] font-black uppercase tracking-widest text-forge-text-muted hover:text-white transition-all">Re-Sync</button>
              <button className="px-4 py-2 bg-primary text-black rounded-pill text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:bg-yellow-500 transition-all">Command</button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 pb-24 z-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Metrics & Specs */}
            <div className="xl:col-span-2 space-y-8">
              
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Operational Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Success Rate', val: metrics.completionRate, icon: 'check_circle' },
                    { label: 'Avg Latency', val: selectedAgent.specs?.latency || '350ms', icon: 'timer' },
                    { label: 'Uptime', val: metrics.uptime, icon: 'bolt' },
                    { label: 'Cost (24h)', val: metrics.costToday, icon: 'payments' },
                  ].map(m => (
                    <div key={m.label} className="bg-forge-surface/40 backdrop-blur-sm border border-forge-border rounded-2xl p-4 flex flex-col gap-2 hover:bg-forge-surface transition-colors">
                      <div className="flex items-center justify-between text-forge-text-muted">
                        <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                      </div>
                      <span className="text-xl md:text-2xl font-display font-medium text-white">{m.val}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Active Workstream</h3>
                <div className="space-y-3">
                  {agentTasks.map(task => (
                    <div key={task.id} className="bg-forge-surface/60 border border-forge-border rounded-2xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-xl flex items-center justify-center bg-forge-bg text-primary border border-forge-border`}>
                          <span className="material-symbols-outlined text-[20px]">
                            {task.type === 'RESEARCH' ? 'analytics' : task.type === 'DESIGN' ? 'palette' : 'code'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{task.title}</h4>
                          <p className="text-[10px] text-forge-text-muted uppercase tracking-widest mt-0.5">{task.status.replace('-', ' ')} • {task.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-primary font-bold block mb-1">{task.progress}%</span>
                          <div className="w-24 h-1 bg-forge-bg rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-forge-text-muted opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      </div>
                    </div>
                  ))}
                  {agentTasks.length === 0 && (
                    <div className="p-8 text-center bg-forge-surface/20 border border-forge-border border-dashed rounded-3xl opacity-40">
                      <p className="text-xs text-forge-text-muted">No active tasks assigned to {selectedAgent.name}.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Internal Thought Log (Autonomous Reasoning)</h3>
                <div className="bg-[#121212] border border-forge-border rounded-3xl p-6 font-mono text-[12px] leading-relaxed space-y-4 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 animate-pulse bg-forge-emerald/10 text-forge-emerald text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Live Monitor</div>
                  {selectedAgent.reasoningLog?.map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-forge-text-muted opacity-40">[{idx+1}]</span>
                      <span className="text-forge-emerald/90">{line}</span>
                    </div>
                  )) || (
                    <div className="flex gap-4 italic text-forge-text-muted opacity-60">
                      <span>Telemetry awaiting next operational turn...</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-forge-border/30 mt-4 flex items-center justify-between">
                     <span className="text-[10px] text-forge-text-muted uppercase tracking-widest">Self-Correction Cycle: v2.4</span>
                     <button className="text-[10px] text-primary hover:underline">Download Trace</button>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column: Profile Specs */}
            <div className="space-y-8">
              <section className="bg-forge-surface/30 border border-forge-border rounded-3xl p-6 space-y-6 backdrop-blur-md shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">System Profile</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-forge-text-muted">Neural Model</span>
                    <span className="text-white font-bold">{selectedAgent.modelLabel}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-forge-text-muted">Version</span>
                    <span className="text-white font-mono">{selectedAgent.specs?.version || 'Stable'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-forge-text-muted">Temperature</span>
                    <span className="text-primary font-mono">{selectedAgent.specs?.temp || '0.7'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-forge-text-muted">Context Window</span>
                    <span className="text-white font-mono">{selectedAgent.specs?.context || '128k'}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-forge-border space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-forge-text-muted">Core Competencies</h4>
                   <div className="flex flex-wrap gap-2">
                     {selectedAgent.capabilities?.map(cap => (
                       <span key={cap} className="bg-white/5 border border-white/10 text-white text-[9px] px-2.5 py-1 rounded-full hover:bg-primary/10 hover:border-primary/20 transition-all cursor-default">{cap}</span>
                     ))}
                     {!selectedAgent.capabilities && <span className="text-[10px] text-forge-text-muted italic">No specialized tags.</span>}
                   </div>
                </div>
              </section>

              <section className="bg-forge-surface/30 border border-forge-border rounded-3xl p-6 space-y-4 backdrop-blur-md">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Agent Manifesto</h3>
                 <p className="text-xs text-forge-text-muted leading-relaxed italic">"{selectedAgent.description || 'No manifesto defined for this unit.'}"</p>
                 <div className="flex items-center gap-3 pt-4">
                    <div className="flex-1 h-px bg-forge-border"></div>
                    <span className="material-symbols-outlined text-[14px] text-forge-text-muted">verified</span>
                    <div className="flex-1 h-px bg-forge-border"></div>
                 </div>
              </section>

              {/* Agent Files Section */}
              <section className="bg-forge-surface/30 border border-forge-border rounded-3xl p-6 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Agent Files (.md)</h3>
                  <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{agentFiles.length} files</span>
                </div>
                
                {/* File List - Stays on right side */}
                {filesLoading ? (
                  <div className="py-4 text-center">
                    <span className="material-symbols-outlined text-primary animate-spin">sync</span>
                  </div>
                ) : agentFiles.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {agentFiles.map(file => (
                      <button
                        key={file}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                          selectedFile === file
                            ? 'bg-primary/10 text-white border border-primary/30'
                            : 'text-forge-text-muted hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] shrink-0">description</span>
                        <span className="text-xs font-medium truncate">{file}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-forge-text-muted italic py-4 text-center">No markdown files found</p>
                )}
              </section>
            </div>

          </div>
        </div>
      </main>

      {/* Editor Modal */}
      {editingAgent && (
        <AgentEditor 
          agent={editingAgent} 
          isNew={isCreating}
          onClose={() => {
            setEditingAgent(null);
            setIsCreating(false);
          }} 
          onSave={handleSaveAgent}
        />
      )}

      {/* File Editor Modal - Large popup in center of screen */}
      {isFileModalOpen && selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFileModalOpen(false)}></div>
          
          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] bg-forge-surface border border-forge-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-forge-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl flex items-center justify-center border bg-forge-emerald/10 border-forge-emerald/20">
                  <span className="material-symbols-outlined text-forge-emerald">description</span>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Editing File</h2>
                  <p className="text-xs text-forge-text-muted">
                    {selectedFile} • {selectedAgent.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsFileModalOpen(false)} 
                className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-forge-text-muted text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              {saveMessage && (
                <div className={`mb-4 px-4 py-2 rounded-pill text-xs ${
                  saveMessage.includes('success') 
                    ? 'bg-forge-emerald/10 text-forge-emerald' 
                    : 'bg-forge-amber/10 text-forge-amber'
                }`}>
                  {saveMessage}
                </div>
              )}

              {isEditingFile ? (
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full flex-1 bg-[#0A0A0A] border border-forge-border rounded-xl p-4 text-forge-text-main text-sm font-mono resize-none focus:outline-none focus:border-primary/50"
                  spellCheck={false}
                  autoFocus
                />
              ) : (
                <pre className="w-full flex-1 bg-[#0A0A0A] border border-forge-border rounded-xl p-4 text-forge-text-main text-sm font-mono overflow-auto whitespace-pre-wrap">
                  {fileContent}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-forge-border bg-forge-bg/50 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setIsFileModalOpen(false)}
                className="px-6 py-2.5 rounded-pill text-[10px] font-black uppercase tracking-widest text-forge-text-muted hover:text-white transition-all"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                {!isEditingFile ? (
                  <button
                    onClick={() => setIsEditingFile(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-pill text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingFile(false);
                        if (selectedAgent && selectedFile) {
                          const agentFolderName = selectedAgent.name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
                          fetchFileContent(agentFolderName, selectedFile);
                        }
                      }}
                      className="px-6 py-2.5 rounded-pill text-[10px] font-black uppercase tracking-widest text-forge-text-muted hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveFile}
                      disabled={isSavingFile}
                      className="flex items-center gap-2 px-8 py-2.5 bg-forge-emerald text-black rounded-pill text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[14px]">save</span>
                      {isSavingFile ? 'Saving...' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentWorkspaceView;
