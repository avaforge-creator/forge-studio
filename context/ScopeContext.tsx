import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Agent, Task, Project, LogEntry } from '../types';
import { 
  COMPANY_AGENTS, 
  PRIVATE_AGENTS, 
  DEFAULT_COMPANY_TASKS, 
  DEFAULT_PRIVATE_TASKS 
} from '../data/realDataSource';
import { useAuth } from './AuthContext';

type Scope = 'PRIVATE' | 'COMPANY';

// Task storage file path
const TASKS_FILE = '/home/nikan/.openclaw/workspace/Forge-AI-Studio/public/company-tasks.json';

interface ScopeContextType {
  scope: Scope;
  setScope: (scope: Scope) => void;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  isLoading: boolean;
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

// Get private data based on logged-in user
const getPrivateAgents = (email: string | null): Agent[] => {
  const isNikan = email?.toLowerCase().includes('nikan');
  const isBabak = email?.toLowerCase().includes('babak');
  
  if (isNikan) {
    return PRIVATE_AGENTS.filter(a => a.id === 'lily_nikan').map(a => ({
      ...a,
      id: a.id,
      name: a.name,
      role: a.role,
      layer: a.layer,
      avatar: a.avatar,
      status: a.status,
      model: a.model,
      modelLabel: a.modelLabel,
      description: a.description,
      capabilities: a.capabilities,
      specs: a.specs,
      reasoningLog: a.reasoningLog
    }));
  } else if (isBabak) {
    return PRIVATE_AGENTS.filter(a => a.id === 'lily_babak').map(a => ({
      ...a,
      id: a.id,
      name: a.name,
      role: a.role,
      layer: a.layer,
      avatar: a.avatar,
      status: a.status,
      model: a.model,
      modelLabel: a.modelLabel,
      description: a.description,
      capabilities: a.capabilities,
      specs: a.specs,
      reasoningLog: a.reasoningLog
    }));
  }
  // Default to Babak's data
  return PRIVATE_AGENTS.filter(a => a.id === 'lily_babak').map(a => ({
    ...a,
    id: a.id,
    name: a.name,
    role: a.role,
    layer: a.layer,
    avatar: a.avatar,
    status: a.status,
    model: a.model,
    modelLabel: a.modelLabel,
    description: a.description,
    capabilities: a.capabilities,
    specs: a.specs,
    reasoningLog: a.reasoningLog
  }));
};

// Convert RealAgent to Agent type
const convertAgent = (agent: any): Agent => ({
  id: agent.id,
  name: agent.name,
  role: agent.role,
  layer: agent.layer,
  avatar: agent.avatar,
  status: agent.status,
  model: agent.model,
  modelLabel: agent.modelLabel,
  description: agent.description,
  capabilities: agent.capabilities,
  specs: agent.specs,
  reasoningLog: agent.reasoningLog
});

// Load tasks from file
const loadTasksFromFile = async (scope: Scope): Promise<Task[]> => {
  if (scope !== 'COMPANY') {
    return DEFAULT_PRIVATE_TASKS as Task[];
  }
  
  try {
    const response = await fetch(TASKS_FILE + '?t=' + Date.now());
    if (response.ok) {
      const data = await response.json();
      return data.tasks || DEFAULT_COMPANY_TASKS;
    }
  } catch (e) {
    console.log('Could not load tasks from file, using defaults');
  }
  return DEFAULT_COMPANY_TASKS as Task[];
};

// Save tasks to file
const saveTasksToFile = async (tasks: Task[]): Promise<void> => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks, updatedAt: Date.now() })
    });
    if (!response.ok) {
      console.error('Failed to save tasks to server');
    }
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

export const ScopeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scope, setScopeState] = useState<Scope>(() => {
    const saved = localStorage.getItem('forge_scope');
    return (saved as Scope) || 'COMPANY';
  });

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current user email from auth context
  useEffect(() => {
    const savedUser = localStorage.getItem('forge_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserEmail(user.email);
      } catch (e) {}
    }
  }, []);

  // Get agents based on scope
  const getAgents = useCallback((currentScope: Scope): Agent[] => {
    if (currentScope === 'PRIVATE') {
      return getPrivateAgents(userEmail).map(convertAgent);
    }
    // COMPANY - use real company agents
    return COMPANY_AGENTS.map(convertAgent);
  }, [userEmail]);

  // Initialize with data
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load data on mount and when scope/user changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load agents
      const loadedAgents = getAgents(scope);
      setAgents(loadedAgents);
      
      // Load tasks
      const loadedTasks = await loadTasksFromFile(scope);
      setTasks(loadedTasks);
      
      // For now, set empty projects - can be extended later
      setProjects([]);
      
      setIsLoading(false);
    };
    
    loadData();
  }, [scope, userEmail, getAgents]);

  // Save tasks when they change
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      saveTasksToFile(tasks);
    }
  }, [tasks, isLoading]);

  const setScope = (newScope: Scope) => {
    setScopeState(newScope);
    localStorage.setItem('forge_scope', newScope);
  };

  return (
    <ScopeContext.Provider value={{ 
      scope, 
      setScope, 
      agents, 
      setAgents, 
      tasks, 
      setTasks, 
      projects, 
      setProjects,
      isLoading 
    }}>
      {children}
    </ScopeContext.Provider>
  );
};

export const useScope = () => {
  const context = useContext(ScopeContext);
  if (!context) throw new Error("useScope must be used within a ScopeProvider");
  return context;
};
