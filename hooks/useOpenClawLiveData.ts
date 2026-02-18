import { useState, useEffect, useCallback } from 'react';

// ============================================
// LIVE DATA FROM OPENCLAW FILES
// NO LLM CALLS - PURE FILE READS
// ============================================

// Types for OpenClaw session data
interface OpenClawSession {
  sessionId: string;
  updatedAt: number;
  label?: string;
  channel?: string;
  groupId?: string;
  groupChannel?: string;
  totalTokens?: number;
  totalTokensFresh?: boolean;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  modelProvider?: string;
  abortedLastRun?: boolean;
}

interface OpenClawSessionsData {
  [key: string]: OpenClawSession;
}

// OpenClaw agents configuration
const OPENCLAW_AGENTS = [
  { id: 'main', name: 'Ava', role: 'Chief Operating Officer', layer: 'Operations' },
  { id: 'eli', name: 'Eli', role: 'Launch Operator', layer: 'Marketing' },
  { id: 'kai', name: 'Kai', role: 'Metrics Judge', layer: 'Growth' },
  { id: 'luca', name: 'Luca', role: 'UI Lead', layer: 'Engineering' },
  { id: 'maya', name: 'Maya', role: 'Validator', layer: 'Growth' },
  { id: 'nina', name: 'Nina', role: 'Marketing Strategist', layer: 'Marketing' },
  { id: 'noah', name: 'Noah', role: 'Trend Scout', layer: 'Growth' },
  { id: 'omar', name: 'Omar', role: 'Automation Engineer', layer: 'Engineering' },
  { id: 'sophia', name: 'Sophia', role: 'Company CFO', layer: 'Operations' },
  { id: 'zara', name: 'Zara', role: 'Builder', layer: 'Engineering' },
  { id: 'lily_babak', name: 'Lily (Babak)', role: 'Personal Finance Advisor', layer: 'Operations', user: 'babak' },
  { id: 'lily_nikan', name: 'Lily (Nikan)', role: 'Personal Finance Advisor', layer: 'Operations', user: 'nikan' },
];

// Get agent data directory
const getAgentSessionsPath = (agentId: string): string => {
  // Map agent IDs to their directories
  const agentPaths: Record<string, string> = {
    'main': '/home/nikan/.openclaw/agents/main/sessions/sessions.json',
    'eli': '/home/nikan/.openclaw/agents/eli/sessions/sessions.json',
    'kai': '/home/nikan/.openclaw/agents/kai/sessions/sessions.json',
    'luca': '/home/nikan/.openclaw/agents/luca/sessions/sessions.json',
    'maya': '/home/nikan/.openclaw/agents/maya/sessions/sessions.json',
    'nina': '/home/nikan/.openclaw/agents/nina/sessions/sessions.json',
    'noah': '/home/nikan/.openclaw/agents/noah/sessions/sessions.json',
    'omar': '/home/nikan/.openclaw/agents/omar/sessions/sessions.json',
    'sophia': '/home/nikan/.openclaw/agents/sophia/sessions/sessions.json',
    'zara': '/home/nikan/.openclaw/agents/zara/sessions/sessions.json',
    'lily_babak': '/home/nikan/.openclaw/agents/lily_babak/sessions/sessions.json',
    'lily_nikan': '/home/nikan/.openclaw/agents/lily_nikan/sessions/sessions.json',
  };
  return agentPaths[agentId] || '';
};

// Read sessions file via exec (this runs on server side)
const readAgentSessions = async (agentId: string): Promise<OpenClawSessionsData | null> => {
  const path = getAgentSessionsPath(agentId);
  if (!path) return null;
  
  try {
    // Use exec to read the JSON file
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const { exec } = require('child_process');
      exec(`cat "${path}"`, (err: Error | null, stdout: string, stderr: string) => {
        if (err) reject(err);
        else resolve({ stdout, stderr });
      });
    });
    
    return JSON.parse(result.stdout);
  } catch (error) {
    console.error(`Error reading sessions for ${agentId}:`, error);
    return null;
  }
};

// ============================================
// LIVE HOOK - Polls OpenClaw for real-time data
// ============================================
export interface LiveAgentData {
  id: string;
  name: string;
  role: string;
  layer: string;
  status: 'active' | 'idle' | 'working' | 'offline';
  isLive: boolean;
  lastActivity: Date | null;
  currentTask: string | null;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  sessionId: string | null;
  user?: string; // For private agents (babak, nikan)
}

export interface LiveDataResult {
  companyAgents: LiveAgentData[];
  privateAgents: {
    nikan: LiveAgentData[];
    babak: LiveAgentData[];
  };
  totalTokens: number;
  lastUpdate: Date;
  isLoading: boolean;
  error: string | null;
}

export const useOpenClawLiveData = (pollInterval: number = 8000): LiveDataResult => {
  const [companyAgents, setCompanyAgents] = useState<LiveAgentData[]>([]);
  const [privateAgents, setPrivateAgents] = useState<{ nikan: LiveAgentData[]; babak: LiveAgentData[] }>({
    nikan: [],
    babak: []
  });
  const [totalTokens, setTotalTokens] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveData = useCallback(async () => {
    try {
      setIsLoading(true);
      let company: LiveAgentData[] = [];
      let privateNikan: LiveAgentData[] = [];
      let privateBabak: LiveAgentData[] = [];
      let runningTotal = 0;

      // Fetch data for each agent
      for (const agent of OPENCLAW_AGENTS) {
        const sessionsData = await readAgentSessions(agent.id);
        
        if (sessionsData) {
          // Get the most recent session for this agent
          const sessions = Object.values(sessionsData) as OpenClawSession[];
          
          // Sort by updatedAt to get most recent
          sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          const latestSession = sessions[0];

          if (latestSession) {
            const tokens = latestSession.totalTokens || 0;
            const isActive = latestSession.updatedAt && 
              (Date.now() - latestSession.updatedAt < 60000); // Active in last 60 seconds

            const agentData: LiveAgentData = {
              id: agent.id,
              name: agent.name,
              role: agent.role,
              layer: agent.layer,
              status: isActive ? 'active' : 'idle',
              isLive: isActive,
              lastActivity: latestSession.updatedAt ? new Date(latestSession.updatedAt) : null,
              currentTask: latestSession.label || null,
              totalTokens: tokens,
              inputTokens: latestSession.inputTokens || 0,
              outputTokens: latestSession.outputTokens || 0,
              model: latestSession.model || 'MiniMax-M2.5',
              sessionId: latestSession.sessionId || null,
            };

            runningTotal += tokens;

            // Check if this is a private agent
            if (agent.user === 'nikan') {
              privateNikan.push(agentData);
            } else if (agent.user === 'babak') {
              privateBabak.push(agentData);
            } else {
              company.push(agentData);
            }
          }
        }
      }

      setCompanyAgents(company);
      setPrivateAgents({ nikan: privateNikan, babak: privateBabak });
      setTotalTokens(runningTotal);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching live data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchLiveData();
    
    const interval = setInterval(fetchLiveData, pollInterval);
    return () => clearInterval(interval);
  }, [fetchLiveData, pollInterval]);

  return {
    companyAgents,
    privateAgents,
    totalTokens,
    lastUpdate,
    isLoading,
    error
  };
};

// ============================================
// HELPER: Format tokens for display
// ============================================
export const formatTokens = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toString();
};

// ============================================
// HELPER: Get time since last activity
// ============================================
export const getTimeSince = (date: Date | null): string => {
  if (!date) return 'Never';
  
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
