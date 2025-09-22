/**
 * Task Chat Panel Component
 * 
 * Unified AI chat panel for task assistance
 */

import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUnifiedAIChat } from '@/hooks/use-unified-ai-chat';

interface TaskChatPanelProps {
  taskId: string;
  taskTitle: string;
  impactArea: string;
  className?: string;
}

export function TaskChatPanel({
  taskId,
  taskTitle,
  impactArea,
  className = ""
}: TaskChatPanelProps) {
  const initialMessage = `Hi! I'm here to help you with "${taskTitle}". I can provide step-by-step guidance, explain B Corp requirements, and suggest best practices. What specific aspect would you like help with?`;

  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    scrollAreaRef,
    sendMessage,
    handleKeyPress
  } = useUnifiedAIChat({
    contextLevel: 'task',
    impactArea,
    taskId,
    initialMessage
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage();
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-3 p-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start a conversation to get help</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="border-t pt-3 px-4 pb-4 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about "${taskTitle}"...`}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}