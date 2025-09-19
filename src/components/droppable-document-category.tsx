/**
 * Droppable Document Category Component
 * 
 * Document category that can accept dropped files
 */

import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentCategory, DataFile } from '@/domain/data-contracts';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DroppableDocumentCategoryProps {
  category: DocumentCategory;
  files: DataFile[];
  onEdit?: (category: DocumentCategory) => void;
  onDelete?: (categoryId: string) => void;
  className?: string;
}

export function DroppableDocumentCategory({ 
  category, 
  files, 
  onEdit, 
  onDelete,
  className 
}: DroppableDocumentCategoryProps) {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: category.id,
    data: {
      type: 'category',
      category,
    },
  });

  return (
    <Card 
      ref={setNodeRef}
      className={cn(
        'transition-all duration-200',
        isOver && 'ring-2 ring-primary ring-offset-2 bg-primary/5',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: category.color }}
            />
            <CardTitle className="text-base">{category.name}</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {files.length}
            </Badge>
          </div>
          
          {!category.isSystemCategory && (
            <div className="flex items-center gap-1 ml-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {category.description && (
          <CardDescription className="text-sm">
            {category.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        {isOver && (
          <div className="text-center py-4 text-sm text-primary font-medium">
            Drop file here to categorize
          </div>
        )}
        
        {files.length > 0 && !isOver && (
          <div className="space-y-2">
            {files.slice(0, 3).map((file) => (
              <div key={file.id} className="flex items-center gap-2 p-2 rounded border bg-white/40">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                <span className="text-xs truncate flex-1">{file.originalName}</span>
              </div>
            ))}
            {files.length > 3 && (
              <div className="text-xs text-muted-foreground text-center py-1">
                +{files.length - 3} more files
              </div>
            )}
          </div>
        )}
        
        {files.length === 0 && !isOver && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No files in this category
          </div>
        )}
      </CardContent>
    </Card>
  );
}