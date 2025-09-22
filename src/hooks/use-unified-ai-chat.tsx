/**
 * Unified AI Chat Hook
 * 
 * Single hook for all AI chat interactions with real OpenAI integration
 */

import { useState, useRef, useEffect } from 'react';
import { useBusinessStore } from '@/store/business';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UseUnifiedAIChatProps {
  contextLevel: 'home' | 'overview' | 'subarea' | 'task';
  impactArea?: string;
  subArea?: string;
  taskId?: string;
  initialMessage?: string;
}

export function useUnifiedAIChat({
  contextLevel,
  impactArea,
  subArea,
  taskId,
  initialMessage
}: UseUnifiedAIChatProps) {
  const { currentBusiness } = useBusinessStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (initialMessage) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: initialMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [initialMessage]);

  const getInitialMessage = () => {
    switch (contextLevel) {
      case 'subarea':
        return `Hello! I'm your ${subArea} specialist within the ${impactArea} impact area. I focus specifically on ${subArea?.toLowerCase()} requirements and best practices for B Corp certification. How can I help you with ${subArea?.toLowerCase()} today?`;
      case 'task':
        return `Hello! I'm here to help you with this specific task. I can provide guidance, answer questions, and help you complete this task effectively. What do you need to know?`;
      case 'overview':
        return `Hello! I'm your ${impactArea} specialist. I can help you understand all aspects of the ${impactArea} impact area for B Corp certification, including requirements, best practices, and implementation strategies. What would you like to explore?`;
      default:
        return `Hello! I'm your B Corp consultant. I can provide comprehensive business analysis, help with document review, and guide you through the entire certification process. How can I assist you today?`;
    }
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content || !currentBusiness) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to use AI chat');
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('unified-ai-chat', {
        body: {
          sessionId,
          message: content,
          contextLevel,
          businessId: currentBusiness.id,
          userId: user.id,
          impactArea,
          subArea,
          taskId
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { response: assistantContent, sessionId: newSessionId } = response.data;

      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: assistantContent,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. In the meantime, you can explore the knowledge base or contact support if you need immediate assistance.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      toast.error('AI chat temporarily unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    const initialMsg = initialMessage || getInitialMessage();
    setMessages([{
      id: 'welcome',
      content: initialMsg,
      role: 'assistant',
      timestamp: new Date()
    }]);
    setInputValue('');
    setIsLoading(false);
    setSessionId(null);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    scrollAreaRef,
    sendMessage,
    handleKeyPress,
    resetChat
  };
}