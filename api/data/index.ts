// Simpler Vercel data endpoint - fetches from local machine
// This allows Vercel to serve the data while polling stays local

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In production, fetch from local tunnel or Vercel KV
    // For now, return a redirect or fetch from environment
    
    const LOCAL_TUNNEL_URL = process.env.LOCAL_TUNNEL_URL || 'https://forge-aistudio.com';
    
    // Try to fetch from local machine if available
    try {
      const localData = await fetch(`${LOCAL_TUNNEL_URL}/openclaw-data.json`, {
        signal: AbortSignal.timeout(5000)
      });
      if (localData.ok) {
        const data = await localData.json();
        return Response.json(data);
      }
    } catch (e) {
      // Local not reachable, return cached or empty
    }
    
    // Return placeholder - will be updated by cron
    return Response.json({
      updatedAt: Date.now(),
      error: 'Data not available - check tunnel connection',
      sessions: [],
      agents: [],
      activeTasks: [],
      totals: { inputTokens: 0, outputTokens: 0, totalTokens: 0, contextUsed: 0, contextLimit: 200000, contextPercent: 0, dailySpend: 0 }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
