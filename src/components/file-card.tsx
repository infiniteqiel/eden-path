/**
 * File Card Component
 * 
 * Displays uploaded files in the data room.
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash2, 
  Edit3,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { DataFile, FileKind } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { taskFileMappingService } from '@/services/registry';
import { toast } from 'sonner';

interface FileCardProps {
  file: DataFile;
  onOpen?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  className?: string;
}

// File kind labels for display
const fileKindLabels: Record<FileKind, string> = {
  business_plan: 'Business Plan',
  articles_of_association: 'Articles of Association',
  certificate_of_incorp: 'Certificate of Incorporation',
  employee_handbook: 'Employee Handbook',
  hr_policy: 'HR Policy',
  di_policy: 'D&I Policy',
  env_policy: 'Environmental Policy',
  supplier_code: 'Supplier Code',
  privacy_policy: 'Privacy Policy',
  impact_report: 'Impact Report',
  other: 'Other Document'
};

// File type icons
const getFileIcon = (contentType?: string) => {
  if (!contentType) return FileText;
  
  if (contentType.includes('pdf')) return FileText;
  if (contentType.includes('word') || contentType.includes('document')) return FileText;
  if (contentType.includes('text')) return FileText;
  
  return FileText;
};

// Format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// OCR status indicators
const ocrStatusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    label: 'Processing...'
  },
  done: {
    icon: CheckCircle,
    color: 'text-green-600', 
    label: 'Ready'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    label: 'Failed'
  }
};

export function FileCard({ file, onOpen, onRename, onDelete, className }: FileCardProps) {
  const [isMapped, setIsMapped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const FileIcon = getFileIcon(file.contentType);
  const OcrIcon = ocrStatusConfig[file.ocrStatus].icon;

  // Check if file is mapped to any task
  useEffect(() => {
    const checkFileMapping = async () => {
      try {
        const taskIds = await taskFileMappingService.getFileTasks(file.id);
        setIsMapped(taskIds.length > 0);
      } catch (error) {
        console.error('Failed to check file mapping:', error);
        setIsMapped(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFileMapping();
  }, [file.id]);

  const handleDelete = async () => {
    if (isMapped) {
      toast.error('Cannot delete mapped files. Unmap from tasks first.');
      return;
    }
    onDelete?.();
  };

  const getFileMappingLabel = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary" className="text-xs">
          Checking...
        </Badge>
      );
    }
    
    if (isMapped) {
      return (
        <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
          {file.impactArea || 'Mapped'}
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
  
  return (
    <Card className={cn("file-card", className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm leading-tight truncate">
                {file.originalName}
              </h4>
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {isMapped && file.impactArea ? file.impactArea : fileKindLabels[file.kind]}
                </Badge>
                {getFileMappingLabel()}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onOpen && (
                  <DropdownMenuItem onClick={onOpen}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                {onRename && (
                  <DropdownMenuItem onClick={onRename}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className={cn(
                      "text-destructive",
                      isMapped && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isMapped}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isMapped ? "Cannot Delete (Mapped)" : "Delete"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</span>
            </div>

            <div className={cn(
              "flex items-center space-x-1",
              ocrStatusConfig[file.ocrStatus].color
            )}>
              <OcrIcon className="h-3 w-3" />
              <span>{ocrStatusConfig[file.ocrStatus].label}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}