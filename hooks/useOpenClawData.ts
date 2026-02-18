import { useState, useEffect, useCallback } from 'react';

// ============================================
// LIVE DATA FROM OPENCLAW - Reads from polled JSON file
// ============================================

// Types
export interface SessionInfo {
  sessionId: string;
  key: string;
  kind: string;
  updatedAt: number;
  age: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalTokensFresh: boolean;
  remainingTokens: number;
  percentUsed: number;
  model: string;
  contextTokens: number;
  flags: string[];
}

export interface AgentInfo {
  agentId: string;
  sessionsCount: number;
  lastUpdatedAt: number | null;
  lastActiveAgeMs: number | null;
}

export interface UsageCost {
  date: string;
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
  totalCost: number;
}

export interface ActiveTask {
  id: string;
  agentId: string;
  sessionId: string;
  task: string;
  status: string;
  updatedAt: number;
  ageMs: number;
}

export interface OpenClawDataFile {
  updatedAt: number;
  sessions: SessionInfo[];
  agents: AgentInfo[];
  activeTasks: ActiveTask[];
  totals: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    contextUsed: number;
    contextLimit: number;
    contextPercent: number;
    dailySpend: number;
  };
  usage: UsageCost[];
}

const DATA_URL = '/openclaw-data.json';

// Fetch data from the polled JSON file
export const useOpenClawData = (pollInterval: number = 3000): {
  sessions: SessionInfo[];
  agents: AgentInfo[];
  activeTasks: ActiveTask[];
  totalTokens: number;
  usage: UsageCost[];
  dailySpend: number;
  contextUsed: number;
  contextLimit: number;
  contextPercent: number;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date;
} => {
  const [data, setData] = useState<OpenClawDataFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(DATA_URL + '?t=' + Date.now());
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      // Don't set error on first load if file doesn't exist yet
      if (data !== null || err instanceof TypeError) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      }
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Initial fetch and polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [fetchData, pollInterval]);

  return {
    sessions: data?.sessions || [],
    agents: data?.agents || [],
    activeTasks: data?.activeTasks || [],
    totalTokens: data?.totals?.totalTokens || 0,
    usage: data?.usage || [],
    dailySpend: data?.totals?.dailySpend || 0,
    contextUsed: data?.totals?.contextUsed || 0,
    contextLimit: data?.totals?.contextLimit || 200000,
    contextPercent: data?.totals?.contextPercent || 0,
    isLoading,
    error,
    lastUpdate: data?.updatedAt ? new Date(data.updatedAt) : new Date()
  };
};

// ============================================
// Helper functions
// ============================================

// Format tokens for display (e.g., 105K)
export const formatTokens = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }
  return tokens.toString();
};

// Format context display (e.g., "105k/200k")
export const formatContextDisplay = (used: number, limit: number): string => {
  return `${formatTokens(used)}/${formatTokens(limit)}`;
};

// Get agent status from session activity
export const getAgentStatus = (lastActiveAgeMs: number | null): 'active' | 'idle' | 'offline' => {
  if (lastActiveAgeMs === null) return 'offline';
  if (lastActiveAgeMs < 60000) return 'active'; // Active in last minute
  if (lastActiveAgeMs < 3600000) return 'idle'; // Active in last hour
  return 'idle';
};
