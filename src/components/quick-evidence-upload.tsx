/**
 * Quick Evidence Upload Modal
 * 
 * Allows users to quickly upload evidence files directly for a task
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useBusinessStore } from '@/store/business';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface QuickEvidenceUploadProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export function QuickEvidenceUpload({ 
  isOpen, 
  onClose, 
  taskId, 
  taskTitle 
}: QuickEvidenceUploadProps) {
  const { currentBusiness } = useBusinessStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!currentBusiness || uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload files');
        return;
      }

      // Get or create dataroom
      let { data: dataroom } = await supabase
        .from('datarooms')
        .select('id')
        .eq('business_id', currentBusiness.id)
        .single();

      if (!dataroom) {
        const { data: newDataroom } = await supabase
          .from('datarooms')
          .insert({ business_id: currentBusiness.id })
          .select('id')
          .single();
        dataroom = newDataroom;
      }

      if (!dataroom) {
        throw new Error('Failed to get dataroom');
      }

      // Upload files and create mappings
      for (const file of uploadedFiles) {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `${currentBusiness.id}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('business-documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Create file record
        const { data: fileData, error: fileError } = await supabase
          .from('files')
          .insert({
            dataroom_id: dataroom.id,
            original_name: file.name,
            storage_path: filePath,
            content_type: file.type,
            file_size_bytes: file.size,
            impact_area: 'Other' // Will be updated by trigger when mapped
          })
          .select('id')
          .single();

        if (fileError || !fileData) {
          console.error('File creation error:', fileError);
          continue;
        }

        // Map file to task
        await supabase
          .from('task_file_mappings')
          .insert({
            task_id: taskId,
            file_id: fileData.id,
            mapped_by: user.id
          });
      }

      toast.success(`Uploaded ${uploadedFiles.length} file(s) and mapped to task`);
      setUploadedFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Evidence
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Upload files as evidence for: <span className="font-medium">{taskTitle}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop files here" : "Click or drag files to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX, TXT, or images
            </p>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Files to upload:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-auto p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploadedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${uploadedFiles.length} file(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}