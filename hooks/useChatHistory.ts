import { useState, useEffect, useCallback } from 'react';

// ============================================
// CHAT HISTORY - Fetches real agent communications
// ============================================

export interface ChatMessage {
  id: string;
  sessionId: string;
  agentId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolCalls?: {
    name: string;
    arguments: string;
  }[];
}

export interface ChatSession {
  sessionId: string;
  key: string;
  agentId: string;
  label?: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const SESSIONS_DIR = '/home/nikan/.openclaw/agents';

// Fetch chat history from agent sessions via API
export const useChatHistory = (pollInterval: number = 10000): {
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date;
} => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatHistory = useCallback(async () => {
    try {
      // Fetch real session data from API
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const sessionData = await response.json();
      
      // Transform API data into ChatSession format
      const chatSessions: ChatSession[] = sessionData.map((session: any) => {
        const messages: ChatMessage[] = session.messages.map((msg: any) => ({
          id: msg.id,
          sessionId: session.sessionId,
          agentId: session.agentId,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp).getTime(),
        }));
        
        return {
          sessionId: session.sessionId,
          key: `agent:${session.agentId}:session:${session.sessionId}`,
          agentId: session.agentId,
          messages,
          updatedAt: messages.length > 0 
            ? new Date(messages[messages.length - 1].timestamp).getTime()
            : Date.now(),
        };
      });

      // Also get session info from openclaw-data.json for labels
      try {
        const dataResponse = await fetch('/openclaw-data.json?t=' + Date.now());
        if (dataResponse.ok) {
          const data = await dataResponse.json();
          
          // Merge labels from openclaw-data
          for (const session of chatSessions) {
            const matchingSession = data.sessions?.find((s: any) => 
              s.sessionId === session.sessionId || s.key.includes(session.sessionId)
            );
            if (matchingSession) {
              session.key = matchingSession.key;
              const nonIdFlags = matchingSession.flags?.filter((f: string) => !f.startsWith('id:')) || [];
              session.label = nonIdFlags[0];
            }
          }
        }
      } catch (e) {
        // Ignore errors from supplementary data
      }
      
      // Sort by most recent
      chatSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      
      setSessions(chatSessions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chat history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchChatHistory();
    const interval = setInterval(fetchChatHistory, pollInterval);
    return () => clearInterval(interval);
  }, [fetchChatHistory, pollInterval]);

  return {
    sessions,
    isLoading,
    error,
    lastUpdate: new Date()
  };
};

// Get human-readable agent name
export const getAgentDisplayName = (agentId: string): string => {
  const names: Record<string, string> = {
    'main': 'Ava (Main)',
    'zara': 'Zara (Builder)',
    'eli': 'Eli',
    'kai': 'Kai',
    'luca': 'Luca',
    'maya': 'Maya',
    'nina': 'Nina',
    'noah': 'Noah',
    'omar': 'Omar',
    'sophia': 'Sophia',
    'lily_babak': 'Lily',
  };
  return names[agentId] || agentId;
};

// Format timestamp to relative time
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
};
