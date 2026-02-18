import { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, Task } from '../types';

// Simulates live updates by making small random changes to data
export const useLiveUpdates = (
  agents: Agent[], 
  tasks: Task[], 
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  refreshInterval: number = 3000
) => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate live task progress updates
  const simulateTaskUpdates = useCallback(() => {
    setIsUpdating(true);
    
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        // Only update tasks that are in progress or running
        if ((task.status === 'in-progress' || task.status === 'todo') && 
            task.executionState !== 'blocked' &&
            task.progress < 100) {
          
          // Random progress increment (1-5%)
          const increment = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
          const newProgress = Math.min(100, task.progress + increment);
          
          // Occasionally update execution state
          let newState = task.executionState;
          if (newProgress === 100) {
            newState = 'completed';
          } else if (Math.random() > 0.9) {
            newState = newProgress > 50 ? 'running' : 'running';
          }
          
          // Occasionally add new log entries
          const newLogs = task.latestLogs ? [...task.latestLogs] : [];
          if (Math.random() > 0.8 && newLogs.length > 0) {
            const logTemplates = [
              'Processing request...',
              'Analyzing data patterns',
              'Executing workflow step',
              'Validating output',
              'Updating cache',
              'Syncing with external service',
              'Computing results',
              'Refining response'
            ];
            const newLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
            newLogs.push(newLog);
            // Keep only last 5 logs
            if (newLogs.length > 5) newLogs.shift();
          }
          
          return {
            ...task,
            progress: newProgress,
            executionState: newState,
            latestLogs: newLogs
          };
        }
        return task;
      });
    });

    // Occasionally update agent activity/logs
    setAgents(prevAgents => {
      return prevAgents.map(agent => {
        if (agent.status === 'active' && Math.random() > 0.7) {
          const newLogEntries = agent.reasoningLog ? [...agent.reasoningLog] : [];
          const logTemplates = [
            'Monitoring task execution',
            'Evaluating performance metrics',
            'Processing incoming request',
            'Coordinating with other agents',
            'Analyzing workflow efficiency',
            'Optimizing resource allocation',
            'Updating internal state',
            'Awaiting next instruction'
          ];
          
          // Add new log entry occasionally
          if (Math.random() > 0.5 && newLogEntries.length > 0) {
            const newLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
            newLogEntries.push(newLog);
            // Keep only last 3 logs
            if (newLogEntries.length > 3) newLogEntries.shift();
          }
          
          return {
            ...agent,
            reasoningLog: newLogEntries
          };
        }
        return agent;
      });
    });

    setLastUpdate(new Date());
    
    // Brief delay to show updating indicator
    setTimeout(() => setIsUpdating(false), 300);
  }, [setTasks, setAgents]);

  // Start/stop live updates
  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(simulateTaskUpdates, refreshInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, refreshInterval, simulateTaskUpdates]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  const forceUpdate = useCallback(() => {
    simulateTaskUpdates();
  }, [simulateTaskUpdates]);

  return {
    isLive,
    isUpdating,
    lastUpdate,
    toggleLive,
    forceUpdate
  };
};

// Hook for auto-refreshing view (for components that just need to trigger re-renders)
export const useAutoRefresh = (interval: number = 5000) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, interval);
    
    return () => clearInterval(id);
  }, [interval]);

  return refreshKey;
};
