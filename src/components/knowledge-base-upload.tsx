/**
 * Knowledge Base Upload Component
 * 
 * Allows uploading of knowledge base files for AI NLP integration
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Brain, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface KnowledgeBaseFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  processed: boolean;
}

interface KnowledgeBaseUploadProps {
  className?: string;
}

export function KnowledgeBaseUpload({ className }: KnowledgeBaseUploadProps) {
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeBaseFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
    },
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      
      // Simulate upload process
      for (const file of acceptedFiles) {
        const newFile: KnowledgeBaseFile = {
          id: `kb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          processed: false,
        };
        
        setKnowledgeFiles(prev => [...prev, newFile]);
        
        // Simulate processing delay
        setTimeout(() => {
          setKnowledgeFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...f, processed: true } : f
          ));
        }, 2000 + Math.random() * 3000);
      }
      
      setUploading(false);
    },
  });

  const removeFile = (fileId: string) => {
    setKnowledgeFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Knowledge Base
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload documents to enhance AI assistance with B Corp knowledge
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            {isDragActive ? "Drop files here..." : "Drag & drop knowledge files here"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: TXT, PDF, DOC, DOCX, MD, JSON
          </p>
          <Button variant="outline" size="sm" className="mt-2" disabled={uploading}>
            {uploading ? "Uploading..." : "Browse Files"}
          </Button>
        </div>

        {/* Uploaded Files */}
        {knowledgeFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Knowledge Base Files</h4>
            <div className="space-y-2">
              {knowledgeFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={file.processed ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {file.processed ? "Processed" : "Processing..."}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Integration Status */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">AI Integration Ready</p>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Framework prepared for Deepseek NLP integration with knowledge base processing
          </p>
        </div>
      </CardContent>
    </Card>
  );
}