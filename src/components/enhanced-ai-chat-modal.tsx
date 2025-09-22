/**
 * Enhanced AI Chat Modal with Persistent History
 * 
 * Stores chat sessions in Supabase with hierarchical context tracking.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';
import { useUnifiedAIChat } from '@/hooks/use-unified-ai-chat';

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
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    scrollAreaRef,
    sendMessage,
    handleKeyPress
  } = useUnifiedAIChat({
    contextLevel,
    impactArea,
    subArea,
    taskId: taskTitle
  });


  const chatAgentId = `chat-agent-${impactArea.toLowerCase()}-${contextLevel}-${subArea ? subArea.toLowerCase().replace(/\s+/g, '-') : 'main'}`;
  const chatTitle = contextLevel === 'subarea' && subArea ? `${subArea} Specialist` :
                   contextLevel === 'task' && taskTitle ? `Task Assistant` :
                   `${impactArea} Specialist`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl h-[700px] flex flex-col bg-white border-2 border-gray-200 shadow-2xl overflow-hidden"
        data-chat-agent-id={chatAgentId}
        data-chat-context={`${impactArea}-${contextLevel}-${subArea || 'main'}`}
      >
        <DialogHeader className="bg-white border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            AI Chat - {chatTitle}
            <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
              Beta
            </Badge>
          </DialogTitle>
        </DialogHeader>

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
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-sm">
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
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-sm">
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
              placeholder={
                contextLevel === 'subarea' && subArea ? `Ask about ${subArea}...` :
                contextLevel === 'task' && taskTitle ? `Ask about this task...` :
                `Ask about ${impactArea} requirements...`
              }
              disabled={isLoading}
              className="flex-1 bg-white border-gray-300 focus:border-green-500"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={isLoading || !inputValue.trim()}
              className="bg-green-600 hover:bg-green-700 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}