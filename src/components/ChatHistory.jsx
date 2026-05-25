import '../styles/ChatHistory.css';

export default function ChatHistory({ sessions, currentSessionId, onLoadSession, onDeleteSession, onClearAll }) {
  if (!sessions.length) {
    return (
      <div className="chat-history">
        <div className="history-header">
          <h3>History</h3>
        </div>
        <div className="history-empty">
          <i className="ti-history"></i>
          <p>No chat history yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-history">
      <div className="history-header">
        <h3>History</h3>
        {sessions.length > 0 && (
          <button 
            className="history-clear-btn" 
            onClick={onClearAll}
            title="Clear all history"
          >
            <i className="ti-trash"></i>
          </button>
        )}
      </div>

      <div className="history-list">
        {sessions.map(session => (
          <div
            key={session.id}
            className={`history-item ${currentSessionId === session.id ? 'active' : ''}`}
            onClick={() => onLoadSession(session.id)}
          >
            <div className="history-item-content">
              <div className="history-item-title">{session.summary}</div>
              <div className="history-item-meta">
                <span className="history-agent">{session.agentLabel}</span>
                <span className="history-time">
                  {new Date(session.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {session.insights.length > 0 && (
                <div className="history-insights">
                  {session.insights.map((insight, idx) => (
                    <span key={idx} className={`insight-tag ${insight.type}`}>
                      {insight.type}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              className="history-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              title="Delete this conversation"
            >
              <i className="ti-x"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
