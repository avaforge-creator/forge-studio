
export interface Agent {
  id: string;
  name: string;
  role: string;
  layer: 'Engineering' | 'Marketing' | 'Growth' | 'Operations';
  cluster?: string;
  avatar: string;
  status: 'active' | 'scaffolded' | 'deprecated' | 'waiting' | 'offline';
  model: string;
  modelLabel?: string;
  description: string;
  personalityMarkdown?: string;
  capabilities?: string[];
  specs?: {
    version: string;
    temp: number;
    context: string;
    latency: string;
  };
  reasoningLog?: string[];
}

export interface TaskStep {
  label: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string; // Agent ID
  status: 'todo' | 'in-progress' | 'review' | 'complete';
  type: 'RESEARCH' | 'INFRA' | 'CONTENT' | 'DESIGN' | 'MARKETING';
  executionState: 'idle' | 'running' | 'blocked';
  progress: number; // 0-100
  steps?: TaskStep[];
  latestLogs?: string[];
  tokens?: number;
  priority?: boolean;
  blocked?: boolean; // deprecated in favor of executionState but kept for compatibility
}

export interface ProjectActivity {
  id: string;
  timestamp: string;
  agentName: string;
  agentAvatar: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Done';
  progress: number;
  tokensUsed: number;
  estimatedCost: number;
  assignedAgents: string[]; // Agent IDs
  summary: string;
  lastUpdated: string;
  description: string;
  timeline: ProjectActivity[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentName: string;
  agentAvatar: string;
  action: string;
  summary: string;
  cost: number;
  status: 'success' | 'warning' | 'info';
  details: string[];
}
