/**
 * Enhanced File List Component for Evidence Upload Modal
 * 
 * Features:
 * - Green ticks for mapped files instead of checkboxes
 * - Hover tooltips showing which tasks files are mapped to
 * - Unmapping workflow by clicking green ticks
 * - Blocking files already mapped to other tasks
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Check, Lock } from 'lucide-react';
import { DataFile } from '@/domain/data-contracts';
import { taskFileMappingService } from '@/services/registry';
import { cn } from '@/lib/utils';

interface EnhancedFileListProps {
  files: DataFile[];
  currentTaskId: string;
  currentTaskTitle: string;
  className?: string;
  maxHeight?: string;
  selectedFiles: string[];
  onFileSelect: (fileId: string, selected: boolean) => void;
  onFileUnmap: (fileId: string) => void;
  emptyMessage?: string;
}

interface FileMapping {
  fileId: string;
  taskIds: string[];
  taskTitles: Record<string, string>;
}

export function EnhancedFileList({
  files,
  currentTaskId,
  currentTaskTitle,
  className,
  maxHeight = "400px",
  selectedFiles,
  onFileSelect,
  onFileUnmap,
  emptyMessage = "No files found"
}: EnhancedFileListProps) {
  const [fileMappings, setFileMappings] = useState<Record<string, FileMapping>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFileMappings();
  }, [files]);

  const loadFileMappings = async () => {
    setIsLoading(true);
    try {
      const mappings: Record<string, FileMapping> = {};
      
      // Get mappings for each file
      for (const file of files) {
        const taskIds = await taskFileMappingService.getFileTasks(file.id);
        
        // For now, we'll just use the task IDs as titles
        // In a real implementation, you'd fetch task details
        const taskTitles: Record<string, string> = {};
        taskIds.forEach(taskId => {
          if (taskId === currentTaskId) {
            taskTitles[taskId] = currentTaskTitle;
          } else {
            taskTitles[taskId] = `Task ${taskId.substring(0, 8)}...`;
          }
        });
        
        mappings[file.id] = {
          fileId: file.id,
          taskIds,
          taskTitles
        };
      }
      
      setFileMappings(mappings);
    } catch (error) {
      console.error('Failed to load file mappings:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const isFileMappedToCurrentTask = (fileId: string) => {
    return fileMappings[fileId]?.taskIds.includes(currentTaskId) || false;
  };

  const isFileMappedToOtherTasks = (fileId: string) => {
    const mapping = fileMappings[fileId];
    if (!mapping) return false;
    return mapping.taskIds.some(taskId => taskId !== currentTaskId);
  };

  const getTooltipContent = (fileId: string) => {
    const mapping = fileMappings[fileId];
    if (!mapping || mapping.taskIds.length === 0) {
      return "Click to map to this task";
    }

    const mappedToCurrentTask = mapping.taskIds.includes(currentTaskId);
    const otherTasks = mapping.taskIds.filter(taskId => taskId !== currentTaskId);

    if (mappedToCurrentTask && otherTasks.length === 0) {
      return "Mapped to this task. Click to unmap.";
    }

    if (mappedToCurrentTask && otherTasks.length > 0) {
      return `Mapped to this task and ${otherTasks.length} other task${otherTasks.length > 1 ? 's' : ''}. Click to unmap from this task.`;
    }

    if (otherTasks.length > 0) {
      return `Already mapped to ${otherTasks.length} other task${otherTasks.length > 1 ? 's' : ''}. Cannot map to multiple tasks.`;
    }

    return "Click to map to this task";
  };

  const sortedFiles = [...files].sort((a, b) => {
    // Files mapped to current task first
    const aMappedToCurrent = isFileMappedToCurrentTask(a.id);
    const bMappedToCurrent = isFileMappedToCurrentTask(b.id);
    
    if (aMappedToCurrent && !bMappedToCurrent) return -1;
    if (!aMappedToCurrent && bMappedToCurrent) return 1;
    
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
    <TooltipProvider>
      <Card className={className}>
        <CardContent className="p-0">
          <ScrollArea style={{ height: maxHeight }}>
            <div className="p-4 space-y-2">
              {sortedFiles.map((file) => {
                const isSelected = selectedFiles.includes(file.id);
                const isMappedToCurrent = isFileMappedToCurrentTask(file.id);
                const isMappedToOthers = isFileMappedToOtherTasks(file.id);
                const isBlocked = isMappedToOthers && !isMappedToCurrent;
                
                return (
                  <Tooltip key={file.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                          isMappedToCurrent && "bg-green-50 border-green-200",
                          isSelected && !isMappedToCurrent && "bg-blue-50 border-blue-200",
                          isBlocked && "bg-gray-50 border-gray-200 opacity-60",
                          !isMappedToCurrent && !isSelected && !isBlocked && "hover:bg-muted/30",
                          (isMappedToCurrent || !isBlocked) && "cursor-pointer"
                        )}
                        onClick={() => {
                          if (isBlocked) return;
                          
                          if (isMappedToCurrent) {
                            onFileUnmap(file.id);
                          } else {
                            onFileSelect(file.id, !isSelected);
                          }
                        }}
                      >
                        {/* Selection/Status Indicator */}
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                          {isMappedToCurrent ? (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : isBlocked ? (
                            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                              <Lock className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => onFileSelect(file.id, !!checked)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={isBlocked}
                            />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">
                            {getFileIcon(file)}
                          </span>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className={cn(
                                "text-sm font-medium truncate",
                                isBlocked && "text-gray-500"
                              )}>
                                {file.originalName}
                              </p>
                              {isMappedToCurrent && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Mapped
                                </Badge>
                              )}
                              {isBlocked && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                  In Use
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getFileExtension(file.originalName)}
                              </Badge>
                              <span className={cn(
                                "text-xs",
                                isBlocked ? "text-gray-400" : "text-muted-foreground"
                              )}>
                                {formatFileSize(file.size)}
                              </span>
                              <span className={cn(
                                "text-xs",
                                isBlocked ? "text-gray-400" : "text-muted-foreground"
                              )}>
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{getTooltipContent(file.id)}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}