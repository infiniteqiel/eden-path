/**
 * Evidence Upload Modal
 * 
 * Enhanced modal for uploading evidence files and mapping existing files to tasks
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/upload-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, X, Link } from 'lucide-react';
import { Todo, ImpactArea } from '@/domain/data-contracts';
import { useDataroomStore } from '@/store/dataroom';
import { useBusinessStore } from '@/store/business';
import { FileList } from '@/components/file-list';
import { taskFileMappingService } from '@/services/registry';
import { toast } from 'sonner';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
}

export function EvidenceUploadModal({ isOpen, onClose, todo }: EvidenceUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [mappedFiles, setMappedFiles] = useState<string[]>([]);
  const [isMapping, setIsMapping] = useState(false);
  const { currentBusiness } = useBusinessStore();
  const { uploadFile, files, loadFiles } = useDataroomStore();

  // Load files and mapped files when modal opens
  useEffect(() => {
    if (isOpen && currentBusiness) {
      loadFiles(currentBusiness.id);
      loadMappedFiles();
    }
  }, [isOpen, currentBusiness]);

  const loadMappedFiles = async () => {
    try {
      const mapped = await taskFileMappingService.getTaskFiles(todo.id);
      setMappedFiles(mapped);
    } catch (error) {
      console.error('Failed to load mapped files:', error);
    }
  };

  const handleFilesAdd = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!currentBusiness) return;

    try {
      for (const file of uploadedFiles) {
        await uploadFile(currentBusiness.id, file, "Other");
      }
      
      setUploadedFiles([]);
      toast.success('Files uploaded successfully');
      // Reload files to show new uploads
      await loadFiles(currentBusiness.id);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    }
  };

  const handleMapFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to map');
      return;
    }

    setIsMapping(true);
    try {
      await taskFileMappingService.mapFilesToTask(todo.id, selectedFiles);
      await loadMappedFiles();
      setSelectedFiles([]);
      toast.success(`${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} mapped to task`);
    } catch (error) {
      console.error('Failed to map files:', error);
      toast.error('Failed to map files to task');
    } finally {
      setIsMapping(false);
    }
  };

  const handleFileSelect = (fileId: string, selected: boolean) => {
    setSelectedFiles(prev => 
      selected 
        ? [...prev, fileId]
        : prev.filter(id => id !== fileId)
    );
  };

  const impactAreaColors: Record<ImpactArea, string> = {
    'Governance': 'bg-blue-50 text-blue-700 border-blue-200',
    'Workers': 'bg-green-50 text-green-700 border-green-200', 
    'Community': 'bg-purple-50 text-purple-700 border-purple-200',
    'Environment': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Customers': 'bg-orange-50 text-orange-700 border-orange-200',
    'Other': 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            Map Evidence Files
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${impactAreaColors[todo.impact]}`}>
              {todo.impact}
            </span>
          </DialogTitle>
          <DialogDescription>
            Upload new files or map existing files to: <strong>{todo.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex gap-4">
            {/* Upload Section */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Upload New Files</h3>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <UploadDropzone 
                    onFilesAdd={handleFilesAdd}
                    className="min-h-[120px]"
                  />
                </div>
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

              <div className="flex gap-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploadedFiles.length === 0}
                  className="flex-1"
                >
                  Upload Files ({uploadedFiles.length})
                </Button>
              </div>
            </div>

            <Separator orientation="vertical" className="mx-2" />

            {/* File Selection Section */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Map Existing Files</h3>
                  <Button
                    onClick={handleMapFiles}
                    disabled={selectedFiles.length === 0 || isMapping}
                    size="sm"
                    variant="outline"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Map Files ({selectedFiles.length})
                  </Button>
                </div>
                
                <FileList
                  files={files}
                  maxHeight="400px"
                  selectable={true}
                  selectedFiles={selectedFiles}
                  onFileSelect={handleFileSelect}
                  highlightedFiles={mappedFiles}
                  emptyMessage="No files available. Upload some files first."
                  className="border"
                />
                
                <p className="text-xs text-muted-foreground mt-2">
                  Green highlighted files are already mapped to this task.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}