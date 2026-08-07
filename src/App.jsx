import { useState, useEffect } from 'react'
import AgentSelector from './components/AgentSelector'
import AgentChat from './components/AgentChat'
import './styles/App.css'

function App() {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateLabel = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-title">
            <span className="brand-label">J.A.R.V.I.S.</span>
            <span className="brand-status">Online</span>
          </div>
          <p className="brand-subtitle">Marker Media CEO Operation System</p>
        </div>

        <div className="header-meta">
          <div className="meta-item">
            <i className="ti-clock" />
            <span>{timeLabel}</span>
          </div>
          <div className="meta-item">
            <span>{dateLabel}</span>
          </div>
          <div className="meta-item weather-item">
            <i className="ti-cloud" />
            <span>25.2°C Quezon City</span>
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        <aside className="dashboard-panel left-panel">
          <div className="panel-top">
            <div className="panel-title">
              <span>System Stats</span>
              <h2>Operational Readout</h2>
            </div>
            <button className="panel-action" aria-label="Refresh stats">
              <i className="ti-refresh" />
            </button>
          </div>

          <div className="panel-body">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">CPU Usage</div>
                <strong>8%</strong>
                <div className="progress-bar">
                  <div style={{ width: '8%' }} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">RAM Usage</div>
                <strong>7 GB</strong>
                <div className="progress-bar">
                  <div style={{ width: '65%' }} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Disk Availability</div>
                <strong>439 / 475 GB</strong>
              </div>
            </div>

            <div className="section-block">
              <div className="section-head">
                <span>Weather</span>
                <button aria-label="Refresh weather">
                  <i className="ti-refresh" />
                </button>
              </div>
              <div className="weather-card">
                <div className="weather-top">
                  <span className="weather-temp">25.2°C</span>
                  <span className="weather-location">Quezon City, PH</span>
                </div>
                <div className="weather-details">
                  <div>
                    <strong>Humidity</strong>
                    <span>94%</span>
                  </div>
                  <div>
                    <strong>Wind</strong>
                    <span>5.8 m/s</span>
                  </div>
                  <div>
                    <strong>Feels Like</strong>
                    <span>26.3°C</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <div className="section-head">
                <span>Camera</span>
                <button aria-label="Toggle camera">
                  <i className="ti-power" />
                </button>
              </div>
              <div className="camera-card">
                <i className="ti-camera" />
                <p>Camera is inactive. Click the power button to start.</p>
              </div>
            </div>

            <div className="section-block">
              <div className="section-head">
                <span>System Uptime</span>
                <span className="uptime-chip">00:07:19</span>
              </div>
              <div className="uptime-card">
                <div className="uptime-row">
                  <div>
                    <span>Session</span>
                    <strong>1</strong>
                  </div>
                  <div>
                    <span>Commands</span>
                    <strong>0</strong>
                  </div>
                </div>
                <div className="uptime-footer">
                  <span>System Load</span>
                  <div className="load-bar">
                    <div style={{ width: '26%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="dashboard-panel center-panel">
          <div className="hub-shell">
            <div className="hub-ring">
              <div className="hub-inner">
                <div className="hub-core">
                  <span>J.A.R.V.I.S.</span>
                  <p>Listening for wake word...</p>
                </div>
              </div>
            </div>

            <p className="hub-copy">
              Voice and command systems are running in offline safe mode. Connect an agent to begin a strategic action session.
            </p>

            <div className="hub-actions">
              <button className="hub-chip">
                <i className="ti-microphone" />
                Mic
              </button>
              <button className="hub-chip">
                <i className="ti-camera" />
                Camera
              </button>
              <button className="hub-chip">
                <i className="ti-keyboard" />
                Keyboard
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-panel right-panel">
          <div className="panel-top">
            <div className="panel-title">
              <span>Conversation</span>
              <h2>{selectedAgent ? selectedAgent.label : 'Agent Console'}</h2>
            </div>
            {selectedAgent && (
              <div className="top-actions">
                <button className="top-btn" type="button">
                  <i className="ti-trash" />
                  Clear
                </button>
                <button className="top-btn primary" type="button">
                  <i className="ti-download" />
                  Extract
                </button>
              </div>
            )}
          </div>

          <div className="panel-body">
            {selectedAgent ? (
              <AgentChat agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
            ) : (
              <AgentSelector onSelectAgent={setSelectedAgent} selectedAgent={selectedAgent} />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
