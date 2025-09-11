/**
 * Expandable Task Modal
 * 
 * Full screen task view with AI Chat integration
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TodoItem } from '@/components/todo-item';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { EvidenceUploadModal } from '@/components/evidence-upload-modal';
import { Todo } from '@/domain/data-contracts';
import { X, Upload, MessageSquare, FileText } from 'lucide-react';

interface ExpandableTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  onToggleStatus?: (status: Todo['status']) => void;
}

export function ExpandableTaskModal({ 
  isOpen, 
  onClose, 
  todo,
  onToggleStatus 
}: ExpandableTaskModalProps) {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  if (!todo) return null;

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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[85vh] flex flex-col bg-white">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold mb-2">
                  {todo.title}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[todo.priority]}>
                    {todo.priority}
                  </Badge>
                  <Badge className={statusColors[todo.status]}>
                    {todo.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {todo.impact}
                  </Badge>
                </div>
              </div>
              <AIChatIcon 
                onClick={() => setShowAIChat(!showAIChat)}
                size="md"
                className="ml-4"
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-full flex transition-all duration-300 ease-in-out">
              {/* Task Details Container */}
              <div 
                className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                  showAIChat 
                    ? 'hidden md:block md:w-80 md:opacity-75' 
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
                            todo={todo}
                            onToggleStatus={onToggleStatus ? onToggleStatus : () => {}}
                            onUploadEvidence={() => setShowEvidenceModal(true)}
                            showImpact
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Description & Guidance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-32">
                            <p className="text-sm text-muted-foreground">
                              {todo.descriptionMd || 'Detailed guidance and steps for completing this task will be provided by the AI assistant. Click the AI Chat icon to get personalized recommendations based on your business context and uploaded documents.'}
                            </p>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Evidence & Documentation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Button 
                              onClick={() => setShowEvidenceModal(true)}
                              variant="outline"
                              className="w-full"
                            >
                              Upload Evidence
                            </Button>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>• Upload supporting documents</p>
                              <p>• Add photos or screenshots</p>
                              <p>• Attach policy documents</p>
                              <p>• Include certifications</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* AI Chat Container */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  showAIChat 
                    ? 'flex-1 opacity-100 border-l-0 md:border-l border-gray-200 md:ml-4' 
                    : 'w-0 opacity-0 overflow-hidden'
                }`}
                data-container="ai-chat"
              >
                {showAIChat && (
                  <Card className="h-full bg-white">
                    <CardHeader className="pb-3 bg-white border-b border-gray-100">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="w-4 h-4" />
                        AI Task Assistant
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowAIChat(false)}
                          className="ml-auto hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 bg-white">
                      <div className="h-[calc(100vh-280px)] flex flex-col">
                        <ScrollArea className="flex-1 p-4 bg-gray-50 mx-3 mt-3 mb-3 rounded-lg">
                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-900 font-medium">
                                AI Assistant Ready
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                I can help you understand this task: "{todo.title}", provide step-by-step guidance, and suggest best practices based on your business context.
                              </p>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-xs text-muted-foreground">
                                Framework ready for NLP integration with access to:
                              </p>
                              <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
                                <li>Your uploaded documents</li>
                                <li>B Corp knowledge base</li>
                                <li>Task-specific guidance</li>
                                <li>Business context & progress</li>
                              </ul>
                            </div>
                          </div>
                        </ScrollArea>
                        
                        <div className="border-t pt-3 px-4 pb-4 bg-white">
                          <p className="text-xs text-muted-foreground text-center">
                            Chat interface ready for NLP integration
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Evidence Upload Modal */}
      <EvidenceUploadModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        todo={todo}
      />
    </>
  );
}