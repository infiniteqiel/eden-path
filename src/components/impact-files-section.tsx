/**
 * Impact Files Section Component
 * 
 * Displays files mapped to a specific impact area in a scrollable container.
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { ImpactArea, DataFile } from '@/domain/data-contracts';
import { useDataroomStore } from '@/store/dataroom';
import { useBusinessStore } from '@/store/business';

interface ImpactFilesSectionProps {
  impactArea: ImpactArea;
  className?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file: DataFile) => {
  if (file.contentType?.includes('pdf')) return '📄';
  if (file.contentType?.includes('word') || file.contentType?.includes('document')) return '📝';
  if (file.contentType?.includes('text')) return '📋';
  if (file.contentType?.includes('image')) return '🖼️';
  return '📎';
};

export function ImpactFilesSection({ impactArea, className }: ImpactFilesSectionProps) {
  const { files, loadFiles } = useDataroomStore();
  const { currentBusiness } = useBusinessStore();

  useEffect(() => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
    }
  }, [currentBusiness, loadFiles]);

  const impactFiles = files.filter(file => file.impactArea === impactArea);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          {impactArea} Documents ({impactFiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {impactFiles.length > 0 ? (
          <ScrollArea className="h-[200px] w-full rounded-md border p-3">
            <div className="space-y-3">
              {impactFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="text-lg flex-shrink-0" role="img">
                      {getFileIcon(file)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm">
                        {file.originalName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {file.kind.replace(/_/g, ' ')}
                        </Badge>
                        {file.size && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant={file.ocrStatus === 'done' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {file.ocrStatus}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents uploaded for {impactArea} yet</p>
            <p className="text-xs mt-1">
              Upload documents in the Documents tab to see them here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}