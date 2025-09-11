/**
 * AI Analysis Chat Modal
 * 
 * Modal for conducting AI analysis conversations using unified chat system
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';
import { ChatInterface } from '@/components/common/chat-interface';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactArea: ImpactArea;
  subArea?: string;
  taskTitle?: string;
  contextLevel?: 'overview' | 'subarea' | 'task';
}

export function AIChatModal({ 
  isOpen, 
  onClose, 
  impactArea, 
  subArea, 
  taskTitle, 
  contextLevel = 'overview' 
}: AIChatModalProps) {
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

  const contextType = contextLevel === 'task' ? 'task' : 
                     contextLevel === 'subarea' ? 'subarea' : 'impact-area';
  
  const placeholder = contextLevel === 'subarea' && subArea ? `Ask about ${subArea}...` :
                     contextLevel === 'task' && taskTitle ? `Ask about this task...` :
                     `Ask about ${impactArea} requirements...`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            {contextLevel === 'subarea' && subArea ? `AI Chat - ${subArea}` :
             contextLevel === 'task' && taskTitle ? `AI Chat - Task` :
             `AI Chat - ${impactArea}`}
            <Badge variant="outline" className="ml-auto">
              Beta
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          <ChatInterface
            initialMessage={getInitialMessage()}
            contextType={contextType}
            contextData={{
              impactArea: impactArea,
              subArea: subArea,
              taskTitle: taskTitle
            }}
            placeholder={placeholder}
            height="flex-1"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}