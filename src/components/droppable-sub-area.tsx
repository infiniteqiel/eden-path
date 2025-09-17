/**
 * Droppable Sub-Area Component with Drag & Drop functionality
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DraggableTask } from '@/components/draggable-task';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { GrowTaskButton } from '@/components/grow-task-button';
import { Todo } from '@/domain/data-contracts';
import { ImpactSubArea } from '@/services/adapters/supabase/sub-areas';
import { LucideIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DroppableSubAreaProps {
  subArea: ImpactSubArea;
  tasks: Todo[];
  icon: LucideIcon;
  impactArea: string;
  onTaskToggle: (taskId: string, status: Todo['status']) => void;
  onTaskClick: (taskId: string) => void;
  onAIChatClick: (subArea: string) => void;
  onTaskGenerated: () => void;
  className?: string;
}

export function DroppableSubArea({
  subArea,
  tasks,
  icon: Icon,
  impactArea,
  onTaskToggle,
  onTaskClick,
  onAIChatClick,
  onTaskGenerated,
  className
}: DroppableSubAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: subArea.id,
    data: {
      type: 'subArea',
      subArea: subArea
    }
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <Card 
      ref={setNodeRef}
      className={cn(
        "bg-white/60 relative hover:shadow-lg transition-all duration-300",
        isOver && "ring-2 ring-primary ring-opacity-50 bg-primary/5",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {subArea.isUserCreated ? (
            <Plus className="h-5 w-5 text-green-600" />
          ) : (
            <Icon className="h-5 w-5 text-primary" />
          )}
          {subArea.title}
        </CardTitle>
        <CardDescription>{subArea.description}</CardDescription>
      </CardHeader>

      {/* AI Chat Icon for Sub-Area - Top Right */}
      <div className="absolute top-4 right-4">
        <AIChatIcon 
          onClick={() => onAIChatClick(subArea.title)}
          size="sm"
        />
      </div>

      <CardContent>
        <div className="space-y-3 min-h-[100px]">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  onToggleStatus={onTaskToggle}
                  onClick={() => onTaskClick(task.id)}
                />
              ))
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {isOver ? 'Drop tasks here' : 'No specific tasks for this area yet'}
                </p>
                <GrowTaskButton
                  subArea={subArea.title}
                  impactArea={impactArea}
                  onTaskGenerated={onTaskGenerated}
                />
              </div>
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}