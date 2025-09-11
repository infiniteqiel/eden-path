/**
 * Broad Chat Component
 * 
 * Main chat interface for general business analysis
 * Expands/collapses and stores conversation history
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Maximize2, Minimize2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ImpactSummary, Todo } from '@/domain/data-contracts';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface BroadChatProps {
  className?: string;
  impactSummaries?: ImpactSummary[];
  todos?: Todo[];
}

export function BroadChat({ className, impactSummaries = [], todos = [] }: BroadChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: "I'm here to help with your B Corp journey! I can provide insights on your business progress, analyze documents, and guide you through certification requirements. What would you like to discuss?",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleBirdsEyeAnalysis = () => {
    setIsLoading(true);
    
    // Generate analysis based on live data
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.status === 'done').length;
    const priorityTodos = todos.filter(t => t.priority === 'P1' && t.status !== 'done').length;
    const avgProgress = impactSummaries.reduce((acc, curr) => acc + curr.pct, 0) / impactSummaries.length || 0;
    
    let analysisContent = "🔍 **Bird's Eye View Analysis**\n\n";
    analysisContent += `**Overall Progress:** ${avgProgress.toFixed(1)}% average across impact areas\n`;
    analysisContent += `**Task Completion:** ${completedTodos}/${totalTodos} tasks completed (${((completedTodos/totalTodos)*100).toFixed(0)}%)\n`;
    analysisContent += `**Priority Items:** ${priorityTodos} high-priority tasks pending\n\n`;
    
    analysisContent += "**Impact Area Breakdown:**\n";
    impactSummaries.forEach(summary => {
      const areaTodos = todos.filter(t => t.impact === summary.impact && t.status !== 'done').length;
      analysisContent += `• ${summary.impact}: ${summary.pct}% complete (${areaTodos} tasks remaining)\n`;
    });
    
    analysisContent += "\n**Recommendations:**\n";
    if (priorityTodos > 0) {
      analysisContent += "• Focus on high-priority (P1) tasks first\n";
    }
    if (avgProgress < 30) {
      analysisContent += "• Consider uploading more business documents for better analysis\n";
    }
    if (avgProgress > 70) {
      analysisContent += "• Great progress! You're well on your way to B Corp readiness\n";
    }
    
    const analysisMessage: ChatMessage = {
      id: `analysis-${Date.now()}`,
      content: analysisContent,
      role: 'assistant',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, analysisMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <Card className={`${className} cursor-pointer hover:shadow-lg transition-shadow duration-300`} onClick={() => setIsExpanded(true)}>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Broad Chat Function</h3>
          <p className="text-muted-foreground text-sm">
            Get comprehensive business analysis and B Corp guidance
          </p>
          <Button variant="outline" className="mt-4">
            Start Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} flex flex-col max-w-full overflow-hidden`} style={{ minHeight: '500px', maxHeight: '600px' }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Business Analysis Chat</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBirdsEyeAnalysis}
            className="text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Bird's Eye Analysis
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(false)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 min-h-0" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start a conversation to get comprehensive business analysis</p>
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
        
        <div className="flex gap-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your B Corp journey..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}