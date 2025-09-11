/**
 * Unified Chat Behavior Hook
 * 
 * Single principle for all AI chat behaviors to eliminate code duplication
 */

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UseChatBehaviorProps {
  initialMessage?: string;
  contextType?: 'general' | 'task' | 'impact-area' | 'subarea';
  contextData?: {
    taskTitle?: string;
    impactArea?: string;
    subArea?: string;
  };
}

export function useChatBehavior({ 
  initialMessage, 
  contextType = 'general',
  contextData = {}
}: UseChatBehaviorProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const generateContextualResponse = (userContent: string) => {
    let baseResponse = "I understand you need help. ";
    
    switch (contextType) {
      case 'task':
        if (contextData.taskTitle) {
          baseResponse = `For the task "${contextData.taskTitle}", I recommend focusing on step-by-step implementation. `;
        }
        break;
      case 'impact-area':
        if (contextData.impactArea) {
          baseResponse = `For ${contextData.impactArea} impact area, `;
          if (contextData.impactArea === 'Governance') {
            baseResponse += "focus on establishing clear policies and accountability structures. ";
          } else if (contextData.impactArea === 'Workers') {
            baseResponse += "ensure fair treatment and employee well-being. ";
          } else if (contextData.impactArea === 'Community') {
            baseResponse += "consider stakeholder engagement and local partnerships. ";
          } else if (contextData.impactArea === 'Environment') {
            baseResponse += "track your resource usage and implement sustainable practices. ";
          } else if (contextData.impactArea === 'Customers') {
            baseResponse += "prioritize transparency and positive impact on your users. ";
          }
        }
        break;
      case 'subarea':
        if (contextData.subArea) {
          baseResponse = `For ${contextData.subArea} specifically, I can provide targeted guidance. `;
        }
        break;
      default:
        baseResponse = "I'm here to help with your B Corp journey! I can provide insights on your business progress, analyze documents, and guide you through certification requirements. ";
    }

    return baseResponse + "What specific guidance do you need to move forward?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Generate contextual AI response
    setTimeout(() => {
      const responseContent = generateContextualResponse(inputValue);
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: responseContent,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages(initialMessage ? [{
      id: 'welcome',
      content: initialMessage,
      role: 'assistant',
      timestamp: new Date()
    }] : []);
    setInputValue('');
    setIsLoading(false);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    scrollAreaRef,
    handleSendMessage,
    handleKeyPress,
    resetChat
  };
}