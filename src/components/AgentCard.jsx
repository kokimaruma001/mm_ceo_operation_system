import '../styles/AgentCard.css';

export default function AgentCard({ agent, onClick }) {
  return (
    <div
      className="agent-card"
      style={{ '--accent-color': agent.accent }}
      onClick={onClick}
    >
      <div className="agent-icon">
        <i className={agent.icon}></i>
      </div>
      <h3 className="agent-label">{agent.label}</h3>
      <p className="agent-sub">{agent.sub}</p>
      <div className="agent-hover">
        <p>Start conversation</p>
        <i className="ti-arrow-right"></i>
      </div>
    </div>
  );
}
