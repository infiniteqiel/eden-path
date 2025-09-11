/**
 * Company Creation Modal Component
 * 
 * Modal for creating a new company with basic details
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useBusinessStore } from '@/store/business';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';

interface CompanyCreationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CompanyCreationModal({ open, onClose }: CompanyCreationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    size: '',
    stage: '',
    location: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBusiness } = useBusinessStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a company.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createBusiness({
        accountId: user.id,
        name: formData.name,
        industry: formData.industry,
        workersCount: parseInt(formData.size) || 1
      });

      toast({
        title: "Company Created",
        description: "Your company profile has been created successfully!"
      });

      onClose();
      setFormData({
        name: '',
        description: '',
        industry: '',
        size: '',
        stage: '',
        location: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
    // User can upload documents and deduce company info later
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Your Company Profile</DialogTitle>
          <DialogDescription>
            Tell us about your business to get started with your B Corp journey. 
            You can always update this information later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what your company does..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This information helps us provide better guidance (stored locally)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g. Technology, Healthcare, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Just me (founder)</SelectItem>
                  <SelectItem value="2-5">2-5 employees</SelectItem>
                  <SelectItem value="6-10">6-10 employees</SelectItem>
                  <SelectItem value="11-25">11-25 employees</SelectItem>
                  <SelectItem value="26-50">26-50 employees</SelectItem>
                  <SelectItem value="50+">50+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Business Stage</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select current stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="startup">Early Startup</SelectItem>
                <SelectItem value="growth">Growth Stage</SelectItem>
                <SelectItem value="established">Established Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={!formData.name || isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Company"}
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip} className="flex-1">
              Skip this step and upload documents
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}