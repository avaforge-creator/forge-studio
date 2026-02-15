
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SCOPED_DATA } from '../constants';
import { Agent, Task, Project } from '../types';

type Scope = 'PRIVATE' | 'COMPANY';

interface ScopeContextType {
  scope: Scope;
  setScope: (scope: Scope) => void;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

export const ScopeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scope, setScopeState] = useState<Scope>(() => {
    const saved = localStorage.getItem('forge_scope');
    return (saved as Scope) || 'COMPANY';
  });

  const [agents, setAgents] = useState<Agent[]>(SCOPED_DATA[scope].agents);
  const [tasks, setTasks] = useState<Task[]>(SCOPED_DATA[scope].tasks as Task[]);
  const [projects, setProjects] = useState<Project[]>(SCOPED_DATA[scope].projects as Project[]);

  // Update local state when scope changes
  useEffect(() => {
    setAgents(SCOPED_DATA[scope].agents);
    setTasks(SCOPED_DATA[scope].tasks as Task[]);
    setProjects(SCOPED_DATA[scope].projects as Project[]);
  }, [scope]);

  const setScope = (newScope: Scope) => {
    setScopeState(newScope);
    localStorage.setItem('forge_scope', newScope);
  };

  return (
    <ScopeContext.Provider value={{ scope, setScope, agents, setAgents, tasks, setTasks, projects, setProjects }}>
      {children}
    </ScopeContext.Provider>
  );
};

export const useScope = () => {
  const context = useContext(ScopeContext);
  if (!context) throw new Error('useScope must be used within a ScopeProvider');
  return context;
};
