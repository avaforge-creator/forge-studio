
import React, { useState } from 'react';
import { useScope } from '../context/ScopeContext';
import { useAuth } from '../context/AuthContext';

const SettingsView: React.FC = () => {
  const { scope } = useScope();
  const { user, changePassword } = useAuth();
  const [directorName, setDirectorName] = useState('Director');
  const [budgetLimit, setBudgetLimit] = useState(1000);
  const [gridVisible, setGridVisible] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess(false);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters.');
      return;
    }
    
    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      setPasswordError(result.error || 'Failed to change password.');
    }
  };

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
                className={`w-14 h-8 md:w-12 md:h-6 rounded-full transition-colors relative touch-manipulation ${notifications ? 'bg-forge-emerald' : 'bg-forge-border'}`}
                aria-label="Toggle Gemini 3 Pro Usage"
              >
                <div className={`absolute top-1 md:top-1 size-5 md:size-4 bg-white rounded-full transition-all ${notifications ? 'left-8 md:left-7' : 'left-1'}`}></div>
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
                className={`w-14 h-8 md:w-12 md:h-6 rounded-full transition-colors relative touch-manipulation ${gridVisible ? 'bg-primary' : 'bg-forge-border'}`}
                aria-label="Toggle Neural Grid Visibility"
              >
                <div className={`absolute top-1 md:top-1 size-5 md:size-4 bg-white rounded-full transition-all ${gridVisible ? 'left-8 md:left-7' : 'left-1'}`}></div>
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

        {/* Password Change */}
        <section className="bg-forge-surface/40 backdrop-blur-md border border-forge-border rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-forge-amber">lock</span>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Change Password</h2>
          </div>

          {user && (
            <p className="text-sm text-forge-text-muted mb-4">
              Logged in as: <span className="text-primary font-bold">{user.email}</span>
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-forge-text-muted uppercase tracking-widest">Confirm New Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="p-3 bg-forge-emerald/10 border border-forge-emerald/20 rounded-lg text-forge-emerald text-sm">
                ✓ Password changed successfully!
              </div>
            )}

            <button 
              onClick={handlePasswordChange}
              className="px-6 py-2 bg-forge-amber/20 border border-forge-amber/40 text-forge-amber hover:bg-forge-amber/30 rounded-xl text-sm font-bold transition-all"
            >
              Update Password
            </button>
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
