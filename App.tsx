
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DashboardView from './views/DashboardView';
import TaskManagerView from './views/TaskManagerView';
import OrgChartView from './views/OrgChartView';
import OvernightLogView from './views/OvernightLogView';
import AgentWorkspaceView from './views/AgentWorkspaceView';
import ExecutiveStandupView from './views/ExecutiveStandupView';
import ProjectsView from './views/ProjectsView';
import SettingsView from './views/SettingsView';
import { ScopeProvider } from './context/ScopeContext';

const App: React.FC = () => {
  return (
    <ScopeProvider>
      <Router>
        <div className="flex h-screen bg-forge-bg text-forge-text-main overflow-hidden font-body">
          <Sidebar />
          
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <TopHeader />
            
            <main className="flex-1 overflow-y-auto scroll-smooth">
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/projects" element={<ProjectsView />} />
                <Route path="/standup" element={<ExecutiveStandupView />} />
                <Route path="/tasks" element={<TaskManagerView />} />
                <Route path="/org" element={<OrgChartView />} />
                <Route path="/workspace" element={<AgentWorkspaceView />} />
                <Route path="/logs" element={<OvernightLogView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ScopeProvider>
  );
};

export default App;
