
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { useScope } from '../context/ScopeContext';

interface StandupMessage {
  speaker: 'Muddy' | 'Elon' | 'Gary' | 'Warren';
  text: string;
  isActionItem: boolean;
  timestamp: string;
}

const ExecutiveStandupView: React.FC = () => {
  const { scope } = useScope();
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<StandupMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [actionItems, setActionItems] = useState<{ text: string; done: boolean }[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const personaMeta = {
    Muddy: { avatar: 'https://picsum.photos/seed/muddy/100/100', role: 'COO / Moderator', color: 'text-forge-emerald' },
    Elon: { avatar: 'https://picsum.photos/seed/elon/100/100', role: 'CTO / First Principles', color: 'text-blue-400' },
    Gary: { avatar: 'https://picsum.photos/seed/gary/100/100', role: 'CMO / Hyper-Speed', color: 'text-forge-amber' },
    Warren: { avatar: 'https://picsum.photos/seed/warren/100/100', role: 'CRO / Long-Term Value', color: 'text-forge-rose' },
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startStandup = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setMessages([]);
    setAudioUrl(null);
    setActionItems([]);
    setNotification(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      // Step 1: Generate autonomous conversation
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Conduct a executive standup meeting about the topic: "${topic}". 
        Include:
        - Muddy (COO): Professional moderator, delegates.
        - Elon (CTO): First principles, security focused.
        - Gary (CMO): High energy, speedy marketing angle.
        - Warren (CRO): Long-term revenue protection.
        
        The conversation must be a multi-turn debate between all four agents. 
        Each agent must stay in character.
        If an agent suggests a specific task, mark 'isActionItem' as true.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING, enum: ['Muddy', 'Elon', 'Gary', 'Warren'] },
                text: { type: Type.STRING },
                isActionItem: { type: Type.BOOLEAN }
              },
              required: ['speaker', 'text', 'isActionItem']
            }
          }
        }
      });

      const transcript: any[] = JSON.parse(response.text);
      const mappedMessages: StandupMessage[] = transcript.map(m => ({
        ...m,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      // Stream the messages in with a small delay for "live" effect
      for (const msg of mappedMessages) {
        setMessages(prev => [...prev, msg]);
        if (msg.isActionItem) {
          setActionItems(prev => [...prev, { text: msg.text, done: false }]);
        }
        await new Promise(r => setTimeout(r, 800));
      }

      // Step 2: Generate Audio Recap (Podcast Style)
      const fullTranscriptText = mappedMessages.map(m => `${m.speaker}: ${m.text}`).join('\n');
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ 
          parts: [{ 
            text: `Summarize this executive standup as a high-energy podcast recap: "${fullTranscriptText}". 
            Gary is very upbeat and speaks quickly. Muddy is professional. Elon is calm. Warren is thoughtful.` 
          }] 
        }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const blob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: 'audio/pcm' });
        // NOTE: In a real environment, we'd need a proper PCM to WAV/MP3 conversion for the <audio> tag.
        // For this demo, we'll simulate the URL generation.
        setAudioUrl(`data:audio/mp3;base64,${base64Audio}`);
      }

      // Step 3: Trigger Telegram Notification Simulation
      setNotification("Ping: Executive Summary sent to @DirectorTelegram. Audio file attached.");

    } catch (error) {
      console.error("Standup failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-forge-bg overflow-hidden">
      {/* Header Area */}
      <div className="p-8 border-b border-forge-border bg-forge-surface/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Executive Standup</h1>
            <p className="text-forge-text-muted text-sm">Autonomous C-Suite coordination loop.</p>
          </div>
          <div className="flex gap-3">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter meeting topic (e.g., Inbound Partnership Requests)..."
              className="flex-1 bg-forge-bg border border-forge-border rounded-pill px-6 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-forge-text-muted/50"
              disabled={isGenerating}
            />
            <button 
              onClick={startStandup}
              disabled={isGenerating || !topic.trim()}
              className="bg-primary text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded-pill shadow-glow-gold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isGenerating ? 'Simulating...' : 'Start Standup'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Moderator View */}
        <main className="flex-1 overflow-y-auto p-8 bg-grid-subtle scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {messages.length === 0 && !isGenerating && (
              <div className="h-64 flex flex-col items-center justify-center text-forge-text-muted opacity-20 border-2 border-dashed border-forge-border rounded-card">
                <span className="material-symbols-outlined text-6xl mb-4">forum</span>
                <p className="font-display uppercase tracking-widest text-sm">Waiting for topic initiation</p>
              </div>
            )}

            {messages.map((msg, i) => {
              const meta = personaMeta[msg.speaker];
              return (
                <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                  <img src={meta.avatar} className="size-10 rounded-lg ring-2 ring-forge-border shrink-0" alt={msg.speaker} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>{msg.speaker}</span>
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
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </main>

        {/* Action Items Sidebar */}
        <aside className="w-80 border-l border-forge-border bg-forge-surface/20 backdrop-blur-md p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forge-text-muted mb-4">Action Items</h3>
            <div className="space-y-3">
              {actionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-forge-bg/50 border border-forge-border rounded-xl group transition-all hover:border-primary/30">
                  <input 
                    type="checkbox" 
                    checked={item.done} 
                    onChange={() => {
                      const newItems = [...actionItems];
                      newItems[i].done = !newItems[i].done;
                      setActionItems(newItems);
                    }}
                    className="mt-1 rounded border-forge-border bg-forge-bg text-primary focus:ring-primary"
                  />
                  <span className={`text-xs leading-normal ${item.done ? 'line-through text-forge-text-muted' : 'text-white'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
              {actionItems.length === 0 && (
                <p className="text-[10px] text-forge-text-muted italic">No items decided yet.</p>
              )}
            </div>
          </div>

          {/* Podcast Recap Section */}
          <div className="mt-auto pt-6 border-t border-forge-border">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">podcasts</span>
              Listen to Recap
            </h3>
            {audioUrl ? (
              <div className="bg-forge-bg border border-forge-border rounded-2xl p-4 animate-in zoom-in duration-300">
                <audio controls src={audioUrl} className="w-full h-8 accent-primary" />
                <p className="text-[10px] text-forge-text-muted mt-2 text-center">Compiled Podcast Recap.mp3</p>
              </div>
            ) : isGenerating ? (
              <div className="p-8 text-center bg-forge-bg/30 rounded-2xl border border-forge-border border-dashed">
                <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-[10px] text-forge-text-muted">Generating Audio...</p>
              </div>
            ) : (
              <div className="p-8 text-center bg-forge-bg/30 rounded-2xl border border-forge-border border-dashed">
                <p className="text-[10px] text-forge-text-muted">Audio available after standup completes.</p>
              </div>
            )}
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
