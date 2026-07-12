import { useState } from 'react'
import AgentSelector from './components/AgentSelector'
import AgentChat from './components/AgentChat'
import './styles/App.css'

function App() {
  const [selectedAgent, setSelectedAgent] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <h1>Marker Media CEO Operation System</h1>
          <p>Strategic guidance for luxury creative agency scaling</p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-shell">
          <div className={`app-panel app-panel-left ${selectedAgent ? '' : 'full-panel'}`}>
            <AgentSelector onSelectAgent={setSelectedAgent} selectedAgent={selectedAgent} />
          </div>

          {selectedAgent && (
            <div className="app-panel app-panel-main">
              <AgentChat agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
            </div>
          )}

          {selectedAgent && (
            <div className="app-panel app-panel-right">
              <div className="panel-header">
                <span>STATUS</span>
                <h2>Operational Metrics</h2>
              </div>
              <div className="metric-stack">
                <div className="metric-card">
                  <span className="metric-label">System Integrity</span>
                  <strong>98%</strong>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Uplink</span>
                  <strong>SECURE</strong>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Active Processes</span>
                  <strong>7 Running</strong>
                </div>
              </div>
              <div className="panel-footer">
                <p>Live status updates and operational view are shown here while the agent chat remains active.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
