/**
 * Impact File Mini Card Component
 * 
 * Mini card showing files mapped to an impact area with clickable files
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataFile, ImpactArea, Todo } from '@/domain/data-contracts';
import { useDataroomStore } from '@/store/dataroom';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { taskFileMappingService } from '@/services/registry';
import { toast } from 'sonner';

interface ImpactFileMiniCardProps {
  impactArea: ImpactArea;
  onFileClick?: (file: DataFile, task?: Todo) => void;
  className?: string;
}

export function ImpactFileMiniCard({ 
  impactArea, 
  onFileClick,
  className 
}: ImpactFileMiniCardProps) {
  const { currentBusiness } = useBusinessStore();
  const { files, loadFiles } = useDataroomStore();
  const { todos, loadTodos } = useAnalysisStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentBusiness) {
      loadFilesAndTodos();
    }
  }, [currentBusiness, impactArea]);

  const loadFilesAndTodos = async () => {
    if (!currentBusiness) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadFiles(currentBusiness.id),
        loadTodos(currentBusiness.id)
      ]);
    } catch (error) {
      console.error('Failed to load files and todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = async (file: DataFile) => {
    if (!onFileClick) return;
    
    try {
      const taskIds = await taskFileMappingService.getFileTasks(file.id);
      let mappedTask: Todo | undefined;
      
      if (taskIds.length > 0) {
        mappedTask = todos.find(t => t.id === taskIds[0]);
      }
      
      onFileClick(file, mappedTask);
    } catch (error) {
      console.error('Failed to get file task mapping:', error);
      toast.error('Failed to open file');
    }
  };

  const getFileMappingLabel = (file: DataFile) => {
    if (file.impactArea && file.impactArea !== 'Other') {
      return (
        <Badge variant="outline" className="text-xs">
          Mapped
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
          Unmapped
        </Badge>
      );
    }
  };

  // Filter files for this impact area
  const impactFiles = files.filter(file => file.impactArea === impactArea);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-xs text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Files</span>
          <Badge variant="secondary" className="text-xs">
            {impactFiles.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {impactFiles.length > 0 ? (
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-2">
              {impactFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 p-2 rounded border bg-white/40 cursor-pointer hover:bg-white/60 transition-colors"
                  onClick={() => handleFileClick(file)}
                  title="Click to open mapped task"
                >
                  <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate">{file.originalName}</div>
                    <div className="mt-1">
                      {getFileMappingLabel(file)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No files in {impactArea}
          </div>
        )}
      </CardContent>
    </Card>
  );
}