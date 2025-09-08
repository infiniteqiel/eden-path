/**
 * Evidence Upload Modal
 * 
 * Small modal for uploading evidence files for specific todos
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/upload-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, X } from 'lucide-react';
import { Todo, ImpactArea } from '@/domain/data-contracts';
import { useDataroomStore } from '@/store/dataroom';
import { useBusinessStore } from '@/store/business';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
}

export function EvidenceUploadModal({ isOpen, onClose, todo }: EvidenceUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { currentBusiness } = useBusinessStore();
  const { uploadFile } = useDataroomStore();

  const handleFilesAdd = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!currentBusiness) return;

    for (const file of uploadedFiles) {
      await uploadFile(currentBusiness.id, file, todo.impact);
    }
    
    setUploadedFiles([]);
    onClose();
  };

  const impactAreaColors: Record<ImpactArea, string> = {
    'Governance': 'bg-blue-50 text-blue-700 border-blue-200',
    'Workers': 'bg-green-50 text-green-700 border-green-200', 
    'Community': 'bg-purple-50 text-purple-700 border-purple-200',
    'Environment': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Customers': 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Upload Evidence
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${impactAreaColors[todo.impact]}`}>
              {todo.impact}
            </span>
          </DialogTitle>
          <DialogDescription>
            Upload files as evidence for: <strong>{todo.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <UploadDropzone 
              onFilesAdd={handleFilesAdd}
              className="min-h-[120px]"
            />
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Files to Upload:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploadedFiles.length === 0}
            >
              Upload Evidence ({uploadedFiles.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}