/**
 * Draggable Task Component for Drag & Drop functionality
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem } from '@/components/todo-item';
import { Todo } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';

interface DraggableTaskProps {
  task: Todo;
  onToggleStatus: (taskId: string, status: Todo['status']) => void;
  onClick: () => void;
}

export function DraggableTask({ task, onToggleStatus, onClick }: DraggableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task: task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white/80 rounded p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200",
        isDragging && "opacity-30 scale-105 shadow-xl border-2 border-primary/50"
      )}
      onClick={!isDragging ? onClick : undefined}
      {...attributes}
      {...listeners}
    >
      <TodoItem
        todo={task}
        onToggleStatus={(status) => onToggleStatus(task.id, status)}
      />
    </div>
  );
}