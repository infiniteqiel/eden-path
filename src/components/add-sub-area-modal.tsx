/**
 * Modal for adding custom sub-areas
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { subAreasService } from '@/services/adapters/supabase/sub-areas';
import { useToast } from '@/hooks/use-toast';

interface AddSubAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  impactArea: string;
  onSubAreaAdded: () => void;
}

export function AddSubAreaModal({ 
  isOpen, 
  onClose, 
  businessId, 
  impactArea, 
  onSubAreaAdded 
}: AddSubAreaModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the sub-area",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await subAreasService.createSubArea({
        businessId,
        impactArea,
        title: title.trim(),
        description: description.trim() || undefined,
        iconType: 'user_added',
        isUserCreated: true
      });

      toast({
        title: "Success",
        description: `"${title}" sub-area has been added to ${impactArea}`,
      });

      // Reset form and close modal
      setTitle('');
      setDescription('');
      onClose();
      onSubAreaAdded();
    } catch (error) {
      console.error('Error creating sub-area:', error);
      toast({
        title: "Error",
        description: "Failed to create sub-area. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Add Custom Area
          </DialogTitle>
          <DialogDescription>
            Create a custom sub-area for {impactArea} to organize your tasks according to your specific needs.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Remote Work Policies"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this area covers..."
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Creating...' : 'Add Area'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}