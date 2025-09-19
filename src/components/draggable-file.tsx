/**
 * Draggable File Component
 * 
 * File component that can be dragged and dropped into categories
 */

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FileCard } from '@/components/file-card';
import { DataFile } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';

interface DraggableFileProps {
  file: DataFile;
  onDelete: (fileId: string) => void;
  className?: string;
}

export function DraggableFile({ file, onDelete, className }: DraggableFileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: file.id,
    data: {
      type: 'file',
      file,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'cursor-move transition-opacity',
        isDragging && 'opacity-50',
        className
      )}
    >
      <FileCard 
        file={file} 
        onDelete={() => onDelete(file.id)}
        className={cn(
          'bg-white/60 hover:bg-white/80 transition-colors',
          isDragging && 'shadow-lg'
        )}
      />
    </div>
  );
}