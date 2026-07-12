import { AGENTS } from '../constants/agents';
import AgentCard from './AgentCard';
import '../styles/AgentSelector.css';

export default function AgentSelector({ onSelectAgent, selectedAgent }) {
  return (
    <div className="agent-selector">
      <div className="selector-header">
        <h2>{selectedAgent ? 'Choose another agent' : 'Choose Your Agent'}</h2>
        <p>Select an agent to guide your strategic decision-making in the CEO dashboard.</p>
      </div>

      <div className="agents-grid">
        {AGENTS.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onClick={() => onSelectAgent(agent)}
          />
        ))}
      </div>

      <div className="selector-footer">
        <p>Each agent specializes in a different aspect of scaling Marker Media.</p>
      </div>
    </div>
  );
}
