#!/usr/bin/env node
// OpenClaw Data Poller - saves real-time data to JSON for Mission Control
// Run this with: node poll-openclaw.cjs

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = '/home/nikan/.openclaw/workspace/Forge-AI-Studio/public/openclaw-data.json';
const DIST_FILE = '/home/nikan/.openclaw/workspace/Forge-AI-Studio/dist/openclaw-data.json';

// Known agent IDs
const AGENT_IDS = ['main', 'eli', 'kai', 'luca', 'maya', 'nina', 'noah', 'omar', 'sophia', 'zara', 'jenny', 'lily_babak'];

function poll() {
  try {
    // Get status
    const statusOutput = execSync('openclaw status --json 2>/dev/null', { 
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 
    });
    
    // Parse status to get clean data
    let statusData;
    try {
      const jsonMatch = statusOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        statusData = JSON.parse(jsonMatch[0]);
      } else {
        statusData = { sessions: { recent: [] }, agents: { agents: [] } };
      }
    } catch (e) {
      console.log('Failed to parse status:', e.message);
      statusData = { sessions: { recent: [] }, agents: { agents: [] } };
    }

    // Get sessions list for more details
    let sessionsData = { sessions: [] };
    try {
      const sessionsOutput = execSync('openclaw sessions list --json 2>/dev/null', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 
      });
      const jsonMatch = sessionsOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        sessionsData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Continue without sessions list
    }

    // Get usage cost
    let usageData = { daily: [], totals: {} };
    try {
      const usageOutput = execSync('openclaw gateway usage-cost --json 2>/dev/null', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 
      });
      const jsonMatch = usageOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        usageData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Usage cost might fail, continue without it
    }

    // Process sessions data
    const sessions = statusData.sessions?.recent || [];
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

    // Extract active tasks from sessions - group by agent
    const activeTasks = [];
    const allSessions = sessionsData.sessions || [];
    const agentLastActivity = {};
    
    for (const session of allSessions) {
      const key = session.key || '';
      const ageMs = session.ageMs || 0;
      
      // Skip very old sessions (> 30 mins)
      if (ageMs > 30 * 60 * 1000) continue;
      
      // Determine which agent this session belongs to
      let agentId = null;
      
      if (key.includes(':subagent:')) {
        const match = key.match(/agent:(\w+):subagent:/);
        if (match) agentId = match[1];
      } else if (key.includes('agent:') && key.includes(':')) {
        const parts = key.split(':');
        if (parts.length >= 2) agentId = parts[1];
      }
      
      if (agentId && AGENT_IDS.includes(agentId)) {
        // Get task description from session kind or key
        let taskDesc = 'Active session';
        if (key.includes('telegram:group')) taskDesc = 'Responding in group chat';
        else if (key.includes('telegram')) taskDesc = 'Direct message conversation';
        else if (key.includes('cron')) taskDesc = 'Running scheduled task';
        else if (key.includes('subagent')) taskDesc = 'Working on delegated task';
        
        // Only add if this agent doesn't have a task yet or this one is newer
        if (!agentLastActivity[agentId] || ageMs < agentLastActivity[agentId].ageMs) {
          agentLastActivity[agentId] = {
            id: `live-${agentId}-${Date.now()}`,
            agentId: agentId,
            sessionId: session.sessionId,
            task: taskDesc,
            status: ageMs < 60000 ? 'running' : 'idle',
            updatedAt: session.updatedAt || Date.now(),
            ageMs: ageMs,
            tokens: session.totalTokens || 0
          };
        }
      }
    }
    
    // Convert to array
    for (const agentId in agentLastActivity) {
      activeTasks.push(agentLastActivity[agentId]);
    }

    // Get today's spend
    const today = new Date().toISOString().split('T')[0];
    let dailySpend = 0;
    const usage = usageData.daily || [];
    for (const day of usage) {
      if (day.date === today) {
        dailySpend = day.totalCost || 0;
        break;
      }
    }

    // Build the data object
    const data = {
      updatedAt: Date.now(),
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        key: s.key,
        kind: s.kind,
        updatedAt: s.updatedAt,
        age: s.age,
        inputTokens: s.inputTokens || 0,
        outputTokens: s.outputTokens || 0,
        totalTokens: s.totalTokens || 0,
        remainingTokens: s.remainingTokens || 0,
        percentUsed: s.percentUsed || 0,
        model: s.model || 'MiniMax-M2.5',
        contextTokens: s.contextTokens || 200000,
        flags: s.flags || []
      })),
      agents: (statusData.agents?.agents || []).map(a => ({
        agentId: a.id,
        sessionsCount: a.sessionsCount || 0,
        lastUpdatedAt: a.lastUpdatedAt,
        lastActiveAgeMs: a.lastActiveAgeMs
      })),
      activeTasks: activeTasks,
      totals: {
        inputTokens: totalInput,
        outputTokens: totalOutput,
        totalTokens: totalInput + totalOutput,
        contextUsed,
        contextLimit,
        contextPercent: contextLimit > 0 ? (contextUsed / contextLimit) * 100 : 0,
        dailySpend
      },
      usage: usage.map(u => ({
        date: u.date,
        input: u.input || 0,
        output: u.output || 0,
        cacheRead: u.cacheRead || 0,
        cacheWrite: u.cacheWrite || 0,
        totalTokens: u.totalTokens || 0,
        totalCost: u.totalCost || 0
      }))
    };

    // Write to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    fs.writeFileSync(DIST_FILE, JSON.stringify(data, null, 2));
    console.log(`[${new Date().toISOString()}] Updated: ${data.totals.totalTokens} tokens, ${data.activeTasks.length} active tasks`);
    
  } catch (e) {
    console.error(`[${new Date().toISOString()}] Error polling OpenClaw:`, e.message);
  }
}

// Initial poll
poll();

// Poll every 3 seconds
setInterval(poll, 3000);
