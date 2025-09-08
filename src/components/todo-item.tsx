/**
 * Todo Item Component
 * 
 * Individual todo item with status, priority, and evidence linking.
 */

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Clock, AlertCircle, Upload } from 'lucide-react';
import { Todo, TodoStatus } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggleStatus: (status: TodoStatus) => void;
  onViewEvidence?: () => void;
  onUploadEvidence?: () => void;
  showImpact?: boolean;
  className?: string;
}

const statusColors = {
  todo: 'text-muted-foreground',
  in_progress: 'text-blue-600',
  blocked: 'text-red-600',
  done: 'text-green-600'
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress', 
  blocked: 'Blocked',
  done: 'Done'
};

const priorityVariants = {
  P1: 'priority-p1',
  P2: 'priority-p2', 
  P3: 'priority-p3'
};

const effortVariants = {
  Low: 'effort-low',
  Medium: 'effort-medium',
  High: 'effort-high'
};

export function TodoItem({ 
  todo, 
  onToggleStatus, 
  onViewEvidence,
  onUploadEvidence,
  showImpact = false,
  className 
}: TodoItemProps) {
  const isCompleted = todo.status === 'done';
  const isBlocked = todo.status === 'blocked';
  const hasEvidence = todo.evidenceChunkIds && todo.evidenceChunkIds.length > 0;

  const handleStatusToggle = () => {
    if (isCompleted) {
      onToggleStatus('todo');
    } else if (todo.status === 'todo') {
      onToggleStatus('in_progress');
    } else if (todo.status === 'in_progress') {
      onToggleStatus('done');
    }
  };

  return (
    <div 
      className={cn("todo-item cursor-pointer", className)}
      onClick={onUploadEvidence}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleStatusToggle}
          disabled={isBlocked}
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className={cn(
                "font-medium text-sm leading-tight",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </h4>
              
              {showImpact && (
                <p className="text-xs text-muted-foreground mt-1">
                  {todo.impact}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-1 ml-2">
              {/* Status indicator */}
              <div className={cn(
                "flex items-center space-x-1 text-xs",
                statusColors[todo.status]
              )}>
                {isBlocked && <AlertCircle className="h-3 w-3" />}
                {todo.status === 'in_progress' && <Clock className="h-3 w-3" />}
                <span>{statusLabels[todo.status]}</span>
              </div>
            </div>
          </div>

          {todo.descriptionMd && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {todo.descriptionMd}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs px-1.5 py-0.5", priorityVariants[todo.priority])}
              >
                {todo.priority}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={cn("text-xs px-1.5 py-0.5", effortVariants[todo.effort])}
              >
                {todo.effort}
              </Badge>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadEvidence?.();
                }}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <Upload className="h-3 w-3 mr-1" />
                <span className="text-xs">Evidence</span>
              </Button>
              
              {hasEvidence && onViewEvidence && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewEvidence();
                  }}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="text-xs">View</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}