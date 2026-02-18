import { Agent, Task, LogEntry, Project } from './types';
import { getRobotAvatar } from './utils/agentUtils';

// ============================================
// COMPANY AGENTS - Real Forge AI Specialists
// ============================================
export const REAL_AGENTS_COMPANY: Agent[] = [
  {
    id: 'main',
    name: 'Ava',
    role: 'Chief Operating Officer',
    layer: 'Operations',
    avatar: getRobotAvatar('main'),
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
    avatar: getRobotAvatar('eli'),
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
    avatar: getRobotAvatar('kai'),
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
    avatar: getRobotAvatar('luca'),
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
    avatar: getRobotAvatar('maya'),
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
    avatar: getRobotAvatar('nina'),
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
    avatar: getRobotAvatar('noah'),
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
    avatar: getRobotAvatar('omar'),
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
    avatar: getRobotAvatar('sophia'),
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
    avatar: getRobotAvatar('zara'),
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Convert approved UI/PRD into build plan for Next.js + Supabase.',
    capabilities: ['Full-stack dev', 'DB schema', 'API routes', 'Component architecture'],
    specs: { version: '1.0', temp: 0.5, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'jenny',
    name: 'Jenny',
    role: 'UI/UX Specialist',
    layer: 'Design',
    avatar: getRobotAvatar('jenny'),
    status: 'active',
    model: 'gemini-3-flash-preview',
    modelLabel: 'Gemini 3 Flash',
    description: 'UI/UX Specialist - creates beautiful interfaces and researches latest design trends.',
    capabilities: ['UI Design', 'UX Research', 'Design Inspiration', 'Trend Analysis'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'lily_babak',
    name: 'Lily (Babak)',
    role: 'Personal Finance Advisor',
    layer: 'Operations',
    avatar: getRobotAvatar('lily_babak'),
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Private financial advisor for Babak.',
    capabilities: ['Income planning', 'Expense tracking', 'Investment advice', 'Financial goals'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'lily_nikan',
    name: 'Lily (Nikan)',
    role: 'Personal Finance Advisor',
    layer: 'Operations',
    avatar: getRobotAvatar('lily_nikan'),
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Private financial advisor for Nikan.',
    capabilities: ['Income planning', 'Expense tracking', 'Investment advice', 'Financial goals'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  }
];

// ============================================
// COMPANY PROJECTS - Real Active Projects
// ============================================
export const REAL_PROJECTS_COMPANY: Project[] = [
  {
    id: 'prj-waitlist-page',
    name: 'WaitlistPage',
    status: 'Active',
    progress: 100,
    tokensUsed: 15000,
    estimatedCost: 0.30,
    assignedAgents: ['jenny', 'zara', 'eli', 'main'],
    summary: 'Micro-SaaS waitlist landing page generator',
    description: 'A complete waitlist landing page generator with Next.js 14 + Tailwind CSS. Features include create waitlist pages, live waitlist pages, dashboard, CSV export, and Supabase integration.',
    lastUpdated: 'Just now',
    timeline: [
      { id: 'wl-1', timestamp: 'Just now', agentName: 'Eli', agentAvatar: getRobotAvatar('eli'), description: 'Competitor research complete' },
      { id: 'wl-2', timestamp: 'Just now', agentName: 'Jenny', agentAvatar: getRobotAvatar('jenny'), description: 'UI/UX design complete' },
      { id: 'wl-3', timestamp: 'Just now', agentName: 'Zara', agentAvatar: getRobotAvatar('zara'), description: 'Backend integration built' },
      { id: 'wl-4', timestamp: 'Just now', agentName: 'Ava', agentAvatar: getRobotAvatar('main'), description: 'Project assembled and ready' }
    ]
  },
  {
    id: 'prj-subtracker',
    name: 'SubTracker Lite',
    status: 'Active',
    progress: 40,
    tokensUsed: 25000,
    estimatedCost: 0.50,
    assignedAgents: ['kai', 'eli', 'omar', 'main'],
    summary: 'Privacy-first subscription tracker with AI receipt scanning + landing page',
    description: 'Building a subscription tracker with: manual entry, AI receipt scanning, spending dashboard, high-converting landing page.',
    lastUpdated: 'Just now',
    timeline: [
      { id: 'st-1', timestamp: 'Just now', agentName: 'Omar', agentAvatar: getRobotAvatar('omar'), description: 'Landing page spec complete' },
      { id: 'st-2', timestamp: 'Just now', agentName: 'Eli', agentAvatar: getRobotAvatar('eli'), description: 'Landing page copy complete' },
      { id: 'st-3', timestamp: 'Just now', agentName: 'Kai', agentAvatar: getRobotAvatar('kai'), description: 'AI receipt scanning built' },
      { id: 'st-4', timestamp: 'Just now', agentName: 'Ava', agentAvatar: getRobotAvatar('main'), description: 'Landing page UI live' }
    ]
  },
  {
    id: 'prj-mission-control',
    name: 'Mission Control Dashboard',
    status: 'Active',
    progress: 75,
    tokensUsed: 125000,
    estimatedCost: 2.50,
    assignedAgents: ['zara', 'omar', 'main'],
    summary: 'Real-time agent monitoring and task management dashboard.',
    description: 'Building a PM dashboard to monitor all Forge AI agents, their tasks, and system health in real-time.',
    lastUpdated: 'Just now',
    timeline: [
      { id: 'act-1', timestamp: 'Just now', agentName: 'Zara', agentAvatar: getRobotAvatar('zara'), description: 'Implementing real data connections.' },
      { id: 'act-2', timestamp: '5 mins ago', agentName: 'Omar', agentAvatar: getRobotAvatar('omar'), description: 'Designing integration spec.' }
    ]
  },
  {
    id: 'prj-agent-setup',
    name: 'Agent Team Setup',
    status: 'Active',
    progress: 90,
    tokensUsed: 85000,
    estimatedCost: 1.70,
    assignedAgents: ['main'],
    summary: 'Setting up specialist agent team for Forge AI.',
    description: 'Configuring 11 specialist agents with roles, models, and workspaces.',
    lastUpdated: '1 hour ago',
    timeline: [
      { id: 'act-3', timestamp: '1 hour ago', agentName: 'Ava', agentAvatar: getRobotAvatar('ava'), description: 'Delegated agent setup tasks.' }
    ]
  }
];

// ============================================
// COMPANY TASKS - Real Active Tasks
// ============================================
export const REAL_TASKS_COMPANY: Task[] = [
  {
    id: 'task-subtracker',
    title: 'Build SubTracker Lite MVP + AI + Landing Page',
    assignedTo: 'kai',
    status: 'in-progress',
    type: 'BUILD',
    executionState: 'running',
    progress: 40,
    steps: [
      { label: 'Create landing page spec (Omar)', completed: true },
      { label: 'Write landing page copy (Eli)', completed: true },
      { label: 'Build AI receipt scanning (Kai)', completed: true },
      { label: 'Build landing page UI', completed: true },
      { label: 'Integrate AI feature', completed: true },
      { label: 'Deploy and test', completed: false }
    ],
    latestLogs: ['Landing page live at localhost:3002', 'AI receipt scanning ready', 'Waiting list CTA added']
  },
  {
    id: 'task-mc-data',
    title: 'Connect Mission Control to Real Data',
    assignedTo: 'zara',
    status: 'in-progress',
    type: 'DESIGN',
    executionState: 'running',
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
    status: 'in-progress',
    type: 'RESEARCH',
    executionState: 'running',
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
    status: 'todo',
    type: 'INFRA',
    executionState: 'idle',
    progress: 0,
    steps: [
      { label: 'Investigate blank screen', completed: true },
      { label: 'Fix React bundling', completed: true },
      { label: 'Verify all agents display', completed: false }
    ],
    latestLogs: ['Fixed CDN loading issue', 'Added missing agents']
  }
];

// ============================================
// COMPANY LOGS - Real Activity Logs
// ============================================
export const REAL_LOGS_COMPANY: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    agentName: 'Zara',
    agentAvatar: 'https://picsum.photos/seed/zara/200/200',
    action: 'Building data connections',
    summary: 'Implementing real data integration for Mission Control',
    cost: 0,
    status: 'success',
    details: ['Reading constants.tsx', 'Mapping data types', 'Replacing mock data']
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    agentName: 'Kai',
    agentAvatar: 'https://picsum.photos/seed/kai/200/200',
    action: 'Experiment analysis',
    summary: 'Scored free trial button experiment: CONTINUE',
    cost: 0,
    status: 'success',
    details: ['24% CTR', '14.3% trial-to-paid', 'Need more volume']
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    agentName: 'Ava',
    agentAvatar: 'https://picsum.photos/seed/ava/200/200',
    action: 'Agent delegation',
    summary: 'Set up 11 specialist agents with role definitions',
    cost: 0,
    status: 'success',
    details: ['Eli, Kai, Luca, Maya, Nina, Noah, Omar, Sophia, Zara, Lily x2']
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    agentName: 'Omar',
    agentAvatar: 'https://picsum.photos/seed/omar/200/200',
    action: 'Integration design',
    summary: 'Created spec for connecting dashboard to OpenClaw APIs',
    cost: 0,
    status: 'info',
    details: ['sessions_list', 'cron.list', 'config parsing']
  }
];

// ============================================
// PRIVATE AGENTS (Per User)
// ============================================
export const REAL_AGENTS_PRIVATE: Agent[] = [
  {
    id: 'lily_nikan',
    name: 'Lily (Nikan)',
    role: 'Personal Finance Advisor',
    layer: 'Operations',
    avatar: getRobotAvatar('lily_nikan'),
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Private financial advisor for Nikan.',
    capabilities: ['Income planning', 'Expense tracking', 'Investment advice'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  },
  {
    id: 'lily_babak',
    name: 'Lily (Babak)',
    role: 'Personal Finance Advisor',
    layer: 'Operations',
    avatar: getRobotAvatar('lily_babak'),
    status: 'active',
    model: 'MiniMax-M2.5',
    modelLabel: 'MiniMax M2.5',
    description: 'Private financial advisor for Babak.',
    capabilities: ['Income planning', 'Expense tracking', 'Investment advice'],
    specs: { version: '1.0', temp: 0.3, context: '200k tokens', latency: '400ms' },
    reasoningLog: []
  }
];

// ============================================
// PRIVATE TASKS
// ============================================
export const REAL_TASKS_PRIVATE: Task[] = [
  {
    id: 'task-pvt-nikan',
    title: 'Financial Planning Session',
    assignedTo: 'lily_nikan',
    status: 'todo',
    type: 'RESEARCH',
    executionState: 'idle',
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
    status: 'todo',
    type: 'RESEARCH',
    executionState: 'idle',
    progress: 0,
    steps: [
      { label: 'Review income/expenses', completed: false },
      { label: 'Set financial goals', completed: false },
      { label: 'Create action plan', completed: false }
    ],
    latestLogs: ['Awaiting input from Babak']
  }
];

// ============================================
// PRIVATE LOGS
// ============================================
export const REAL_LOGS_PRIVATE: LogEntry[] = [
  {
    id: 'log-pvt-nikan',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    agentName: 'Lily (Nikan)',
    agentAvatar: 'https://picsum.photos/seed/lilyn/200/200',
    action: 'Initial consultation',
    summary: 'First meeting - establishing financial goals',
    cost: 0,
    status: 'info',
    details: ['Discussed income', 'Discussed expenses', 'Set timeline']
  },
  {
    id: 'log-pvt-babak',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    agentName: 'Lily (Babak)',
    agentAvatar: 'https://picsum.photos/seed/lilyb/200/200',
    action: 'Initial consultation',
    summary: 'First meeting - establishing financial goals',
    cost: 0,
    status: 'info',
    details: ['Discussed income', 'Discussed expenses', 'Set timeline']
  }
];

// ============================================
// PRIVATE PROJECTS
// ============================================
export const REAL_PROJECTS_PRIVATE: Project[] = [
  {
    id: 'prj-pvt-nikan',
    name: 'Personal Finance Management',
    status: 'Active',
    progress: 10,
    tokensUsed: 2500,
    estimatedCost: 0.05,
    assignedAgents: ['lily_nikan'],
    summary: 'Private financial planning and tracking.',
    description: 'Personal finance management for Nikan - income, expenses, investments.',
    lastUpdated: '1 day ago',
    timeline: [
      { id: 'act-p1', timestamp: '1 day ago', agentName: 'Lily (Nikan)', agentAvatar: 'https://picsum.photos/seed/lilyn/200/200', description: 'Initial consultation completed.' }
    ]
  },
  {
    id: 'prj-pvt-babak',
    name: 'Personal Finance Management',
    status: 'Active',
    progress: 10,
    tokensUsed: 2500,
    estimatedCost: 0.05,
    assignedAgents: ['lily_babak'],
    summary: 'Private financial planning and tracking.',
    description: 'Personal finance management for Babak - income, expenses, investments.',
    lastUpdated: '1 day ago',
    timeline: [
      { id: 'act-p1', timestamp: '1 day ago', agentName: 'Lily (Babak)', agentAvatar: 'https://picsum.photos/seed/lilyb/200/200', description: 'Initial consultation completed.' }
    ]
  }
];
