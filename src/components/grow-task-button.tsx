/**
 * Grow Task Button Component
 * 
 * Button for generating AI tasks for sub-areas with no existing tasks
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GrowTaskButtonProps {
  subArea: string;
  impactArea: string;
  onTaskGenerated: () => void;
  className?: string;
}

export function GrowTaskButton({ 
  subArea, 
  impactArea, 
  onTaskGenerated, 
  className 
}: GrowTaskButtonProps) {
  const [isGrowing, setIsGrowing] = useState(false);

  const handleGrowTask = async () => {
    setIsGrowing(true);
    
    // Simulate AI task generation
    setTimeout(async () => {
      // TODO: Replace with actual AI task generation
      console.log(`Generating task for ${subArea} in ${impactArea}`);
      
      // Simulate task creation and update
      onTaskGenerated();
      setIsGrowing(false);
    }, 3000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGrowTask}
      disabled={isGrowing}
      className={cn(
        "w-full border-dashed border-2 border-primary/30 hover:border-primary/60",
        "hover:bg-primary/5 transition-all duration-200",
        className
      )}
    >
      {isGrowing ? (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
          <span className="text-sm">Growing a task for this impact area</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-sm">Grow a Task</span>
        </div>
      )}
    </Button>
  );
}