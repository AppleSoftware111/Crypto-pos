import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { sendMessageToOmaraAI } from '@/services/OmaraAIService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const OmaraAIChatContext = createContext(null);

export const useOmaraAIChat = () => {
  const context = useContext(OmaraAIChatContext);
  if (!context) {
    throw new Error('useOmaraAIChat must be used within an OmaraAIChatProvider');
  }
  return context;
};

export const OmaraAIChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm **Omara AI**. I'm here to assist with your payment operations, compliance needs, and business growth. \n\n**What's on your mind today?**",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress } = useAuth(); 
  const { toast } = useToast();

  const addMessage = useCallback(async (content) => {
    const userMsgId = Date.now().toString();
    const newMessage = {
      id: userMsgId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const aiResponseContent = await sendMessageToOmaraAI(content, messages, walletAddress);
      
      const aiMsgId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Omara AI Error:", error);
      toast({
        title: "AI Service Unavailable",
        description: error.message || "Failed to get a response from Omara AI.",
        variant: "destructive",
      });
      
      setMessages((prev) => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, walletAddress, toast]);

  const clearHistory = useCallback(() => {
    setMessages([
        {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: "Chat history cleared. \n\n**What's on your mind today?**",
          timestamp: new Date().toISOString(),
        }
    ]);
  }, []);

  const value = useMemo(() => ({
      messages, 
      isLoading, 
      addMessage, 
      clearHistory
  }), [messages, isLoading, addMessage, clearHistory]);

  return (
    <OmaraAIChatContext.Provider value={value}>
      {children}
    </OmaraAIChatContext.Provider>
  );
};