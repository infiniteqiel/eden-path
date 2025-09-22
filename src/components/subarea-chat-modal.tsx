/**
 * SubArea Chat Modal
 * 
 * Dedicated modal for SubArea specific chats with isolated state management.
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, History } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';
import { useUnifiedAIChat } from '@/hooks/use-unified-ai-chat';
import { useBusinessStore } from '@/store/business';
import { supabase } from '@/integrations/supabase/client';

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

interface SubAreaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactArea: ImpactArea;
  subArea: string;
  subAreaId?: string;
}

export function SubAreaChatModal({ 
  isOpen, 
  onClose, 
  impactArea,
  subArea,
  subAreaId
}: SubAreaChatModalProps) {
  const { currentBusiness } = useBusinessStore();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    scrollAreaRef,
    sendMessage,
    handleKeyPress,
    sessionId
  } = useUnifiedAIChat({
    contextLevel: 'subarea',
    impactArea,
    subArea,
    subAreaId
  });

  // Load and refresh chat sessions
  useEffect(() => {
    if (isOpen && currentBusiness) {
      loadChatSessions();
    }
  }, [isOpen, currentBusiness, impactArea, subArea]);

  // Refresh sessions after each message
  useEffect(() => {
    if (sessionId && currentBusiness) {
      loadChatSessions();
    }
  }, [messages.length, sessionId, currentBusiness]);

  const loadChatSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !currentBusiness) return;

    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('business_id', currentBusiness.id)
      .eq('level', 'subarea')
      .eq('impact_area', impactArea)
      .eq('specific_area', subArea)
      .is('task_id', null)
      .order('updated_at', { ascending: false });

    if (sessions) {
      setChatSessions(sessions);
    }
  };

  const chatTitle = `${subArea} Specialist`;
  const chatAgentId = `subarea-${impactArea.toLowerCase()}-${subArea.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl h-[700px] flex flex-col bg-white border-2 border-gray-200 shadow-2xl overflow-hidden"
        data-chat-agent-id={chatAgentId}
        data-chat-context={`subarea-${impactArea}-${subArea}`}
      >
        <DialogHeader className="bg-white border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            AI Chat - {chatTitle}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="ml-2"
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
            <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
              Beta
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex min-h-0 bg-white rounded-lg overflow-hidden">
          {/* Chat History Sidebar */}
          {showHistory && (
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium text-sm text-gray-700">SubArea Chats</h3>
                <p className="text-xs text-gray-500 mt-1">{impactArea} → {subArea}</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {chatSessions.map((session) => (
                    <Button
                      key={session.id}
                      variant={session.id === sessionId ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-auto p-2 text-left"
                    >
                      <div className="flex flex-col items-start w-full">
                        <span className="text-xs font-medium">{subArea}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Button>
                  ))}
                  {chatSessions.length === 0 && (
                    <p className="text-xs text-gray-500 p-2">No previous chats</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg overflow-hidden">
            <ScrollArea className="flex-1 bg-gray-50 rounded-lg mx-2 mt-2 p-4 overflow-hidden" ref={scrollAreaRef}>
              <div className="space-y-4 pr-2">
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
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                            <User className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 shadow-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse text-gray-600">Analyzing...</div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4 mx-2 mb-2 bg-white p-3 border-t border-gray-200 flex-shrink-0">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${subArea}...`}
                disabled={isLoading}
                className="flex-1 bg-white border-gray-300 focus:border-blue-500"
              />
              <Button 
                onClick={() => sendMessage()} 
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
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