import React, { createContext, useState, useContext, useCallback } from 'react';
import { getAuth } from 'firebase/auth';

interface ChatContextType {
  currentSessionId: string | null;
  createNewSession: () => Promise<string>;
  loadChatHistory: (sessionId?: string) => Promise<any[]>;
  addMessageToSession: (message: { sender: 'user' | 'ai', content: string }) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const createNewSession = useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create chat session');
    }

    const { sessionId } = await response.json();
    setCurrentSessionId(sessionId);
    return sessionId;
  }, []);

  const loadChatHistory = useCallback(async (sessionId?: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const url = sessionId 
      ? `/api/chat-history?sessionId=${sessionId}` 
      : '/api/chat-history';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load chat history');
    }

    return await response.json();
  }, []);

  const addMessageToSession = useCallback(async (message: { sender: 'user' | 'ai', content: string }) => {
    if (!currentSessionId) {
      throw new Error('No active chat session');
    }

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();

    await fetch(`/api/chat/${currentSessionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  }, [currentSessionId]);

  return (
    <ChatContext.Provider value={{
      currentSessionId,
      createNewSession,
      loadChatHistory,
      addMessageToSession
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};