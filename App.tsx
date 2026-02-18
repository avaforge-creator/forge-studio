import React, { useState } from 'react';
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
import LoginView from './views/LoginView';
import { ScopeProvider } from './context/ScopeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Wait for auth state to be restored from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
          <p className="text-forge-text-muted text-sm">Restoring session...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-forge-bg text-forge-text-main overflow-hidden font-body">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - slides in on mobile */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:opacity-100
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <TopHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
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
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ScopeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ScopeProvider>
    </AuthProvider>
  );
};

export default App;
