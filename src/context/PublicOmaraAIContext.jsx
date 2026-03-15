import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { sendMessageToOmaraAI } from '@/services/OmaraAIService';
import { checkRateLimit, recordMessage, getRemainingMessages } from '@/lib/publicAIRateLimit';
import { useToast } from '@/components/ui/use-toast';

const PublicOmaraAIContext = createContext(null);

export const usePublicOmaraAI = () => {
  const context = useContext(PublicOmaraAIContext);
  if (!context) {
    throw new Error('usePublicOmaraAI must be used within a PublicOmaraAIProvider');
  }
  return context;
};

export const PublicOmaraAIProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponseCount, setAiResponseCount] = useState(0);
  const { toast } = useToast();

  const addMessage = useCallback(async (content) => {
    const limitStatus = checkRateLimit();
    if (!limitStatus.allowed) {
      toast({
        title: "Message Limit Reached",
        description: "You've reached your free message limit. Sign up for unlimited access!",
        variant: "destructive",
      });
      
      setMessages((prev) => [...prev, {
        id: 'system-limit-' + Date.now(),
        role: 'system',
        content: "🔒 **Limit Reached**: You've used your free messages for this hour. [Sign up free](/register) to continue chatting without limits!",
        timestamp: new Date().toISOString(),
      }]);
      return;
    }

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
      recordMessage();

      const aiResponseContent = await sendMessageToOmaraAI(content, messages, 'public-guest-user');
      
      const aiMsgId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setAiResponseCount(prev => prev + 1);

    } catch (error) {
      console.error("Omara AI Error:", error);
      toast({
        title: "AI Service Unavailable",
        description: "We're experiencing high traffic. Please try again momentarily.",
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
  }, [messages, toast]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setAiResponseCount(0);
  }, []);

  const getRemaining = useCallback(() => {
      return getRemainingMessages();
  }, []);

  const value = useMemo(() => ({ 
        messages, 
        isLoading, 
        addMessage, 
        clearHistory,
        aiResponseCount,
        getRemaining
  }), [messages, isLoading, addMessage, clearHistory, aiResponseCount, getRemaining]);

  return (
    <PublicOmaraAIContext.Provider value={value}>
      {children}
    </PublicOmaraAIContext.Provider>
  );
};