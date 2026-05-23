import '../styles/MessageBubble.css';

export default function MessageBubble({ message, agentAccent }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'user-message' : 'assistant-message'}`}>
      {!isUser && <div className="message-avatar" style={{ '--accent': agentAccent }} />}
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
}
