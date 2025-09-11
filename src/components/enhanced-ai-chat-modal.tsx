/**
 * Enhanced AI Chat Modal with Persistent History
 * 
 * Stores chat sessions in Supabase with hierarchical context tracking.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, History, X } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessStore } from '@/store/business';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  business_id: string;
  level: string;
  impact_area?: string;
  specific_area?: string;
  task_id?: string;
  created_at: string;
  updated_at: string;
}

interface EnhancedAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactArea: ImpactArea;
  subArea?: string;
  taskTitle?: string;
  contextLevel?: 'overview' | 'subarea' | 'task';
}

export function EnhancedAIChatModal({ 
  isOpen, 
  onClose, 
  impactArea, 
  subArea, 
  taskTitle, 
  contextLevel = 'overview' 
}: EnhancedAIChatModalProps) {
  const { currentBusiness } = useBusinessStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && currentBusiness) {
      loadOrCreateSession();
      loadSessions();
    }
  }, [isOpen, currentBusiness, impactArea, subArea, taskTitle, contextLevel]);

  const loadSessions = async () => {
    if (!currentBusiness) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('business_id', currentBusiness.id)
      .eq('level', contextLevel)
      .eq('impact_area', impactArea)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading sessions:', error);
      return;
    }

    setSessions(data || []);
  };

  const loadOrCreateSession = async () => {
    if (!currentBusiness) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Try to find existing session
    let query = supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('business_id', currentBusiness.id)
      .eq('level', contextLevel)
      .eq('impact_area', impactArea);

    if (subArea) query = query.eq('specific_area', subArea);
    if (taskTitle) query = query.eq('task_id', taskTitle);

    const { data: existingSessions } = await query
      .order('updated_at', { ascending: false })
      .limit(1);

    let session: ChatSession;

    if (existingSessions && existingSessions.length > 0) {
      session = existingSessions[0];
    } else {
      // Create new session
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          business_id: currentBusiness.id,
          level: contextLevel,
          impact_area: impactArea,
          specific_area: subArea,
          task_id: taskTitle
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return;
      }

      session = newSession;
    }

    setCurrentSession(session);
    loadMessages(session.id);
  };

  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (data && data.length > 0) {
      setMessages(data.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at
      })));
    } else {
      // Add initial message for new sessions
      const initialMessage = getInitialMessage();
      setMessages([{
        id: '1',
        role: 'assistant',
        content: initialMessage,
        created_at: new Date().toISOString()
      }]);
    }
  };

  const getInitialMessage = () => {
    switch (contextLevel) {
      case 'subarea':
        return `Hello! I'm your AI specialist for "${subArea}" within the ${impactArea} impact area. I can help you analyze documents, provide recommendations, and answer specific questions about ${subArea} requirements for B Corp certification. How can I assist you today?`;
      case 'task':
        return `Hello! I'm your task-specific AI assistant for "${taskTitle}". I can help you understand this specific requirement, provide implementation guidance, and answer questions about completing this task. What would you like to know?`;
      default:
        return `Hello! I'm your ${impactArea} Impact Area Specialist. I can help you analyze your documents, provide recommendations, and answer questions about B Corp requirements across all ${impactArea} areas. How can I help you today?`;
    }
  };

  const saveMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>) => {
    if (!currentSession) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSession.id,
        user_id: user.id,
        role: message.role,
        content: message.content
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return;
    }

    return {
      id: data.id,
      role: data.role as 'user' | 'assistant',
      content: data.content,
      created_at: data.created_at
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;

    const userMessage = {
      role: 'user' as const,
      content: inputValue
    };

    // Add to UI immediately
    const tempUserMessage = {
      id: Date.now().toString(),
      ...userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);
    setInputValue('');
    setIsLoading(true);

    // Save to database
    const savedUserMessage = await saveMessage(userMessage);
    if (savedUserMessage) {
      setMessages(prev => prev.map(msg => 
        msg.id === tempUserMessage.id ? savedUserMessage : msg
      ));
    }

    // Simulate AI response
    setTimeout(async () => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: `Based on your question about "${userMessage.content}", here's my analysis for ${impactArea}:

This is a placeholder response. The actual AI integration will provide:
- Document analysis results
- Specific B Corp recommendations  
- Gap analysis for your ${impactArea} requirements
- Actionable next steps

I'm analyzing your uploaded documents and cross-referencing with the B Corp knowledge base to provide tailored guidance.`
      };

      // Add to UI
      const tempAssistantMessage = {
        id: (Date.now() + 1).toString(),
        ...assistantMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempAssistantMessage]);

      // Save to database
      const savedAssistantMessage = await saveMessage(assistantMessage);
      if (savedAssistantMessage) {
        setMessages(prev => prev.map(msg => 
          msg.id === tempAssistantMessage.id ? savedAssistantMessage : msg
        ));
      }

      setIsLoading(false);

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSession.id);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const switchToSession = (session: ChatSession) => {
    setCurrentSession(session);
    loadMessages(session.id);
    setShowHistory(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            {contextLevel === 'subarea' && subArea ? `AI Chat - ${subArea}` :
             contextLevel === 'task' && taskTitle ? `AI Chat - Task` :
             `AI Chat - ${impactArea}`}
            <Badge variant="outline" className="ml-auto">
              Beta
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="ml-2"
            >
              <History className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4">
          {/* Chat History Sidebar */}
          {showHistory && (
            <div className="w-64 border-r pr-4">
              <h4 className="font-medium mb-3">Previous Chats</h4>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-2 rounded cursor-pointer hover:bg-muted ${
                        currentSession?.id === session.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => switchToSession(session)}
                    >
                      <p className="text-sm font-medium truncate">
                        {session.specific_area || session.impact_area}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse">Analyzing...</div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  contextLevel === 'subarea' && subArea ? `Ask about ${subArea}...` :
                  contextLevel === 'task' && taskTitle ? `Ask about this task...` :
                  `Ask about ${impactArea} requirements...`
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}