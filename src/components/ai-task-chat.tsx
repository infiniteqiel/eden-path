/**
 * AI Task Chat Component
 * 
 * Chat interface specifically for task assistance using unified chat behavior
 */

import { ChatInterface } from '@/components/common/chat-interface';
import { Todo } from '@/domain/data-contracts';

interface AITaskChatProps {
  todo: Todo;
  className?: string;
}

export function AITaskChat({ todo, className }: AITaskChatProps) {
  const initialMessage = `Hi! I'm here to help you with "${todo.title}". I can provide step-by-step guidance, explain B Corp requirements, and suggest best practices. What specific aspect would you like help with?`;

  return (
    <ChatInterface
      initialMessage={initialMessage}
      contextType="task"
      contextData={{
        taskTitle: todo.title,
        impactArea: todo.impact
      }}
      placeholder={`Ask about "${todo.title}"...`}
      className={className}
    />
  );
}