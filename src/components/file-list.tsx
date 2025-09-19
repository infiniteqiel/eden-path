/**
 * Reusable File List Component
 * 
 * Displays a list of files with optional selection capabilities
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { DataFile } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';

interface FileListProps {
  files: DataFile[];
  title?: string;
  className?: string;
  maxHeight?: string;
  selectable?: boolean;
  selectedFiles?: string[];
  onFileSelect?: (fileId: string, selected: boolean) => void;
  onFileClick?: (file: DataFile) => void;
  highlightedFiles?: string[];
  showFileActions?: boolean;
  emptyMessage?: string;
}

export function FileList({
  files,
  title,
  className,
  maxHeight = "300px",
  selectable = false,
  selectedFiles = [],
  onFileSelect,
  onFileClick,
  highlightedFiles = [],
  showFileActions = false,
  emptyMessage = "No files found"
}: FileListProps) {
  
  const getFileIcon = (file: DataFile) => {
    if (file.contentType?.includes('pdf')) return '📄';
    if (file.contentType?.includes('word')) return '📝';
    if (file.contentType?.includes('text')) return '📃';
    if (file.contentType?.includes('json')) return '🔧';
    return '📎';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() : 'FILE';
  };

  const sortedFiles = [...files].sort((a, b) => {
    // Highlighted files first
    const aHighlighted = highlightedFiles.includes(a.id);
    const bHighlighted = highlightedFiles.includes(b.id);
    
    if (aHighlighted && !bHighlighted) return -1;
    if (!aHighlighted && bHighlighted) return 1;
    
    // Then by upload date (newest first)
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  if (files.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {title && (
        <div className="p-4 border-b">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{files.length} file{files.length !== 1 ? 's' : ''}</p>
        </div>
      )}
      
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="p-4 space-y-2">
            {sortedFiles.map((file) => {
              const isSelected = selectedFiles.includes(file.id);
              const isHighlighted = highlightedFiles.includes(file.id);
              
              return (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                    isHighlighted && "bg-green-50 border-green-200",
                    isSelected && "bg-blue-50 border-blue-200",
                    !isHighlighted && !isSelected && "hover:bg-muted/30",
                    onFileClick && "cursor-pointer"
                  )}
                  onClick={() => onFileClick?.(file)}
                >
                  {selectable && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        onFileSelect?.(file.id, !!checked)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">
                      {getFileIcon(file)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">
                          {file.originalName}
                        </p>
                        {isHighlighted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Mapped
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getFileExtension(file.originalName)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {showFileActions && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle download
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileClick?.(file);
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}