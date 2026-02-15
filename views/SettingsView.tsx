
import React, { useState } from 'react';
import { useScope } from '../context/ScopeContext';

const SettingsView: React.FC = () => {
  const { scope } = useScope();
  const [directorName, setDirectorName] = useState('Director');
  const [budgetLimit, setBudgetLimit] = useState(1000);
  const [gridVisible, setGridVisible] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className={`flex-1 overflow-y-auto p-8 md:p-12 relative ${gridVisible ? 'bg-grid-subtle' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      <header className="mb-12 relative z-10">
        <h1 className="text-display text-4xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-forge-text-muted mt-2">Adjust global parameters and operational preferences for the {scope} environment.</p>
      </header>

      <div className="max-w-4xl space-y-8 relative z-10">
        {/* Profile Section */}
        <section className="bg-forge-surface/40 backdrop-blur-md border border-forge-border rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">person</span>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Director Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Display Name</label>
              <input 
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Avatar URL</label>
              <input 
                defaultValue="https://picsum.photos/seed/director/100/100"
                className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Operational Constraints */}
        <section className="bg-forge-surface/40 backdrop-blur-md border border-forge-border rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-forge-emerald">account_balance_wallet</span>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Operational Constraints</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">Monthly Token Budget</p>
                <p className="text-xs text-forge-text-muted">Pause all non-critical agents when this limit is reached.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-display font-bold text-primary">${budgetLimit}</span>
                <input 
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                  className="accent-primary w-32"
                />
              </div>
            </div>

            <div className="h-px bg-forge-border"></div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">Gemini 3 Pro Usage</p>
                <p className="text-xs text-forge-text-muted">Allow agents to escalate tasks to High-Reasoning models.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-forge-emerald' : 'bg-forge-border'}`}
              >
                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Interface Preferences */}
        <section className="bg-forge-surface/40 backdrop-blur-md border border-forge-border rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-forge-amber">palette</span>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Interface Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">Neural Grid Visibility</p>
                <p className="text-xs text-forge-text-muted">Show the subtle background positioning grid.</p>
              </div>
              <button 
                onClick={() => setGridVisible(!gridVisible)}
                className={`w-12 h-6 rounded-full transition-colors relative ${gridVisible ? 'bg-primary' : 'bg-forge-border'}`}
              >
                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${gridVisible ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <div className="h-px bg-forge-border"></div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">Overnight Briefing Notification</p>
                <p className="text-xs text-forge-text-muted">Send summary via Telegram at 06:00 AM.</p>
              </div>
              <span className="text-[10px] font-mono text-forge-emerald bg-forge-emerald/10 px-2 py-0.5 rounded border border-forge-emerald/20">CONNECTED</span>
            </div>
          </div>
        </section>

        {/* System Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { label: 'API Status', val: 'Healthy', color: 'text-forge-emerald' },
             { label: 'Latency', val: '42ms', color: 'text-primary' },
             { label: 'Workspace Uptime', val: '14d 2h', color: 'text-white' },
           ].map(stat => (
             <div key={stat.label} className="bg-forge-surface/20 border border-forge-border p-4 rounded-2xl">
               <span className="text-[10px] text-forge-text-muted uppercase tracking-widest block mb-1">{stat.label}</span>
               <span className={`text-sm font-bold ${stat.color}`}>{stat.val}</span>
             </div>
           ))}
        </div>

        <div className="pt-8 flex justify-end gap-4">
          <button className="px-8 py-3 bg-white/5 border border-white/10 text-forge-text-muted hover:text-white rounded-pill text-[10px] font-black uppercase tracking-widest transition-all">Reset to Defaults</button>
          <button className="px-10 py-3 bg-primary text-black rounded-pill text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:opacity-90 transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
