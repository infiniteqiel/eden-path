/**
 * AI Chat Icon Component
 * 
 * Minimized circle with chat icon that expands on hover
 * Used throughout the app for contextual AI assistance
 */

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIChatIconProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AIChatIcon({ onClick, className, size = 'md' }: AIChatIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <div className={cn("group relative", className)}>
      {/* Minimized Circle */}
      <Button
        onClick={onClick}
        size="icon"
        variant="outline"
        className={cn(
          "rounded-full border-primary/20 bg-background/80 backdrop-blur-sm",
          "hover:bg-primary hover:text-primary-foreground hover:border-primary",
          "transition-all duration-300 ease-out",
          "group-hover:scale-110",
          sizeClasses[size]
        )}
      >
        <MessageCircle size={iconSizes[size]} />
      </Button>

      {/* Expanded Text on Hover */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all duration-300 ease-out pointer-events-none">
        <div className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-md whitespace-nowrap shadow-lg">
          AI Analysis Chat
        </div>
      </div>
    </div>
  );
}