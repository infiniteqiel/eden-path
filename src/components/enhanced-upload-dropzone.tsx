/**
 * Enhanced Upload Dropzone Component
 * 
 * Integrates with new file processing pipeline and provides real-time feedback
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';
import { processDocumentsWithProgress, ProcessingProgress } from '@/lib/document-processor';
import { cn } from '@/lib/utils';

interface EnhancedUploadDropzoneProps {
  businessId: string;
  impactArea?: ImpactArea;
  onUploadComplete?: () => void;
  className?: string;
}

export function EnhancedUploadDropzone({ 
  businessId, 
  impactArea, 
  onUploadComplete,
  className 
}: EnhancedUploadDropzoneProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<ProcessingProgress[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: handleFileDrop,
    disabled: isProcessing
  });

  async function handleFileDrop(acceptedFiles: File[]) {
    if (!acceptedFiles.length || isProcessing) return;

    setIsProcessing(true);
    setProcessingFiles([]);

    try {
      await processDocumentsWithProgress(
        acceptedFiles, 
        businessId,
        (progress) => setProcessingFiles(progress)
      );

      // Wait a moment to show completed status
      setTimeout(() => {
        setProcessingFiles([]);
        setIsProcessing(false);
        onUploadComplete?.();
      }, 1500);

    } catch (error) {
      console.error('File processing error:', error);
      setIsProcessing(false);
    }
  }

  function getStatusIcon(status: ProcessingProgress['status']) {
    switch (status) {
      case 'uploading': return <Clock className="h-4 w-4" />;
      case 'extracting': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  }

  function getStatusColor(status: ProcessingProgress['status']) {
    switch (status) {
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'extracting': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusLabel(status: ProcessingProgress['status']) {
    switch (status) {
      case 'uploading': return 'Uploading';
      case 'extracting': return 'Extracting Text';
      case 'completed': return 'Complete';
      case 'failed': return 'Failed';
      default: return 'Processing';
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <Card className={cn(
        "border-2 border-dashed transition-colors cursor-pointer",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-8 text-center" {...getRootProps()}>
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive ? 'Drop files here' : 'Upload Documents'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drop files here or click to browse. Supports PDF, DOCX, TXT, MD, JSON.
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 50MB
              </p>
            </div>
            
            {impactArea && (
              <Badge variant="secondary" className="mt-2">
                Impact Area: {impactArea}
              </Badge>
            )}
            
            {!isDragActive && !isProcessing && (
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {processingFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Processing Files</h4>
            <div className="space-y-3">
              {processingFiles.map((file) => (
                <div key={file.fileName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {file.fileName}
                      </span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getStatusColor(file.status))}
                    >
                      {getStatusLabel(file.status)}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={file.progress} 
                    className="h-2"
                  />
                  
                  {file.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {file.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status Summary */}
      {isProcessing && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Processing documents with AI text extraction...
          </p>
        </div>
      )}
    </div>
  );
}