import { createContext, useContext, useState } from 'react';

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState({});

  const addMessage = (agentId, message) => {
    setConversations(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), message],
    }));
  };

  const getConversation = (agentId) => {
    return conversations[agentId] || [];
  };

  const clearConversation = (agentId) => {
    setConversations(prev => ({
      ...prev,
      [agentId]: [],
    }));
  };

  return (
    <ConversationContext.Provider
      value={{
        addMessage,
        getConversation,
        clearConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
};
