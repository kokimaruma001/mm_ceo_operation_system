import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useChatHistory() {
  const [chatSessions, setChatSessions] = useLocalStorage('chatSessions', []);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Extract key insights from messages
  const extractInsights = (messages) => {
    if (!messages.length) return [];
    
    const insights = [];
    
    // Look for actionable items, commitments, and key findings
    messages.forEach((msg, idx) => {
      if (msg.role === 'user') {
        // Extract user intent
        const content = msg.content.toLowerCase();
        if (content.includes('commit') || content.includes('will') || content.includes('plan')) {
          insights.push({
            type: 'commitment',
            content: msg.content,
            timestamp: new Date().toISOString()
          });
        }
        if (content.includes('issue') || content.includes('problem') || content.includes('challenge')) {
          insights.push({
            type: 'challenge',
            content: msg.content,
            timestamp: new Date().toISOString()
          });
        }
        if (content.includes('goal') || content.includes('target') || content.includes('milestone')) {
          insights.push({
            type: 'goal',
            content: msg.content,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    return insights.slice(0, 3); // Keep top 3 insights
  };

  // Generate a smart summary from messages
  const generateSummary = (messages) => {
    if (!messages.length) return 'New conversation';
    
    const firstUserMsg = messages.find(m => m.role === 'user')?.content || '';
    return firstUserMsg.substring(0, 60) + (firstUserMsg.length > 60 ? '...' : '');
  };

  const saveSession = useCallback((agentId, agentLabel, messages) => {
    const sessionId = Date.now().toString();
    const newSession = {
      id: sessionId,
      agentId,
      agentLabel,
      messages,
      summary: generateSummary(messages),
      insights: extractInsights(messages),
      timestamp: new Date().toISOString(),
      messageCount: messages.length,
    };

    setChatSessions(prev => [newSession, ...prev].slice(0, 50)); // Keep last 50 sessions
    setCurrentSessionId(sessionId);
    return sessionId;
  }, [setChatSessions]);

  const loadSession = useCallback((sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    setCurrentSessionId(sessionId);
    return session;
  }, [chatSessions]);

  const deleteSession = useCallback((sessionId) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [setChatSessions, currentSessionId]);

  const clearAllSessions = useCallback(() => {
    setChatSessions([]);
    setCurrentSessionId(null);
  }, [setChatSessions]);

  const getSessionsByAgent = useCallback((agentId) => {
    return chatSessions.filter(s => s.agentId === agentId);
  }, [chatSessions]);

  const getCurrentSession = useCallback(() => {
    return chatSessions.find(s => s.id === currentSessionId);
  }, [chatSessions, currentSessionId]);

  return {
    chatSessions,
    currentSessionId,
    saveSession,
    loadSession,
    deleteSession,
    clearAllSessions,
    getSessionsByAgent,
    getCurrentSession,
  };
}
