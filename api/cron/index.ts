// Vercel API route for OpenClaw data polling
// This runs every minute via Vercel Cron

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get OpenClaw status
    const { execSync } = await import('child_process');
    
    const statusOutput = execSync('openclaw status --json 2>/dev/null', { 
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 
    });
    
    let statusData = { sessions: { recent: [] }, agents: { agents: [] } };
    try {
      const jsonMatch = statusOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) statusData = JSON.parse(jsonMatch[0]);
    } catch (e) {}

    // Get sessions
    let sessionsData = { sessions: [] };
    try {
      const sessionsOutput = execSync('openclaw sessions list --json 2>/dev/null', { encoding: 'utf8' });
      const jsonMatch = sessionsOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) sessionsData = JSON.parse(jsonMatch[0]);
    } catch (e) {}

    // Process data (simplified version)
    const sessions = statusData.sessions?.recent || [];
    const AGENT_IDS = ['main', 'eli', 'kai', 'luca', 'maya', 'nina', 'noah', 'omar', 'sophia', 'zara', 'jenny', 'lily_babak'];
    
    let totalInput = 0;
    let totalOutput = 0;
    let contextUsed = 0;
    let contextLimit = 200000;

    for (const session of sessions) {
      if (session.inputTokens) totalInput += session.inputTokens;
      if (session.outputTokens) totalOutput += session.outputTokens;
      if (session.remainingTokens && session.contextTokens && !contextUsed) {
        contextUsed = session.contextTokens - session.remainingTokens;
        contextLimit = session.contextTokens;
      }
    }

    // Extract active tasks
    const activeTasks = [];
    const allSessions = sessionsData.sessions || [];
    const agentLastActivity = {};
    
    for (const session of allSessions) {
      const key = session.key || '';
      const ageMs = session.ageMs || 0;
      if (ageMs > 30 * 60 * 1000) continue;
      
      let agentId = null;
      if (key.includes(':subagent:')) {
        const match = key.match(/agent:(\w+):subagent:/);
        if (match) agentId = match[1];
      } else if (key.includes('agent:') && key.includes(':')) {
        const parts = key.split(':');
        if (parts.length >= 2) agentId = parts[1];
      }
      
      if (agentId && AGENT_IDS.includes(agentId)) {
        let taskDesc = 'Active session';
        if (key.includes('telegram:group')) taskDesc = 'Responding in group chat';
        else if (key.includes('telegram')) taskDesc = 'Direct message';
        else if (key.includes('cron')) taskDesc = 'Running scheduled task';
        
        if (!agentLastActivity[agentId] || ageMs < agentLastActivity[agentId].ageMs) {
          agentLastActivity[agentId] = {
            id: `live-${agentId}-${Date.now()}`,
            agentId,
            sessionId: session.sessionId,
            task: taskDesc,
            status: ageMs < 60000 ? 'running' : 'idle',
            updatedAt: session.updatedAt || Date.now(),
            ageMs,
            tokens: session.totalTokens || 0
          };
        }
      }
    }
    
    for (const id in agentLastActivity) activeTasks.push(agentLastActivity[id]);

    const data = {
      updatedAt: Date.now(),
      sessions,
      agents: (statusData.agents?.agents || []).map(a => ({
        agentId: a.id,
        sessionsCount: a.sessionsCount || 0,
        lastUpdatedAt: a.lastUpdatedAt,
        lastActiveAgeMs: a.lastActiveAgeMs
      })),
      activeTasks,
      totals: {
        inputTokens: totalInput,
        outputTokens: totalOutput,
        totalTokens: totalInput + totalOutput,
        contextUsed,
        contextLimit,
        contextPercent: contextLimit > 0 ? (contextUsed / contextLimit) * 100 : 0,
        dailySpend: 0
      },
      usage: []
    };

    return Response.json({ success: true, data, updatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
