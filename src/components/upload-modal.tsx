/**
 * Upload Modal Component
 * 
 * Modal popup for document uploads triggered from button
 */

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UploadDropzone } from '@/components/upload-dropzone';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesAdd: (files: File[]) => void;
  title?: string;
  description?: string;
}

export function UploadModal({ 
  isOpen, 
  onClose, 
  onFilesAdd, 
  title = "Upload Documents",
  description = "Upload documents to support your B Corp certification process"
}: UploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="mt-2">{description}</DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-6 w-6 rounded-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-4">
          <UploadDropzone
            onFilesAdd={(files) => {
              onFilesAdd(files);
              onClose();
            }}
            className="min-h-[300px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}