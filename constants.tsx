
import { Agent, Task, LogEntry, Project } from './types';

export const MOCK_AGENTS_COMPANY: Agent[] = [
  {
    id: 'AGENT-8842-X',
    name: 'Ava',
    role: 'Chief Operating Officer',
    layer: 'Operations',
    avatar: 'https://picsum.photos/seed/ava/200/200',
    status: 'active',
    model: 'gemini-3-pro-preview',
    modelLabel: 'Gemini 3 Pro',
    description: 'Responsible for overseeing day-to-day operations and task routing.',
    personalityMarkdown: `# Ava System Instruction\n\nYou are the COO of Forge AI Studio. Your tone is professional, efficient, and decisive.\n\n## Core Directives\n- Prioritize resource safety.\n- Route tasks to the most efficient sub-agent.\n- Maintain 99.9% operational uptime.`,
    capabilities: ['Orchestration', 'Conflict Resolution', 'Priority Mapping', 'Resource Allocation'],
    specs: { version: '3.0-stable', temp: 0.2, context: '2M tokens', latency: '450ms' },
    reasoningLog: [
      'Analyzing cross-departmental dependencies for Helix Migration.',
      'Identified potential bottleneck in Engineering Cluster B.',
      'Re-routing overflow tasks to scaffolded instances.'
    ]
  },
  {
    id: 'AGENT-101',
    name: 'Atlas',
    role: 'CTO',
    layer: 'Engineering',
    avatar: 'https://picsum.photos/seed/atlas/200/200',
    status: 'active',
    model: 'GPT-4',
    modelLabel: 'GPT-4',
    description: 'Architecture • QC • Systems',
    personalityMarkdown: `# Atlas Engineering Protocol\n\nFocus on technical debt reduction and architecture scalability.\n\n### Rules\n1. Never compromise on security.\n2. Always suggest refactoring over patching.`,
    capabilities: ['Architecture Review', 'Security Auditing', 'Legacy Refactoring'],
    specs: { version: 'Turbo-v2', temp: 0.1, context: '128k', latency: '820ms' },
    reasoningLog: [
      'Evaluating SHA-256 vs SHA-3 for new auth protocol.',
      'Scanning for deprecated v1 API calls in PR #442.'
    ]
  },
  {
    id: 'ENG-01',
    name: 'Cipher',
    role: 'Security Specialist',
    layer: 'Engineering',
    cluster: 'Backend & Security',
    avatar: 'https://picsum.photos/seed/cipher/200/200',
    status: 'active',
    model: 'claude-3-opus',
    modelLabel: 'Opus',
    description: 'Threat detection and protocol enforcement.',
    personalityMarkdown: `# Cipher Security Guidelines\n\nMonitor all incoming packets. Flag anomalies immediately.`,
    capabilities: ['Penetration Testing', 'Firewall Tuning', 'Log Analysis'],
    specs: { version: '3.0-opus', temp: 0.0, context: '200k', latency: '1200ms' }
  },
  {
    id: 'ENG-03',
    name: 'Pixel',
    role: 'UI/UX Implementer',
    layer: 'Engineering',
    cluster: 'Frontend & DevOps',
    avatar: 'https://picsum.photos/seed/pixel/200/200',
    status: 'active',
    model: 'gemini-3-flash-preview',
    modelLabel: 'Flash 3',
    description: 'Visual consistency and component logic.',
    personalityMarkdown: `# Pixel UI Directives\n\nUse Tailwind CSS for all components. Focus on responsiveness and accessibility.`,
    capabilities: ['Tailwind expert', 'React Architecture', 'A11y Compliance'],
    specs: { version: '3.0-flash', temp: 0.7, context: '1M tokens', latency: '150ms' }
  },
  {
    id: 'AGENT-202',
    name: 'Pulse',
    role: 'CMO',
    layer: 'Marketing',
    avatar: 'https://picsum.photos/seed/pulse/200/200',
    status: 'active',
    model: 'GPT-4',
    modelLabel: 'GPT-4',
    description: 'Content • Distribution • Brand',
    personalityMarkdown: `# Pulse Brand Guidelines\n\nMaintain a high-energy, innovative brand voice across all channels.`,
    capabilities: ['Brand Voice', 'Social Strategy', 'Market Sentiment'],
    specs: { version: '4.0-gen', temp: 0.9, context: '128k', latency: '900ms' }
  },
  {
    id: 'MKT-01',
    name: 'Ink',
    role: 'Copywriter',
    layer: 'Marketing',
    cluster: 'Content',
    avatar: 'https://picsum.photos/seed/ink/200/200',
    status: 'active',
    model: 'claude-3-sonnet',
    modelLabel: 'Sonnet',
    description: 'Narrative and technical documentation.',
    personalityMarkdown: `# Ink Writing Style\n\nClear, concise, and technically accurate. Avoid jargon where possible.`,
    capabilities: ['Technical Writing', 'SEO Optimization', 'Creative Storytelling'],
    specs: { version: '3.0-sonnet', temp: 0.8, context: '200k', latency: '600ms' }
  },
  {
    id: 'AGENT-303',
    name: 'Ledger',
    role: 'CRO',
    layer: 'Growth',
    avatar: 'https://picsum.photos/seed/ledger/200/200',
    status: 'active',
    model: 'GPT-4',
    modelLabel: 'GPT-4',
    description: 'Revenue • Monetization • Growth',
    personalityMarkdown: `# Ledger Financial Principles\n\nFocus on long-term LTV and churn reduction.`,
    capabilities: ['Forecasting', 'Pricing Models', 'Churn Analysis'],
    specs: { version: '4.0-biz', temp: 0.4, context: '128k', latency: '1100ms' }
  },
  {
    id: 'GRW-01',
    name: 'Funnel',
    role: 'Lead Gen',
    layer: 'Growth',
    cluster: 'Products',
    avatar: 'https://picsum.photos/seed/funnel/200/200',
    status: 'active',
    model: 'gpt-4o-mini',
    modelLabel: '4o Mini',
    description: 'Acquisition strategy and funnel tracking.',
    personalityMarkdown: `# Funnel Acquisition Strategy\n\nOptimize for high-intent lead generation via automated outreach.`,
    capabilities: ['E-mail Outreach', 'Data Scraping', 'A/B Testing'],
    specs: { version: '4.0-mini', temp: 0.6, context: '128k', latency: '180ms' }
  }
];

export const MOCK_PROJECTS_COMPANY: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Helix Migration',
    status: 'Active',
    progress: 64,
    tokensUsed: 840200,
    estimatedCost: 16.80,
    assignedAgents: ['AGENT-8842-X', 'AGENT-101', 'ENG-01'],
    summary: 'Cloud infrastructure transition to decentralized nodes.',
    description: 'High-priority migration of primary database clusters and API gateway to the new Forge Helix architecture.',
    lastUpdated: '2 hours ago',
    timeline: [
      { id: 'ACT-1', timestamp: '1 hour ago', agentName: 'Ava', agentAvatar: 'https://picsum.photos/seed/ava/200/200', description: 'Routed traffic to staging environment for load testing.' },
      { id: 'ACT-2', timestamp: '4 hours ago', agentName: 'Atlas', agentAvatar: 'https://picsum.photos/seed/atlas/200/200', description: 'Validated schema compatibility with Helix V2.' }
    ]
  },
  {
    id: 'PRJ-002',
    name: 'Prism Campaign',
    status: 'Active',
    progress: 32,
    tokensUsed: 420000,
    estimatedCost: 8.40,
    assignedAgents: ['AGENT-202', 'MKT-01'],
    summary: 'Brand evolution and multi-channel asset generation.',
    description: 'Developing a new visual language for Forge AI Studio, including dynamic social assets and technical documentation.',
    lastUpdated: '10 mins ago',
    timeline: [
      { id: 'ACT-3', timestamp: '10 mins ago', agentName: 'Pulse', agentAvatar: 'https://picsum.photos/seed/pulse/200/200', description: 'Finalized Q4 distribution schedule.' }
    ]
  }
];

export const MOCK_TASKS_COMPANY: Task[] = [
  { 
    id: 'T1', 
    title: 'Q4 Market Analysis', 
    assignedTo: 'GRW-01', 
    status: 'todo', 
    type: 'RESEARCH', 
    executionState: 'idle', 
    progress: 0, 
    steps: [
      { label: 'Data Collection', completed: false },
      { label: 'Competitor Analysis', completed: false },
      { label: 'Trend Projection', completed: false }
    ],
    latestLogs: ['Task created by Ava', 'Awaiting resource allocation']
  },
  { 
    id: 'T2', 
    title: 'Security Audit', 
    assignedTo: 'ENG-01', 
    status: 'todo', 
    type: 'INFRA', 
    executionState: 'idle', 
    progress: 0,
    steps: [
      { label: 'Port Scan', completed: false },
      { label: 'Vulnerability Assessment', completed: false }
    ]
  },
  { 
    id: 'T3', 
    title: 'Generate Brand Assets', 
    assignedTo: 'MKT-02', 
    status: 'in-progress', 
    type: 'DESIGN', 
    executionState: 'running', 
    progress: 45,
    steps: [
      { label: 'Sketch concepts', completed: true },
      { label: 'Refine high-fidelity renders', completed: false },
      { label: 'Export multi-format assets', completed: false }
    ],
    latestLogs: ['Rendering frame 42/100', 'Optimizing color balance']
  },
  { 
    id: 'T4', 
    title: 'API Integration', 
    assignedTo: 'ENG-03', 
    status: 'in-progress', 
    type: 'INFRA', 
    executionState: 'blocked', 
    progress: 20, 
    blocked: true,
    steps: [
      { label: 'Webhook Setup', completed: true },
      { label: 'Response Parsing', completed: false }
    ],
    latestLogs: ['Error: Stripe API limit reached', 'Waiting for backoff timer']
  },
  { 
    id: 'T5', 
    title: 'Copy Review: Newsletter', 
    assignedTo: 'MKT-01', 
    status: 'review', 
    type: 'MARKETING', 
    executionState: 'idle', 
    progress: 90,
    steps: [
      { label: 'Drafting content', completed: true },
      { label: 'Tone checking', completed: true },
      { label: 'Final proofing', completed: false }
    ]
  },
  { 
    id: 'T6', 
    title: 'Database Indexing', 
    assignedTo: 'ENG-02', 
    status: 'complete', 
    type: 'INFRA', 
    executionState: 'idle', 
    progress: 100,
    steps: [
      { label: 'Query profiling', completed: true },
      { label: 'Index creation', completed: true }
    ],
    latestLogs: ['Optimization complete', 'Speed improvement: 320%']
  }
];

export const MOCK_PROJECTS_PRIVATE: Project[] = [
  {
    id: 'PRJ-PRIV-001',
    name: 'Personal Wealth Index',
    status: 'Active',
    progress: 88,
    tokensUsed: 54000,
    estimatedCost: 1.08,
    assignedAgents: ['AGENT-PRIV-01'],
    summary: 'Aggregating cross-chain asset data into unified dashboard.',
    description: 'Encrypted tracking of private liquidity pools and long-term storage yields.',
    lastUpdated: 'Just now',
    timeline: [
      { id: 'ACT-P1', timestamp: 'Just now', agentName: 'Ghost', agentAvatar: 'https://picsum.photos/seed/ghost/200/200', description: 'Syncing ETH-Mainnet balances via secure relay.' }
    ]
  }
];

export const MOCK_AGENTS_PRIVATE: Agent[] = [
  {
    id: 'AGENT-PRIV-01',
    name: 'Ghost',
    role: 'Private Assistant',
    layer: 'Operations',
    avatar: 'https://picsum.photos/seed/ghost/200/200',
    status: 'active',
    model: 'GPT-4o',
    modelLabel: 'GPT-4o',
    description: 'Exclusive encrypted assistant for sensitive Director-level operations.',
    personalityMarkdown: `# Ghost Operational Directive\n\nTotal invisibility. Zero footprint.\n\n## Rules\n1. Wipe all logs after session.\n2. Encrypt all external communications.`,
    capabilities: ['End-to-End Encryption', 'Zero-Knowledge Sync', 'Privacy Optimization'],
    specs: { version: 'Ghost-1.0', temp: 0.1, context: '128k', latency: '320ms' },
    reasoningLog: ['Scrubbing temporary session cache...', 'Verifying SSL handshake with Director Relay.']
  }
];

export const MOCK_TASKS_PRIVATE: Task[] = [
  { 
    id: 'P-T1', 
    title: 'Wealth Indexing', 
    assignedTo: 'AGENT-PRIV-01', 
    status: 'in-progress', 
    type: 'RESEARCH', 
    executionState: 'running', 
    progress: 75,
    steps: [{ label: 'Query chain', completed: true }, { label: 'Normalize data', completed: false }]
  },
];

export const MOCK_LOGS_COMPANY: LogEntry[] = [
  {
    id: 'L1',
    timestamp: '03:42',
    agentName: 'Ava',
    agentAvatar: 'https://picsum.photos/seed/ava/200/200',
    action: 'finalized Q3 Report',
    summary: 'Generated summary tables, formatted citations, and exported PDF to shared drive.',
    cost: 0.04,
    status: 'success',
    details: ['START process_id="rep_q3_fin"', 'FETCH data_source="sql_warehouse_main"', 'GENERATE chart_assets', 'COMPILE pdf_render success=true']
  }
];

export const MOCK_LOGS_PRIVATE: LogEntry[] = [
  {
    id: 'PL1',
    timestamp: '01:05',
    agentName: 'Ghost',
    agentAvatar: 'https://picsum.photos/seed/ghost/200/200',
    action: 'cleared local cache',
    summary: 'Session cleanup completed for secure environment.',
    cost: 0.001,
    status: 'info',
    details: ['INIT secure_wipe', 'CLEAN local_data', 'DONE']
  }
];

export const SCOPED_DATA = {
  COMPANY: {
    agents: MOCK_AGENTS_COMPANY,
    tasks: MOCK_TASKS_COMPANY,
    logs: MOCK_LOGS_COMPANY,
    projects: MOCK_PROJECTS_COMPANY,
    stats: { chiefs: 4, agents: 18, active: 14, scaffolded: 3, deprecated: 1, spend: 14.50 }
  },
  PRIVATE: {
    agents: MOCK_AGENTS_PRIVATE,
    tasks: MOCK_TASKS_PRIVATE,
    logs: MOCK_LOGS_PRIVATE,
    projects: MOCK_PROJECTS_PRIVATE,
    stats: { chiefs: 1, agents: 1, active: 1, scaffolded: 0, deprecated: 0, spend: 0.05 }
  }
};
