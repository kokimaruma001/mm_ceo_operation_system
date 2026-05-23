import { useState } from 'react'
import AgentSelector from './components/AgentSelector'
import AgentChat from './components/AgentChat'
import './styles/App.css'

function App() {
  const [selectedAgent, setSelectedAgent] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Marker Media CEO Operation System</h1>
        <p>Strategic guidance for luxury creative agency scaling</p>
      </header>
      
      <main className="app-main">
        {!selectedAgent ? (
          <AgentSelector onSelectAgent={setSelectedAgent} />
        ) : (
          <AgentChat agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
        )}
      </main>
    </div>
  )
}

export default App
