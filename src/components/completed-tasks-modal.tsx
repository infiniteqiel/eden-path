/**
 * Completed Tasks Modal Component
 * 
 * Shows completed todos with rationale and document references.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle } from 'lucide-react';
import { Todo, ImpactArea } from '@/domain/data-contracts';
import { TodoItem } from '@/components/todo-item';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: Todo[];
  impactArea?: ImpactArea;
  onTaskClick?: (task: Todo) => void;
}

export function CompletedTasksModal({ 
  isOpen, 
  onClose, 
  completedTasks, 
  impactArea,
  onTaskClick 
}: CompletedTasksModalProps) {
  const filteredTasks = impactArea 
    ? completedTasks.filter(task => task.impact === impactArea)
    : completedTasks;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            All Tasks
            {impactArea && (
              <Badge variant="secondary">{impactArea}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks available yet.</p>
                <p className="text-sm">Tasks will appear here after document analysis!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  onClick={() => onTaskClick?.(task)}
                >
                  <TodoItem
                    todo={task}
                    onToggleStatus={() => {}} // Disabled in modal view
                    showImpact={!impactArea} // Only show impact if not filtering by specific area
                    disabled={true} // Make read-only in modal
                    className="pointer-events-none" // Prevent TodoItem click events
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}