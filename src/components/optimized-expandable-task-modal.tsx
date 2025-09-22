/**
 * Optimized Expandable Task Modal
 * 
 * Full-screen modal for detailed task management with AI chat integration
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Upload, MessageSquare, Trash2, FileText } from 'lucide-react';
import { Todo, DataFile, ImpactArea } from '@/domain/data-contracts';
import { TodoItem } from '@/components/todo-item';
import { EvidenceUploadModal } from '@/components/evidence-upload-modal';
import { ChatInterface } from '@/components/common/chat-interface';
import { ImpactAreaSelector } from '@/components/impact-area-selector';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDataroomStore } from '@/store/dataroom';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { taskFileMappingService } from '@/services/registry';

interface ExpandableTaskModalProps {
  isOpen: boolean;
  todo: Todo;
  onClose: () => void;
  onToggleStatus: (status: Todo['status']) => void;
  onDelete?: () => void;
}

export function OptimizedExpandableTaskModal({ 
  isOpen, 
  todo, 
  onClose, 
  onToggleStatus, 
  onDelete 
}: ExpandableTaskModalProps) {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [mappedFiles, setMappedFiles] = useState<DataFile[]>([]);
  const [localTodo, setLocalTodo] = useState(todo);
  const isMobile = useIsMobile();
  const { files, loadFiles } = useDataroomStore();
  const { currentBusiness } = useBusinessStore();
  const { deleteTask, updateTaskImpactArea, loadTodos } = useAnalysisStore();

  // Load mapped files when todo changes and sync local state
  useEffect(() => {
    if (todo && currentBusiness) {
      setLocalTodo(todo);
      loadMappedFiles();
      loadFiles(currentBusiness.id);
    }
  }, [todo, currentBusiness]);

  const loadMappedFiles = async () => {
    if (!todo) return;
    
    try {
      const mappedFileIds = await taskFileMappingService.getTaskFiles(todo.id);
      const allFiles = files.length > 0 ? files : await (async () => {
        if (currentBusiness) {
          await loadFiles(currentBusiness.id);
          return files;
        }
        return [];
      })();
      
      const mapped = allFiles.filter(file => mappedFileIds.includes(file.id));
      setMappedFiles(mapped);
    } catch (error) {
      console.error('Failed to load mapped files:', error);
    }
  };

  const handleImpactChange = async (newImpact: ImpactArea) => {
    try {
      // Update local state immediately for instant UI feedback
      const updatedTodo = { ...localTodo, impact: newImpact };
      setLocalTodo(updatedTodo);
      
      // Update in database
      await updateTaskImpactArea(todo.id, newImpact, localTodo.isImpactLocked);
      
      // Reload files to update the impact area categorization
      loadMappedFiles();
      loadFiles(currentBusiness.id);
      
      // Refresh the analysis store to update other components
      await loadTodos(currentBusiness?.id || '');
    } catch (error) {
      console.error('Failed to update task impact area:', error);
      // Revert local state on error
      setLocalTodo(todo);
    }
  };

  const handleToggleLock = async () => {
    try {
      const newLockState = !localTodo.isImpactLocked;
      
      // Update local state immediately
      const updatedTodo = { ...localTodo, isImpactLocked: newLockState };
      setLocalTodo(updatedTodo);
      
      // Update in database
      await updateTaskImpactArea(todo.id, localTodo.impact, newLockState);
      
      // Refresh the analysis store
      await loadTodos(currentBusiness?.id || '');
    } catch (error) {
      console.error('Failed to toggle lock state:', error);
      // Revert local state on error
      setLocalTodo(todo);
    }
  };

  if (!todo) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <DialogTitle className="text-xl font-semibold leading-tight mb-2">
                  {localTodo.title}
                </DialogTitle>
                <ImpactAreaSelector
                  currentImpact={localTodo.impact}
                  taskId={localTodo.id}
                  onImpactChange={handleImpactChange}
                  isLocked={localTodo.isImpactLocked || false}
                  onToggleLock={handleToggleLock}
                />
              </div>
              <div className="flex items-center gap-2">
              <AIChatIcon 
                onClick={() => setShowAIChat(!showAIChat)}
                className="flex-shrink-0"
              />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-4 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-full flex transition-all duration-300 ease-in-out">
              {/* Task Details Container - Responsive behavior */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  showAIChat 
                    ? isMobile 
                      ? 'hidden' // Hide completely on mobile
                      : 'flex-shrink-0 w-80 opacity-75' // Minimize on desktop
                    : 'flex-1'
                }`}
                data-container="task-details"
              >
                <div className="h-full overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4 pb-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Task Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TodoItem
                            todo={localTodo}
                            onToggleStatus={onToggleStatus}
                            onUploadEvidence={() => setShowEvidenceModal(true)}
                            showImpact={false}
                          />
                          
                          <div className="mt-6 space-y-3">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {localTodo.descriptionMd || "No description available"}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Priority & Status</h4>
                              <p className="text-sm text-muted-foreground">
                                Priority: {localTodo.priority} | Status: {localTodo.status.replace('_', ' ')}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Mapped Files</h4>
                              {mappedFiles.length > 0 ? (
                                <div className="space-y-2">
                                  {mappedFiles.map((file) => (
                                    <Button
                                      key={file.id}
                                      variant="ghost"
                                      className="w-full justify-start h-auto p-2 text-left"
                                      onClick={() => {
                                        // Handle file click - could open file viewer
                                        console.log('File clicked:', file);
                                      }}
                                    >
                                      <div className="flex items-center space-x-2 w-full">
                                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">
                                            {file.originalName}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {file.contentType || 'Unknown type'}
                                          </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                          Mapped
                                        </Badge>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No files mapped to this task
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowEvidenceModal(true)}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Evidence
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowAIChat(true)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  AI Assistance
                                </Button>

                                {onDelete && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onDelete}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Task
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Related Resources</h4>
                              <p className="text-sm text-muted-foreground">
                                Additional resources and documentation for this task would appear here.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* AI Chat Container - Responsive behavior */}
              {showAIChat && (
                <div 
                  className={`transition-all duration-300 ease-in-out border-l ${
                    isMobile ? 'flex-1' : 'flex-1 max-w-md'
                  }`}
                  data-container="ai-chat"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">AI Assistant</h3>
                        {isMobile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAIChat(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get help with this specific task
                      </p>
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <ChatInterface
                        className="h-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Evidence Upload Modal */}
      {showEvidenceModal && (
        <EvidenceUploadModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
        />
      )}
    </>
  );
}