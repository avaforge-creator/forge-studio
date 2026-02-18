import React, { useState, useEffect, useRef } from 'react';
import { useScope } from '../context/ScopeContext';
import { useOpenClawData, formatTokens } from '../hooks/useOpenClawData';
import { useChatHistory, getAgentDisplayName, formatRelativeTime } from '../hooks/useChatHistory';

interface StandupMessage {
  speaker: string;
  text: string;
  isActionItem: boolean;
  timestamp: string;
  avatar: string;
  color: string;
}

const ExecutiveStandupView: React.FC = () => {
  const { scope, tasks } = useScope();
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<StandupMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [actionItems, setActionItems] = useState<{ text: string; done: boolean }[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get real OpenClaw data
  const { 
    totalTokens, 
    dailySpend, 
    contextUsed, 
    contextLimit,
    agents: openclawAgents,
    sessions,
    usage
  } = useOpenClawData(5000);

  // Get chat history
  const { sessions: chatSessions, isLoading: chatLoading } = useChatHistory(5000);

  // Calculate real metrics
  const activeAgents = openclawAgents.filter(a => a.lastActiveAgeMs !== null && a.lastActiveAgeMs < 3600000).length;
  const totalAgents = openclawAgents.length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'complete').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  
  // Get today's usage
  const todayUsage = usage.find(u => u.date === new Date().toISOString().split('T')[0]);
  const todayTokens = todayUsage?.totalTokens || 0;

  // Pre-generated summary from real data
  const summaryReport = `📊 DAILY OPERATIONAL SUMMARY - ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

🎯 ACTIVE SESSIONS: ${sessions.length} total
• Main (Ava): ${sessions.find(s => s.key.includes('main:telegram')) ? 'Active - Telegram group' : 'Idle'}
• Zara: ${sessions.filter(s => s.key.includes('zara')).length} subagent sessions running
• Total Tokens Today: ${formatTokens(todayTokens)}

🤖 AGENT STATUS: ${activeAgents}/${totalAgents} active
${openclawAgents.slice(0, 5).map(a => `• ${a.agentId}: ${a.sessionsCount} sessions`).join('\n')}

📋 TASK BOARD:
• In Progress: ${inProgressTasks}
• Completed: ${completedTasks}  
• To-Do: ${todoTasks}

💰 COST TRACKING:
• Today's Spend: $${dailySpend.toFixed(2)}
• Context Usage: ${Math.round((contextUsed / contextLimit) * 100)}%
• Total Tokens Used: ${formatTokens(totalTokens)}`;

  // Agent persona colors
  const getAgentColor = (agentId: string): string => {
    const colors: Record<string, string> = {
      'main': 'text-forge-emerald',
      'zara': 'text-blue-400',
      'eli': 'text-forge-amber',
      'kai': 'text-purple-400',
      'maya': 'text-pink-400',
      'nina': 'text-forge-rose',
      'noah': 'text-orange-400',
      'omar': 'text-teal-400',
      'sophia': 'text-indigo-400',
      'lily_babak': 'text-cyan-400',
    };
    return colors[agentId] || 'text-white';
  };

  // Agent avatars (using generated avatars based on name)
  const getAgentAvatar = (agentId: string): string => {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${agentId}&backgroundColor=1a1a2e`;
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Transform chat sessions into standup messages
  useEffect(() => {
    if (!showChatHistory || chatSessions.length === 0) return;

    const newMessages: StandupMessage[] = chatSessions.slice(0, 10).flatMap((session) => {
      return session.messages.map((msg) => ({
        speaker: getAgentDisplayName(session.agentId),
        text: msg.content,
        isActionItem: false,
        timestamp: formatRelativeTime(msg.timestamp),
        avatar: getAgentAvatar(session.agentId),
        color: getAgentColor(session.agentId),
      }));
    });

    setMessages(newMessages);
  }, [chatSessions, showChatHistory]);

  const startStandup = async () => {
    // Toggle between summary and chat history
    setShowSummary(!showSummary);
    setShowChatHistory(!showChatHistory);
  };

  return (
    <div className="flex h-full flex-col bg-forge-bg overflow-hidden">
      {/* Header Area */}
      <div className="p-2 md:p-3 border-b border-forge-border bg-forge-surface/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-display font-bold text-white tracking-tight">Executive Standup</h1>
            <span className="text-forge-text-muted text-xs hidden sm:inline">Live agent communications & coordination</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setShowSummary(!showSummary); setShowChatHistory(!showChatHistory); }}
              className="bg-forge-surface border border-forge-border text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-forge-border transition-all"
            >
              {showSummary ? 'Show Chat History' : 'Show Summary'}
            </button>
            <button 
              onClick={startStandup}
              disabled={isGenerating}
              className="bg-primary text-black font-bold uppercase tracking-wide text-xs px-4 py-1.5 rounded-lg shadow-glow-gold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isGenerating ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat View - Takes full remaining width */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-grid-subtle scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-4 pb-24">
            {/* Summary Report - Always visible when no active standup */}
            {showSummary && (
              <div className="bg-forge-surface border border-forge-border rounded-card p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-forge-emerald/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-forge-emerald">assessment</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Operations Report</h3>
                    <p className="text-[10px] text-forge-text-muted">Real-time data from OpenClaw</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-forge-bg rounded-xl p-3 border border-forge-border">
                    <span className="text-[10px] text-forge-text-muted uppercase font-bold tracking-wider block">Active Sessions</span>
                    <span className="text-xl font-display font-bold text-white">{sessions.length}</span>
                  </div>
                  <div className="bg-forge-bg rounded-xl p-3 border border-forge-border">
                    <span className="text-[10px] text-forge-text-muted uppercase font-bold tracking-wider block">Agents Active</span>
                    <span className="text-xl font-display font-bold text-forge-emerald">{activeAgents}/{totalAgents}</span>
                  </div>
                  <div className="bg-forge-bg rounded-xl p-3 border border-forge-border">
                    <span className="text-[10px] text-forge-text-muted uppercase font-bold tracking-wider block">Tasks In Progress</span>
                    <span className="text-xl font-display font-bold text-primary">{inProgressTasks}</span>
                  </div>
                  <div className="bg-forge-bg rounded-xl p-3 border border-forge-border">
                    <span className="text-[10px] text-forge-text-muted uppercase font-bold tracking-wider block">Today Tokens</span>
                    <span className="text-xl font-display font-bold text-white">{formatTokens(todayTokens)}</span>
                  </div>
                </div>

                <pre className="text-xs text-forge-text-main whitespace-pre-wrap font-mono bg-[#121212] p-4 rounded-xl border border-forge-border overflow-x-auto">
                  {summaryReport}
                </pre>

                <button 
                  onClick={() => { setShowSummary(false); setShowChatHistory(true); }}
                  className="mt-4 text-[10px] text-forge-text-muted hover:text-white uppercase font-bold tracking-widest flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">forum</span>
                  View Chat History
                </button>
              </div>
            )}

            {/* Chat History View */}
            {showChatHistory && (
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-forge-bg/90 backdrop-blur-sm py-2 z-10">
                  <h2 className="text-sm font-bold text-forge-text-muted uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    Agent Communications Hub
                  </h2>
                  <span className="text-[10px] text-forge-text-muted">
                    {chatSessions.length} active sessions
                  </span>
                </div>

                {chatLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center text-forge-text-muted opacity-20 border-2 border-dashed border-forge-border rounded-card">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-display uppercase tracking-widest text-sm">Loading chat history...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-forge-text-muted opacity-20 border-2 border-dashed border-forge-border rounded-card">
                    <span className="material-symbols-outlined text-6xl mb-4">forum</span>
                    <p className="font-display uppercase tracking-widest text-sm">No active communications</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                      <img src={msg.avatar} className="size-10 rounded-lg ring-2 ring-forge-border shrink-0 bg-forge-bg" alt={msg.speaker} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold uppercase tracking-widest ${msg.color}`}>{msg.speaker}</span>
                          <span className="text-[10px] text-forge-text-muted font-mono">{msg.timestamp}</span>
                          {msg.isActionItem && (
                            <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 rounded-full font-bold uppercase">Decision</span>
                          )}
                        </div>
                        <div className="bg-forge-surface/80 border border-forge-border p-4 rounded-card text-forge-text-main text-sm leading-relaxed shadow-sm">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {messages.length === 0 && !isGenerating && !showSummary && !showChatHistory && (
              <div className="h-64 flex flex-col items-center justify-center text-forge-text-muted opacity-20 border-2 border-dashed border-forge-border rounded-card">
                <span className="material-symbols-outlined text-6xl mb-4">forum</span>
                <p className="font-display uppercase tracking-widest text-sm">Waiting for topic initiation</p>
              </div>
            )}
          </div>
        </main>

        {/* Active Sessions Sidebar - narrower */}
        <aside className="hidden lg:flex w-64 border-l border-forge-border bg-forge-surface/20 backdrop-blur-md p-4 flex-col gap-4 overflow-y-auto">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forge-text-muted mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">hub</span>
              Active Sessions
            </h3>
            <div className="space-y-3">
              {chatSessions.slice(0, 8).map((session, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-forge-bg/50 border border-forge-border rounded-xl">
                  <img 
                    src={getAgentAvatar(session.agentId)} 
                    className="size-8 rounded-lg bg-forge-bg" 
                    alt={session.agentId} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-bold truncate">
                      {getAgentDisplayName(session.agentId)}
                    </p>
                    <p className="text-[10px] text-forge-text-muted truncate">
                      {session.label || session.key.split(':').slice(2).join(':')}
                    </p>
                  </div>
                  <span className="text-[10px] text-forge-text-muted">
                    {formatRelativeTime(session.updatedAt)}
                  </span>
                </div>
              ))}
              {chatSessions.length === 0 && (
                <p className="text-[10px] text-forge-text-muted italic">No active sessions.</p>
              )}
            </div>
          </div>

          {/* Agent Status Section */}
          <div className="mt-auto pt-6 border-t border-forge-border">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">psychology</span>
              Agent Roster
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {openclawAgents.slice(0, 8).map((agent) => (
                <div 
                  key={agent.agentId} 
                  className={`p-2 rounded-lg border ${
                    agent.lastActiveAgeMs && agent.lastActiveAgeMs < 3600000
                      ? 'bg-forge-emerald/10 border-forge-emerald/30'
                      : 'bg-forge-bg/50 border-forge-border'
                  }`}
                >
                  <p className={`text-xs font-bold ${getAgentColor(agent.agentId)}`}>
                    {getAgentDisplayName(agent.agentId)}
                  </p>
                  <p className="text-[10px] text-forge-text-muted">
                    {agent.sessionsCount} sessions
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Notifications */}
      {notification && (
        <div className="fixed bottom-8 right-8 bg-[#25262B] border border-forge-emerald/50 rounded-xl p-4 shadow-2xl animate-in slide-in-from-right-10 duration-500 z-[100] max-w-sm">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-forge-emerald/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-forge-emerald text-sm">notifications_active</span>
            </div>
            <div>
              <p className="text-xs text-white font-bold">Telegram Sent</p>
              <p className="text-[10px] text-forge-text-muted">{notification}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveStandupView;
