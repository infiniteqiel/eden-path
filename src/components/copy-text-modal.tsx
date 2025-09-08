/**
 * Copy Text Modal Component
 * 
 * Modal for copying text content into the data room as a virtual file.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileKind } from '@/domain/data-contracts';

interface CopyTextModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, text: string, kind?: FileKind) => void;
  isLoading?: boolean;
}

const fileKindOptions: { value: FileKind; label: string }[] = [
  { value: 'business_plan', label: 'Business Plan' },
  { value: 'articles_of_association', label: 'Articles of Association' },
  { value: 'employee_handbook', label: 'Employee Handbook' },
  { value: 'hr_policy', label: 'HR Policy' },
  { value: 'di_policy', label: 'D&I Policy' },
  { value: 'env_policy', label: 'Environmental Policy' },
  { value: 'supplier_code', label: 'Supplier Code' },
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'impact_report', label: 'Impact Report' },
  { value: 'other', label: 'Other Document' },
];

export function CopyTextModal({ open, onClose, onSave, isLoading = false }: CopyTextModalProps) {
  const [fileName, setFileName] = useState('');
  const [fileKind, setFileKind] = useState<FileKind>('other');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!fileName.trim() || !content.trim()) return;
    
    onSave(fileName.trim(), content.trim(), fileKind);
    handleClose();
  };

  const handleClose = () => {
    setFileName('');
    setContent('');
    setFileKind('other');
    onClose();
  };

  const isValid = fileName.trim().length > 0 && content.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Text Content</DialogTitle>
          <DialogDescription>
            Create a virtual document by pasting text content directly into your data room.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="fileName">Document Name</Label>
            <Input
              id="fileName"
              placeholder="e.g., Company Policy Draft"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* File Kind */}
          <div className="space-y-2">
            <Label htmlFor="fileKind">Document Type</Label>
            <Select value={fileKind} onValueChange={(value) => setFileKind(value as FileKind)}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {fileKindOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your document content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {content.length} characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid || isLoading}>
            {isLoading ? 'Saving...' : 'Save Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}