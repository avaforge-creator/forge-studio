import path from 'path';
import { defineConfig, loadEnv, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const AGENTS_DIR = '/home/nikan/.openclaw/workspace-forge/agents';

// Simple API to serve agent markdown files
function agentFilesPlugin() {
  return {
    name: 'agent-files-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(apiHandler);
    },
    configurePreviewServer(server: ViteDevServer) {
      server.middlewares.use(apiHandler);
    }
  };
}

const TASKS_FILE = '/home/nikan/.openclaw/workspace/Forge-AI-Studio/public/company-tasks.json';
const AGENT_SESSIONS_DIR = '/home/nikan/.openclaw/agents';

const apiHandler = async (req: any, res: any, next: any) => {
  const url = req.url || '';
  
  // GET /api/tasks - get company tasks
  if (url === '/api/tasks' && req.method === 'GET') {
    try {
      if (!fs.existsSync(TASKS_FILE)) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ tasks: [] }));
        return;
      }
      const content = fs.readFileSync(TASKS_FILE, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.end(content);
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to read tasks' }));
      return;
    }
  }
  
  // PUT /api/tasks - save company tasks
  if (url === '/api/tasks' && req.method === 'PUT') {
    try {
      let body = '';
      req.on('data', (chunk: any) => body += chunk);
      req.on('end', () => {
        const data = JSON.parse(body);
        fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      });
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to save tasks' }));
      return;
    }
  }
  
  // GET /api/agents - list all agents
  if (url === '/api/agents') {
    try {
      const agents = fs.readdirSync(AGENTS_DIR).filter(name => {
        return fs.statSync(path.join(AGENTS_DIR, name)).isDirectory();
      });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(agents));
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to read agents directory' }));
      return;
    }
  }
  
  // GET /api/agents/:agent/files - list markdown files for an agent
  const filesMatch = url.match(/^\/api\/agents\/([^/]+)\/files$/);
  if (filesMatch && req.method === 'GET') {
    const agentName = filesMatch[1];
    const agentDir = path.join(AGENTS_DIR, agentName);
    try {
      if (!fs.existsSync(agentDir)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Agent not found' }));
        return;
      }
      const files = fs.readdirSync(agentDir).filter(f => f.endsWith('.md'));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(files));
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to read files' }));
      return;
    }
  }
  
  // GET /api/agents/:agent/files/:filename - get file content
  const fileMatch = url.match(/^\/api\/agents\/([^/]+)\/files\/(.+)$/);
  if (fileMatch && req.method === 'GET') {
    const agentName = fileMatch[1];
    const filename = fileMatch[2];
    const filePath = path.join(AGENTS_DIR, agentName, filename);
    try {
      if (!filePath.startsWith(AGENTS_DIR)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Access denied' }));
        return;
      }
      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      res.end(content);
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to read file' }));
      return;
    }
  }
  
  // PUT /api/agents/:agent/files/:filename - save file content
  if (fileMatch && req.method === 'PUT') {
    const agentName = fileMatch[1];
    const filename = fileMatch[2];
    const filePath = path.join(AGENTS_DIR, agentName, filename);
    try {
      if (!filePath.startsWith(AGENTS_DIR)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Access denied' }));
        return;
      }
      let body = '';
      req.on('data', (chunk: any) => body += chunk);
      req.on('end', () => {
        fs.writeFileSync(filePath, body, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      });
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to save file' }));
      return;
    }
  }
  
  // GET /api/sessions - get all agent session files
  if (url === '/api/sessions' && req.method === 'GET') {
    try {
      const allSessions: any[] = [];
      const agents = fs.readdirSync(AGENT_SESSIONS_DIR);
      
      for (const agent of agents) {
        const agentSessionsDir = path.join(AGENT_SESSIONS_DIR, agent, 'sessions');
        if (!fs.existsSync(agentSessionsDir)) continue;
        
        const files = fs.readdirSync(agentSessionsDir).filter(f => f.endsWith('.jsonl') && !f.includes('.deleted.'));
        
        for (const file of files.slice(0, 5)) { // Limit to 5 most recent per agent
          const filePath = path.join(agentSessionsDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.trim().split('\n').filter(l => l);
            
            // Get last few messages from the session
            const messages: any[] = [];
            for (const line of lines.slice(-10)) {
              try {
                const entry = JSON.parse(line);
                if (entry.type === 'message' && entry.message) {
                  messages.push({
                    id: entry.id,
                    role: entry.message.role,
                    content: Array.isArray(entry.message.content) 
                      ? entry.message.content.map((c: any) => c.text || c.content || '').join('')
                      : entry.message.content,
                    timestamp: entry.timestamp,
                  });
                }
              } catch (e) {
                // Skip malformed lines
              }
            }
            
            if (messages.length > 0) {
              allSessions.push({
                agentId: agent,
                sessionId: file.replace('.jsonl', ''),
                messages,
              });
            }
          } catch (e) {
            // Skip files we can't read
          }
        }
      }
      
      // Sort by most recent message
      allSessions.sort((a, b) => {
        const aTime = a.messages[a.messages.length - 1]?.timestamp || 0;
        const bTime = b.messages[b.messages.length - 1]?.timestamp || 0;
        return bTime - aTime;
      });
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(allSessions.slice(0, 20))); // Return top 20 sessions
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to read sessions' }));
      return;
    }
  }
  
  // GET /api/sessions/:agent/:sessionId - get specific session messages
  const sessionMatch = url.match(/^\/api\/sessions\/([^/]+)\/([^/]+)$/);
  if (sessionMatch && req.method === 'GET') {
    const agentName = sessionMatch[1];
    const sessionId = sessionMatch[2];
    const sessionPath = path.join(AGENT_SESSIONS_DIR, agentName, 'sessions', `${sessionId}.jsonl`);
    
    try {
      if (!fs.existsSync(sessionPath)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }
      
      const content = fs.readFileSync(sessionPath, 'utf-8');
      const lines = content.trim().split('\n').filter(l => l);
      
      const messages: any[] = [];
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.type === 'message' && entry.message) {
            messages.push({
              id: entry.id,
              role: entry.message.role,
              content: Array.isArray(entry.message.content) 
                ? entry.message.content.map((c: any) => c.text || c.content || '').join('')
                : entry.message.content,
              timestamp: entry.timestamp,
            });
          }
        } catch (e) {
          // Skip malformed lines
        }
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ agentId: agentName, sessionId, messages }));
      return;
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to read session' }));
      return;
    }
  }
  
  next();
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      preview: {
        allowedHosts: ['forge-aistudio.com', 'dod-championships-dimensions-davidson.trycloudflare.com', '.trycloudflare.com'],
      },
      // Vercel deployment config
      build: {
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      },
      plugins: [react(), agentFilesPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
