
import React from 'react';
import { SCOPED_DATA } from '../constants';
import { useScope } from '../context/ScopeContext';

const OvernightLogView: React.FC = () => {
  const { scope } = useScope();
  const logs = SCOPED_DATA[scope].logs;

  return (
    <div className="flex-1 h-screen overflow-y-auto relative bg-bg-main">
      <div className="relative z-10 flex flex-col items-center w-full min-h-full pb-20">
        <header className="w-full max-w-[800px] px-6 pt-12 pb-8 flex flex-col gap-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-white mb-2">{scope} Log</h1>
            <p className="text-forge-text-muted text-lg font-light">Morning briefing for personal security environment.</p>
          </div>
        </header>

        <div className="w-full max-w-[800px] px-6 flex flex-col gap-8">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-10 items-start">
              <div className="md:w-[60px] text-sm font-mono text-forge-text-muted">{log.timestamp}</div>
              <div className={`flex-1 bg-forge-surface border rounded-card p-5 border-forge-border hover:border-primary/50 transition-all`}>
                <div className="flex items-center gap-4">
                  <img src={log.agentAvatar} className="size-10 rounded-full" alt={log.agentName} />
                  <div>
                    <h3 className="text-white font-bold">{log.agentName} {log.action}</h3>
                    <p className="text-xs text-forge-text-muted">{log.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OvernightLogView;
