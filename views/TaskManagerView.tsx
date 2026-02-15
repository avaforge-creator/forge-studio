
import React, { useState, useEffect } from 'react';
import { useScope } from '../context/ScopeContext';
import { Task, Agent } from '../types';

const TaskCard: React.FC<{ 
  task: Task; 
  agent: Agent | undefined; 
  onOpenDetails: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}> = ({ task, agent, onOpenDetails, onDragStart }) => {
  
  const getExecutionStyles = (state: Task['executionState']) => {
    switch (state) {
      case 'running': return 'bg-forge-emerald shadow-glow-emerald animate-pulse';
      case 'blocked': return 'bg-forge-rose shadow-[0_0_8px_rgba(255,135,135,0.6)]';
      default: return 'bg-forge-text-muted';
    }
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onOpenDetails(task)}
      className={`bg-forge-surface border rounded-2xl p-4 hover:border-primary/40 hover:bg-white/5 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden ${
        task.executionState === 'blocked' ? 'border-forge-rose/30' : 'border-forge-border'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[8px] bg-white/5 text-forge-text-muted px-2 py-1 rounded font-black uppercase tracking-widest border border-white/5">
          {task.type}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-forge-text-muted uppercase font-bold tracking-tighter">{task.executionState}</span>
          <div className={`size-1.5 rounded-full ${getExecutionStyles(task.executionState)}`}></div>
        </div>
      </div>
      
      <h4 className="font-bold text-sm text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {agent && (
            <div className="flex items-center gap-2">
              <img src={agent.avatar} className="size-6 rounded-full border border-forge-border" alt={agent.name} />
              <span className="text-[10px] font-medium text-forge-text-muted">{agent.name}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-primary font-bold">{task.progress}%</span>
        </div>
      </div>

      <div className="mt-2 h-1 w-full bg-[#1A1B1E] rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${task.executionState === 'blocked' ? 'bg-forge-rose' : 'bg-primary'}`}
          style={{ width: `${task.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const TaskDetailDrawer: React.FC<{ 
  task: Task | null; 
  agent: Agent | undefined; 
  onClose: () => void; 
}> = ({ task, agent, onClose }) => {
  if (!task) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-forge-bg border-l border-forge-border shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${task ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col p-8 overflow-y-auto">
        <button onClick={onClose} className="self-end text-forge-text-muted hover:text-white mb-6 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="space-y-8">
          <header>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-widest">{task.type}</span>
              <span className="text-[10px] font-black bg-white/5 text-forge-text-muted px-2 py-0.5 rounded uppercase tracking-widest">{task.id}</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white leading-tight">{task.title}</h2>
          </header>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Assigned Agent</h3>
            <div className="flex items-center gap-4 bg-forge-surface/50 p-4 rounded-2xl border border-forge-border">
              <img src={agent?.avatar} className="size-12 rounded-xl ring-1 ring-white/10" alt={agent?.name} />
              <div>
                <p className="text-white font-bold">{agent?.name || 'Initializing...'}</p>
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{agent?.role || 'Awaiting Definition'}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Live Progress</h3>
              <span className="text-lg font-display font-bold text-primary">{task.progress}%</span>
            </div>
            <div className="h-2 w-full bg-forge-surface rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ${task.executionState === 'blocked' ? 'bg-forge-rose' : 'bg-primary'}`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Execution Steps</h3>
            <div className="space-y-3">
              {task.steps?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`size-4 rounded-full flex items-center justify-center border ${step.completed ? 'bg-forge-emerald border-forge-emerald' : 'border-forge-border'}`}>
                    {step.completed && <span className="material-symbols-outlined text-[10px] text-black font-bold">check</span>}
                  </div>
                  <span className={`text-xs ${step.completed ? 'text-white' : 'text-forge-text-muted'}`}>{step.label}</span>
                </div>
              ))}
              {!task.steps && <p className="text-xs text-forge-text-muted italic">No defined steps for this task.</p>}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-text-muted">Agent Terminal Logs</h3>
            <div className="bg-[#121212] border border-forge-border rounded-xl p-4 font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto">
              {task.latestLogs?.map((log, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-forge-text-muted opacity-50">[{idx+1}]</span>
                  <span className="text-forge-emerald/80">{log}</span>
                </div>
              )) || <p className="text-forge-text-muted opacity-50 italic">Waiting for telemetry...</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const TaskManagerView: React.FC = () => {
  const { scope, agents, tasks, setTasks } = useScope();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setSelectedTask(null);
  }, [scope]);

  const columns: { id: Task['status']; label: string }[] = [
    { id: 'todo', label: 'To-Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'complete', label: 'Complete' },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const getAgentById = (id: string) => agents.find(a => a.id === id);

  return (
    <div className="p-8 h-full flex flex-col bg-bg-grid-subtle relative overflow-hidden">
      <header className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display tracking-tight">Workforce Board</h2>
          <p className="text-forge-text-muted text-sm mt-1">Real-time task synchronization across <span className="text-primary font-bold">{scope}</span> environment.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-3 px-4 py-2 bg-forge-surface border border-forge-border rounded-pill">
            <div className="size-2 rounded-full bg-forge-emerald animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-forge-text-muted">Live Sync Enabled</span>
          </div>
        </div>
      </header>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="w-80 shrink-0 flex flex-col gap-4 bg-forge-surface/20 rounded-3xl p-4 border border-forge-border/40"
            >
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-forge-text-muted tracking-[0.2em] uppercase">{col.label}</span>
                  <span className="text-[10px] bg-forge-surface border border-forge-border text-forge-text-muted px-2 py-0.5 rounded-full font-bold">
                    {colTasks.length}
                  </span>
                </div>
                <button className="text-forge-text-muted hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    agent={getAgentById(task.assignedTo)} 
                    onOpenDetails={setSelectedTask}
                    onDragStart={handleDragStart}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-forge-border/40 rounded-2xl opacity-20">
                    <span className="material-symbols-outlined text-4xl">inbox</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Sidebar */}
      <TaskDetailDrawer 
        task={selectedTask} 
        agent={selectedTask ? getAgentById(selectedTask.assignedTo) : undefined} 
        onClose={() => setSelectedTask(null)} 
      />

      {/* Backdrop for Sidebar */}
      {selectedTask && (
        <div 
          onClick={() => setSelectedTask(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        />
      )}
    </div>
  );
};

export default TaskManagerView;
