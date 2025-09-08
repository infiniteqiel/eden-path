/**
 * Completed Tasks Modal Component
 * 
 * Shows completed todos with rationale and document references.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileText } from 'lucide-react';
import { Todo, ImpactArea } from '@/domain/data-contracts';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: Todo[];
  impactArea?: ImpactArea;
}

export function CompletedTasksModal({ 
  isOpen, 
  onClose, 
  completedTasks, 
  impactArea 
}: CompletedTasksModalProps) {
  const filteredTasks = impactArea 
    ? completedTasks.filter(task => task.impact === impactArea)
    : completedTasks;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Completed Tasks
            {impactArea && (
              <Badge variant="secondary">{impactArea}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed tasks yet.</p>
              <p className="text-sm">Complete some tasks to see them here!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="border border-success/20 bg-success/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline" className="text-xs">
                          {task.impact}
                        </Badge>
                        <Badge 
                          variant={task.priority === 'P1' ? 'destructive' : task.priority === 'P2' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.effort} effort
                        </Badge>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  </div>

                  {task.descriptionMd && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">Rationale:</h5>
                      <p className="text-sm text-foreground bg-background/50 p-2 rounded border">
                        {task.descriptionMd}
                      </p>
                    </div>
                  )}

                  {task.evidenceChunkIds && task.evidenceChunkIds.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Document References:
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {task.evidenceChunkIds.map((chunkId, index) => (
                          <Badge key={chunkId} variant="outline" className="text-xs">
                            Document {index + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}