/**
 * Optimized Expandable Task Modal
 * 
 * Full screen task view with unified AI Chat integration and improved mobile UX
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TodoItem } from '@/components/todo-item';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { EvidenceUploadModal } from '@/components/evidence-upload-modal';
import { TaskChatPanel } from '@/components/task-chat-panel';
import { FileList } from '@/components/file-list';
import { ImpactAreaSelector } from '@/components/impact-area-selector';
import { Todo, DataFile, ImpactArea } from '@/domain/data-contracts';
import { X, Upload, MessageSquare, FileText, Link } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDataroomStore } from '@/store/dataroom';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { taskFileMappingService } from '@/services/registry';

interface ExpandableTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  onToggleStatus?: (status: Todo['status']) => void;
  onDelete?: () => void;
}

export function OptimizedExpandableTaskModal({ 
  isOpen, 
  onClose, 
  todo,
  onToggleStatus,
  onDelete 
}: ExpandableTaskModalProps) {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [mappedFiles, setMappedFiles] = useState<DataFile[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(todo);
  const isMobile = useIsMobile();
  const { files, loadFiles } = useDataroomStore();
  const { currentBusiness } = useBusinessStore();
  const { deleteTask, updateTaskImpactArea, updateTaskLockState } = useAnalysisStore();

  // Load mapped files and sync todo state when todo changes
  useEffect(() => {
    if (todo && currentBusiness) {
      setCurrentTodo(todo);
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
    if (!currentTodo) return;
    
    try {
      // Update the local state immediately
      setCurrentTodo(prev => prev ? { ...prev, impact: newImpact } : null);
      
      await updateTaskImpactArea(currentTodo.id, newImpact);
      
      // Reload mapped files since impact area changed
      loadMappedFiles();
      if (currentBusiness) {
        loadFiles(currentBusiness.id);
      }
    } catch (error) {
      // Revert local state on error
      setCurrentTodo(todo);
      console.error('Failed to update task impact area:', error);
    }
  };

  const handleToggleLock = async () => {
    if (!currentTodo) return;
    
    const newLockState = !currentTodo.isImpactLocked;
    
    try {
      // Update the local state immediately
      setCurrentTodo(prev => prev ? { ...prev, isImpactLocked: newLockState } : null);
      
      await updateTaskLockState(currentTodo.id, newLockState);
    } catch (error) {
      // Revert local state on error
      setCurrentTodo(todo);
      console.error('Failed to update task lock state:', error);
    }
  };

  if (!currentTodo) return null;

  const priorityColors = {
    P1: 'bg-red-100 text-red-800 border-red-200',
    P2: 'bg-orange-100 text-orange-800 border-orange-200', 
    P3: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 border-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    blocked: 'bg-red-100 text-red-800 border-red-200',
    done: 'bg-green-100 text-green-800 border-green-200',
  };

  const initialMessage = `Hi! I'm here to help you with "${currentTodo?.title || 'this task'}". I can provide step-by-step guidance, explain B Corp requirements, and suggest best practices. What specific aspect would you like help with?`;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[85vh] flex flex-col bg-white">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-lg md:text-xl font-bold mb-2">
                  {currentTodo.title}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={priorityColors[currentTodo.priority]}>
                    {currentTodo.priority}
                  </Badge>
                  <Badge className={statusColors[currentTodo.status]}>
                    {currentTodo.status.replace('_', ' ')}
                  </Badge>
                  <ImpactAreaSelector 
                    currentImpact={currentTodo.impact} 
                    taskId={currentTodo.id}
                    onImpactChange={handleImpactChange}
                    isLocked={currentTodo.isImpactLocked || false}
                    onToggleLock={handleToggleLock}
                  />
                </div>
              </div>
              <AIChatIcon 
                onClick={() => setShowAIChat(!showAIChat)}
                size="md"
                className="ml-4 flex-shrink-0"
              />
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
                            todo={currentTodo}
                            onToggleStatus={onToggleStatus}
                            onUploadEvidence={() => setShowEvidenceModal(true)}
                            showImpact={false}
                          />
                          
                          <div className="mt-6 space-y-3">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {currentTodo.descriptionMd || "No description available"}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Priority & Status</h4>
                              <p className="text-sm text-muted-foreground">
                                Priority: {currentTodo.priority} | Status: {currentTodo.status.replace('_', ' ')}
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
                                        <FileText className="h-4 w-4 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">
                                            {file.originalName}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {file.contentType || 'Unknown type'}
                                          </p>
                                        </div>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No files mapped to this task yet.
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button 
                            onClick={() => setShowEvidenceModal(true)}
                            variant="outline"
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Evidence
                          </Button>
                          
                          <Button 
                            onClick={() => setShowEvidenceModal(true)}
                            variant="outline"
                            className="w-full"
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Manage Task Files
                          </Button>
                          
                          <Button 
                            onClick={() => setShowAIChat(true)}
                            variant="outline"
                            className="w-full"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Get AI Assistance
                          </Button>
                          
                          <Button 
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this task? It will be moved to the bin and can be restored later.')) {
                                await deleteTask(currentTodo.id);
                                onDelete?.();
                                onClose();
                              }
                            }}
                            variant="destructive"
                            className="w-full"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Delete Task
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Related Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start">
                              <FileText className="h-4 w-4 mr-2" />
                              B Corp Guidelines - {currentTodo.impact}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                              <FileText className="h-4 w-4 mr-2" />
                              Implementation Template
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                              <FileText className="h-4 w-4 mr-2" />
                              Best Practices Guide
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* AI Chat Container */}
              {showAIChat && (
                <div 
                  className="flex-1 border-l border-gray-200 pl-4 transition-all duration-300 ease-in-out"
                  data-container="ai-chat"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <h3 className="font-semibold">AI Task Assistant</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIChat(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 min-h-0">
                      <TaskChatPanel 
                        taskId={currentTodo.id}
                        taskTitle={currentTodo.title}
                        impactArea={currentTodo.impact}
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
          onClose={() => {
            setShowEvidenceModal(false);
            // Refresh mapped files when modal closes
            loadMappedFiles();
          }}
          todo={currentTodo}
        />
      )}
    </>
  );
}