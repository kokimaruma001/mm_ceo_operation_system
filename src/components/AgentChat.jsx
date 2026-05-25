import { useState, useRef, useEffect } from 'react';
import { anthropicClient } from '../services/anthropic';
import MessageBubble from './MessageBubble';
import ChatNavBar from './ChatNavBar';
import ChatHistory from './ChatHistory';
import { useChatHistory } from '../hooks/useChatHistory';
import '../styles/AgentChat.css';

export default function AgentChat({ agent, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { chatSessions, saveSession, deleteSession, clearAllSessions, getSessionsByAgent } = useChatHistory();
  const agentSessions = getSessionsByAgent(agent.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await anthropicClient.sendMessage(agent.prompt, updatedMessages);
      const assistantMessage = { role: 'assistant', content: response };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Save session after first exchange
      if (messages.length === 0) {
        saveSession(agent.id, agent.label, finalMessages);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Error communicating with the AI. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setIsHistoryOpen(false);
    }
  };

  if (!messages.length) {
    return (
      <div className="agent-chat-container">
        <ChatNavBar 
          agent={agent} 
          onBack={onBack}
          onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
          isHistoryOpen={isHistoryOpen}
          sessionCount={agentSessions.length}
        />
        
        {isHistoryOpen && (
          <ChatHistory
            sessions={agentSessions}
            currentSessionId={null}
            onLoadSession={handleLoadSession}
            onDeleteSession={deleteSession}
            onClearAll={() => {
              clearAllSessions();
              setIsHistoryOpen(false);
            }}
          />
        )}

        <div className="agent-chat">
          <div className="chat-messages">
            <div className="initial-message">
              <div className="initial-icon">
                <i className={agent.icon}></i>
              </div>
              <p className="greeting">
                {agent.id === 'clarity' && 'What did you work on today?'}
                {agent.id === 'revenue' && 'What revenue activity are you working on?'}
                {agent.id === 'strategy' && 'What needs to happen in the next 90 days?'}
                {agent.id === 'clients' && 'Who is your ideal client right now?'}
                {agent.id === 'execution' && 'What was your top commitment?'}
              </p>
            </div>
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Start typing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <i className="ti-send"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-chat-container">
      <ChatNavBar 
        agent={agent} 
        onBack={onBack}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
        sessionCount={agentSessions.length}
      />
      
      {isHistoryOpen && (
        <ChatHistory
          sessions={agentSessions}
          currentSessionId={null}
          onLoadSession={handleLoadSession}
          onDeleteSession={deleteSession}
          onClearAll={() => {
            clearAllSessions();
            setIsHistoryOpen(false);
          }}
        />
      )}

      <div className="agent-chat">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} agentAccent={agent.accent} />
          ))}
          {isLoading && (
            <div className="message-bubble assistant-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            <i className="ti-send"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
