import '../styles/ChatNavBar.css';

export default function ChatNavBar({ agent, onBack, onToggleHistory, isHistoryOpen, sessionCount }) {
  return (
    <div className="chat-nav-bar" style={{ '--accent-color': agent.accent }}>
      <div className="nav-bar-left">
        <button className="nav-back-btn" onClick={onBack} title="Back to agents">
          <i className="ti-arrow-left"></i>
          <span>Back</span>
        </button>
        <div className="nav-agent-info">
          <i className={agent.icon}></i>
          <div>
            <h2>{agent.label}</h2>
            <p>{agent.sub}</p>
          </div>
        </div>
      </div>

      <div className="nav-bar-right">
        <button
          className={`nav-history-btn ${isHistoryOpen ? 'active' : ''}`}
          onClick={onToggleHistory}
          title="Toggle chat history"
        >
          <i className="ti-history"></i>
          {sessionCount > 0 && <span className="history-badge">{sessionCount}</span>}
        </button>
      </div>
    </div>
  );
}
