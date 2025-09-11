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
  todo: Todo;
  onToggleStatus: (status: Todo['status']) => void;
}

export function ExpandableTaskModal({ 
  isOpen, 
  onClose, 
  todo,
  onToggleStatus 
}: ExpandableTaskModalProps) {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

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
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Task Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TodoItem
                      todo={todo}
                      onToggleStatus={onToggleStatus}
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
                    <ScrollArea className="h-40">
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
                    <Button 
                      onClick={() => setShowEvidenceModal(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Upload Evidence
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* AI Chat Sidebar */}
              {showAIChat && (
                <div className="lg:col-span-1 border-l pl-6">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="w-4 h-4" />
                        AI Task Assistant
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-3">
                      <div className="h-full flex flex-col">
                        <ScrollArea className="flex-1 mb-4">
                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-900 font-medium">
                                AI Assistant Ready
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                I can help you understand this task, provide step-by-step guidance, and suggest best practices based on your business context.
                              </p>
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground">
                                Framework ready for Deepseek NLP integration with access to:
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
                        
                        <div className="border-t pt-3">
                          <p className="text-xs text-muted-foreground text-center">
                            Chat interface ready for NLP integration
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
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