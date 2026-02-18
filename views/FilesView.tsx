import React, { useState, useEffect } from 'react';

interface Agent {
  name: string;
}

const FilesView: React.FC = () => {
  const [agents, setAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load agents on mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Load files when agent selected
  useEffect(() => {
    if (selectedAgent) {
      fetchFiles(selectedAgent);
    }
  }, [selectedAgent]);

  // Load file content when file selected
  useEffect(() => {
    if (selectedAgent && selectedFile) {
      fetchFileContent(selectedAgent, selectedFile);
    }
  }, [selectedAgent, selectedFile]);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data);
      setLoading(false);
    } catch (e) {
      console.error('Failed to fetch agents:', e);
      setLoading(false);
    }
  };

  const fetchFiles = async (agent: string) => {
    try {
      const res = await fetch(`/api/agents/${agent}/files`);
      const data = await res.json();
      setFiles(data);
      setSelectedFile(null);
      setContent('');
    } catch (e) {
      console.error('Failed to fetch files:', e);
    }
  };

  const fetchFileContent = async (agent: string, filename: string) => {
    try {
      const res = await fetch(`/api/agents/${agent}/files/${filename}`);
      const text = await res.text();
      setContent(text);
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to fetch file:', e);
    }
  };

  const saveFile = async () => {
    if (!selectedAgent || !selectedFile) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const res = await fetch(`/api/agents/${selectedAgent}/files/${selectedFile}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: content
      });
      
      if (res.ok) {
        setSaveMessage('Saved successfully!');
        setTimeout(() => setSaveMessage(null), 2000);
        setIsEditing(false);
      } else {
        setSaveMessage('Failed to save');
      }
    } catch (e) {
      console.error('Failed to save file:', e);
      setSaveMessage('Failed to save');
    }
    
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 md:p-12 flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-6 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#2C2E33]/20 to-transparent pointer-events-none"></div>

      <header className="relative z-10">
        <h2 className="text-display text-3xl md:text-4xl font-medium text-white tracking-tight">
          Agent Files
        </h2>
        <p className="text-forge-text-muted text-sm mt-2">
          View and edit markdown files for each agent
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        {/* Agents List - narrow sidebar */}
        <div className="xl:col-span-2 bg-forge-surface border border-forge-border rounded-3xl p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 px-2">Agents</h3>
          <div className="space-y-1">
            {agents.map(agent => (
              <button
                key={agent}
                onClick={() => {
                  setSelectedAgent(agent);
                  setSelectedFile(null);
                  setContent('');
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center gap-3 ${
                  selectedAgent === agent
                    ? 'bg-primary/10 text-white border border-primary/30'
                    : 'text-forge-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">smart_toy</span>
                <span className="text-sm font-medium truncate">{agent}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Files List */}
        <div className="xl:col-span-2 bg-forge-surface border border-forge-border rounded-3xl p-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 px-2">
            {selectedAgent ? `${selectedAgent} Files` : 'Select an Agent'}
          </h3>
          {selectedAgent ? (
            <div className="space-y-1">
              {files.map(file => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center gap-3 ${
                    selectedFile === file
                      ? 'bg-primary/10 text-white border border-primary/30'
                      : 'text-forge-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">description</span>
                  <span className="text-sm font-medium truncate">{file}</span>
                </button>
              ))}
              {files.length === 0 && (
                <p className="text-forge-text-muted text-sm px-4 py-8 text-center">
                  No markdown files found
                </p>
              )}
            </div>
          ) : (
            <p className="text-forge-text-muted text-sm px-4 py-8 text-center">
              Select an agent to view files
            </p>
          )}
        </div>

        {/* File Content - Editor now centered and much larger */}
        <div className="xl:col-span-8 bg-forge-surface border border-forge-border rounded-3xl p-6 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {selectedFile ? selectedFile : 'Select a File'}
            </h3>
            {selectedFile && (
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        if (selectedAgent && selectedFile) {
                          fetchFileContent(selectedAgent, selectedFile);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-forge-border text-forge-text-muted text-sm hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveFile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-forge-emerald/10 text-forge-emerald text-sm hover:bg-forge-emerald/20 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {saveMessage && (
            <div className={`mb-4 px-4 py-2 rounded-pill text-sm ${
              saveMessage.includes('success') 
                ? 'bg-forge-emerald/10 text-forge-emerald' 
                : 'bg-forge-amber/10 text-forge-amber'
            }`}>
              {saveMessage}
            </div>
          )}

          {selectedFile ? (
            isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full bg-[#0A0A0A] border border-forge-border rounded-2xl p-6 text-forge-text-main text-base font-mono resize-none focus:outline-none focus:border-primary/50 leading-relaxed"
                spellCheck={false}
              />
            ) : (
              <pre className="flex-1 w-full bg-[#0A0A0A] border border-forge-border rounded-2xl p-6 text-forge-text-main text-base font-mono overflow-auto whitespace-pre-wrap leading-relaxed">
                {content}
              </pre>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-forge-text-muted">
              <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
              <span className="text-sm">Select a file to view</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesView;
