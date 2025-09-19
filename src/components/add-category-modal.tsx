/**
 * Add Category Modal Component
 * 
 * Modal for adding new document categories
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDocumentCategoryStore } from '@/store/document-categories';
import { toast } from 'sonner';
import { Folder, FileText, Briefcase, Shield, Heart, Leaf, Star, Plus } from 'lucide-react';

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
}

const iconOptions = [
  { name: 'Folder', icon: Folder, value: 'folder' },
  { name: 'Document', icon: FileText, value: 'file-text' },
  { name: 'Briefcase', icon: Briefcase, value: 'briefcase' },
  { name: 'Shield', icon: Shield, value: 'shield' },
  { name: 'Heart', icon: Heart, value: 'heart' },
  { name: 'Leaf', icon: Leaf, value: 'leaf' },
  { name: 'Star', icon: Star, value: 'star' },
  { name: 'Plus', icon: Plus, value: 'plus' },
];

const colorOptions = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Gray', value: '#6B7280' },
];

export function AddCategoryModal({ open, onOpenChange, businessId }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [isLoading, setIsLoading] = useState(false);
  const { createCategory } = useDocumentCategoryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId || !name.trim()) {
      toast.error('Please fill in the category name');
      return;
    }

    setIsLoading(true);
    
    try {
      await createCategory(businessId, {
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        sortOrder: 0, // Will be auto-assigned
        isSystemCategory: false,
      });
      
      toast.success('Category created successfully');
      handleClose();
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error('Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedIcon('folder');
    setSelectedColor('#3B82F6');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Document Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Financial Reports"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what documents go in this category"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={selectedIcon === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedIcon(option.value)}
                    className="flex items-center justify-center"
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedColor === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedColor(option.value)}
                  className="flex items-center justify-center"
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: option.value }}
                  />
                </Button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}