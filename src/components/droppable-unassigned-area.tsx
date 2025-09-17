/**
 * Droppable Unassigned Area Component
 * 
 * Container for unassigned tasks that supports dropping tasks to unassign them
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableTask } from '@/components/draggable-task';
import { Todo } from '@/domain/data-contracts';
import { CheckSquare2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DroppableUnassignedAreaProps {
  tasks: Todo[];
  impactArea: string;
  onTaskToggle: (taskId: string, status: Todo['status']) => void;
  onTaskClick: (taskId: string) => void;
  className?: string;
}

export function DroppableUnassignedArea({
  tasks,
  impactArea,
  onTaskToggle,
  onTaskClick,
  className
}: DroppableUnassignedAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'unassigned-area',
    data: {
      type: 'unassigned'
    }
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "bg-white/60 backdrop-blur-sm rounded-xl p-6 transition-all duration-300",
        isOver && "ring-2 ring-primary ring-opacity-50 bg-primary/5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">All {impactArea} Tasks</h3>
        <p className="text-sm text-muted-foreground">
          {isOver ? 'Drop here to unassign' : 'Drag & Drop tasks to organize them into areas above'}
        </p>
      </div>
      
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(todo => (
              <DraggableTask
                key={todo.id}
                task={todo}
                onToggleStatus={onTaskToggle}
                onClick={() => onTaskClick(todo.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <CheckSquare2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No unassigned {impactArea.toLowerCase()} tasks</p>
            <p className="text-sm text-muted-foreground mt-2">
              All tasks have been organized or generate new ones through document analysis
            </p>
          </div>
        )}
      </SortableContext>
    </div>
  );
}