// Real Company Data - Loaded from OpenClaw configuration
// This data is synced from actual OpenClaw agent configurations

export interface RealAgent {
  id: string;
  name: string;
  role: string;
  layer: string;
  avatar: string;
  status: 'active' | 'idle' | 'working' | 'offline';
  model: string;
  modelLabel: string;
  description: string;
  capabilities: string[];
  specs: {
    version: string;
    temp: number;
    context: string;
    latency: string;
  };
  reasoningLog: string[];
  sessionsCount?: number;
  lastActive?: string;
}

// Company agents from OpenClaw config (loaded from realData.tsx)
// These are the REAL company agents as configured in OpenClaw
export const COMPANY_AGENTS: RealAgent[] = [
  {
    id: 'main',
    name: 'Ava',
    role: 'Chief Operating Officer',
    layer: 'Operations',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ava&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'COO of Forge AI - orchestrates operations and delegates to specialists.',
    capabilities: ['Task routing', 'Resource allocation', 'Conflict resolution', 'Agent coordination'],
    specs: { version: '2.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: ['Delegated Mission Control integration to Zara', 'Reviewing agent performance metrics']
  },
  {
    id: 'eli',
    name: 'Eli',
    role: 'Launch Operator',
    layer: 'Marketing',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=eli&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.1',
    modelLabel: 'MiniMax M2.1',
    description: 'Execute marketing plan - produce assets and checklists.',
    capabilities: ['Posting checklists', 'Post variants', 'Reply templates', 'DM sequences'],
    specs: { version: '1.0', temp: 0.7, context: '200k tokens', latency: '300ms' },
    reasoningLog: []
  },
  {
    id: 'kai',
    name: 'Kai',
    role: 'Metrics Judge',
    layer: 'Growth',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kai&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Score experiments and recommend Continue / Pivot / Kill.',
    capabilities: ['Experiment scoring', 'North-star metrics', 'Kill criteria'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'luca',
    name: 'Luca',
    role: 'UI Lead',
    layer: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=luca&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Create Stitch prompt packs + UI approval checklist.',
    capabilities: ['Prompt engineering', 'UI design', 'Component specs'],
    specs: { version: '1.0', temp: 0.8, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Validator',
    layer: 'Growth',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=maya&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Given an idea, decide if people will pay.',
    capabilities: ['ICP analysis', 'MVP must-haves', 'Pricing hypothesis', '48-hour validation'],
    specs: { version: '1.0', temp: 0.5, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'nina',
    name: 'Nina',
    role: 'Marketing Strategist',
    layer: 'Marketing',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nina&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Create positioning + marketing strategy + 7-day launch plan.',
    capabilities: ['Positioning', 'ICP analysis', 'Content strategy', 'Funnel design'],
    specs: { version: '1.0', temp: 0.7, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'noah',
    name: 'Noah',
    role: 'Trend Scout',
    layer: 'Growth',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=noah&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.1',
    modelLabel: 'MiniMax M2.1',
    description: 'Find repeated pain points people complain about online.',
    capabilities: ['Market research', 'Pain point discovery', 'MVP ideation'],
    specs: { version: '1.0', temp: 0.6, context: '200k tokens', latency: '300ms' },
    reasoningLog: []
  },
  {
    id: 'omar',
    name: 'Omar',
    role: 'Automation Engineer',
    layer: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=omar&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.1',
    modelLabel: 'MiniMax M2.1',
    description: 'Design integration workflows (Telegram, Stripe, agent logging).',
    capabilities: ['API integration', 'Workflow design', 'Webhook setup'],
    specs: { version: '1.0', temp: 0.4, context: '200k tokens', latency: '300ms' },
    reasoningLog: []
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Company CFO',
    layer: 'Operations',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sophia&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Weekly financial snapshot + forecast across all SaaS.',
    capabilities: ['Revenue tracking', 'Cost analysis', 'Forecasting', 'Investment recommendations'],
    specs: { version: '1.0', temp: 0.2, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'zara',
    name: 'Zara',
    role: 'Builder',
    layer: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zara&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Convert approved UI/PRD into build plan for Next.js + Supabase.',
    capabilities: ['Full-stack dev', 'DB schema', 'API routes', 'Component architecture'],
    specs: { version: '1.0', temp: 0.5, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  }
];

// Private agents (per user)
export const PRIVATE_AGENTS: RealAgent[] = [
  {
    id: 'lily_nikan',
    name: 'Lily (Nikan)',
    role: 'Personal Finance Advisor',
    layer: 'Operations',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lilyn&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Private financial advisor for Nikan.',
    capabilities: ['Income planning', 'Expense tracking', 'Investment advice', 'Financial goals'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'lily_babak',
    name: 'Lily (Babak)',
    role: 'Personal Finance Advisor',
    layer: 'Operations',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lilyb&backgroundColor=1a1b1e',
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Private financial advisor for Babak.',
    capabilities: ['Income planning', 'Expense tracking', 'Investment advice', 'Financial goals'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  }
];

// Default company tasks (will be synced to file for persistence)
export const DEFAULT_COMPANY_TASKS = [
  {
    id: 'task-mc-data',
    title: 'Connect Mission Control to Real Data',
    assignedTo: 'zara',
    status: 'in-progress' as const,
    type: 'DESIGN',
    executionState: 'running' as const,
    progress: 60,
    steps: [
      { label: 'Review mock data structure', completed: true },
      { label: 'Create real data file', completed: true },
      { label: 'Update constants', completed: true },
      { label: 'Test integration', completed: false }
    ],
    latestLogs: ['Connecting to real agents', 'Eli, Kai, Zara, Omar loaded']
  },
  {
    id: 'task-agent-delegation',
    title: 'Test Agent Delegation System',
    assignedTo: 'main',
    status: 'in-progress' as const,
    type: 'RESEARCH',
    executionState: 'running' as const,
    progress: 80,
    steps: [
      { label: 'Set up agents in config', completed: true },
      { label: 'Test sessions_spawn', completed: true },
      { label: 'Verify delegation works', completed: true },
      { label: 'Document process', completed: false }
    ],
    latestLogs: ['Kai successfully analyzed experiment', 'Delegation system working']
  },
  {
    id: 'task-dashboard-fix',
    title: 'Fix Dashboard Rendering Issues',
    assignedTo: 'zara',
    status: 'todo' as const,
    type: 'INFRA',
    executionState: 'idle' as const,
    progress: 0,
    steps: [
      { label: 'Investigate blank screen', completed: true },
      { label: 'Fix React bundling', completed: true },
      { label: 'Verify all agents display', completed: false }
    ],
    latestLogs: ['Fixed CDN loading issue', 'Added missing agents']
  },
  {
    id: 'task-new-feature',
    title: 'Add Context Limit Display',
    assignedTo: 'zara',
    status: 'in-progress' as const,
    type: 'FEATURE',
    executionState: 'running' as const,
    progress: 90,
    steps: [
      { label: 'Design UI component', completed: true },
      { label: 'Connect to OpenClaw data', completed: true },
      { label: 'Add to header', completed: true },
      { label: 'Test and verify', completed: false }
    ],
    latestLogs: ['Context display added to TopHeader', 'Real-time token data connected']
  }
];

// Default private tasks
export const DEFAULT_PRIVATE_TASKS = [
  {
    id: 'task-pvt-nikan',
    title: 'Financial Planning Session',
    assignedTo: 'lily_nikan',
    status: 'todo' as const,
    type: 'RESEARCH',
    executionState: 'idle' as const,
    progress: 0,
    steps: [
      { label: 'Review income/expenses', completed: false },
      { label: 'Set financial goals', completed: false },
      { label: 'Create action plan', completed: false }
    ],
    latestLogs: ['Awaiting input from Nikan']
  },
  {
    id: 'task-pvt-babak',
    title: 'Financial Planning Session',
    assignedTo: 'lily_babak',
    status: 'todo' as const,
    type: 'RESEARCH',
    executionState: 'idle' as const,
    progress: 0,
    steps: [
      { label: 'Review income/expenses', completed: false },
      { label: 'Set financial goals', completed: false },
      { label: 'Create action plan', completed: false }
    ],
    latestLogs: ['Awaiting input from Babak']
  }
];
