/**
 * Upload Dropzone Component
 * 
 * File upload interface with drag and drop support.
 */

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadProgress } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFilesAdd: (files: File[]) => void;
  uploads?: UploadProgress[];
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  disabled?: boolean;
  className?: string;
}

const defaultAccept = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md']
};

export function UploadDropzone({
  onFilesAdd,
  uploads = [],
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = defaultAccept,
  disabled = false,
  className
}: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!disabled) {
      onFilesAdd(acceptedFiles);
    }
  }, [onFilesAdd, disabled]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled,
    multiple: true
  });

  const hasUploads = uploads.length > 0;
  const rejectedFiles = fileRejections.map(rejection => ({
    file: rejection.file,
    errors: rejection.errors
  }));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isDragActive && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <Upload className={cn(
            "mx-auto h-12 w-12 mb-4",
            isDragActive ? "text-primary" : "text-muted-foreground"
          )} />
          
          <div className="space-y-2">
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">
                Drop files here...
              </p>
            ) : (
              <>
                <p className="text-lg font-medium">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, Word, and text documents up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </>
            )}
          </div>
          
          <Button variant="outline" className="mt-4" disabled={disabled}>
            Choose Files
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {hasUploads && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Uploading...</h4>
          {uploads.map((upload) => (
            <UploadProgressItem key={upload.fileId} upload={upload} />
          ))}
        </div>
      )}

      {/* File Rejection Errors */}
      {rejectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-destructive">
            Some files couldn't be uploaded:
          </h4>
          {rejectedFiles.map(({ file, errors }, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
              <span>-</span>
              <span>{errors[0]?.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Upload Progress Item
 */
interface UploadProgressItemProps {
  upload: UploadProgress;
}

function UploadProgressItem({ upload }: UploadProgressItemProps) {
  const { fileName, progress, status, error } = upload;

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
      <File className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{fileName}</p>
        
        {status === 'uploading' && (
          <div className="mt-1">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
          </div>
        )}
        
        {status === 'processing' && (
          <p className="text-xs text-blue-600 mt-1">Processing document...</p>
        )}
        
        {status === 'error' && error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>

      <div className="flex-shrink-0">
        {status === 'complete' && (
          <CheckCircle className="h-5 w-5 text-success" />
        )}
        {status === 'error' && (
          <AlertCircle className="h-5 w-5 text-destructive" />
        )}
      </div>
    </div>
  );
}