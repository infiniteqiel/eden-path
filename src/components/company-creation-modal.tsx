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
import { usePostBusinessCreation } from '@/hooks/use-business-context';

interface CompanyCreationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CompanyCreationModal({ open, onClose }: CompanyCreationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    companyNumber: '',
    legalForm: '' as 'Ltd' | 'LLP' | 'CIC' | '',
    country: 'UK' as 'UK',
    operatingMonths: '',
    workersCount: '1'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBusiness } = useBusinessStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { initializeNewBusiness } = usePostBusinessCreation();

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
      const business = await createBusiness({
        accountId: user.id,
        name: formData.name,
        description: formData.description || undefined,
        industry: formData.industry || undefined,
        companyNumber: formData.companyNumber || undefined,
        legalForm: formData.legalForm || undefined,
        country: formData.country,
        operatingMonths: parseInt(formData.operatingMonths) || undefined,
        workersCount: parseInt(formData.workersCount) || 1
      });

      // Initialize business data after creation
      await initializeNewBusiness(business.id);

      toast({
        title: "Company Created",
        description: "Your company profile has been created successfully!"
      });

      onClose();
      setFormData({
        name: '',
        description: '',
        industry: '',
        companyNumber: '',
        legalForm: '' as 'Ltd' | 'LLP' | 'CIC' | '',
        country: 'UK' as 'UK',
        operatingMonths: '',
        workersCount: '1'
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
              <Label htmlFor="companyNumber">Company Number</Label>
              <Input
                id="companyNumber"
                value={formData.companyNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, companyNumber: e.target.value }))}
                placeholder="e.g., 12345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legalForm">Legal Form *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, legalForm: value as 'Ltd' | 'LLP' | 'CIC' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select legal form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ltd">Private Limited Company (Ltd)</SelectItem>
                  <SelectItem value="LLP">Limited Liability Partnership (LLP)</SelectItem>
                  <SelectItem value="CIC">Community Interest Company (CIC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingMonths">Operating Months *</Label>
              <Input
                id="operatingMonths"
                type="number"
                min="0"
                max="120"
                value={formData.operatingMonths}
                onChange={(e) => setFormData(prev => ({ ...prev, operatingMonths: e.target.value }))}
                placeholder="e.g., 12"
                required
              />
              <p className="text-xs text-muted-foreground">
                How many months has your business been operating?
              </p>
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
              <Label htmlFor="workersCount">Number of Workers *</Label>
              <Input
                id="workersCount"
                type="number"
                min="1"
                value={formData.workersCount}
                onChange={(e) => setFormData(prev => ({ ...prev, workersCount: e.target.value }))}
                placeholder="1"
                required
              />
              <p className="text-xs text-muted-foreground">
                Include founders and all employees
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.name || !formData.legalForm || !formData.operatingMonths || isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Company"}
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip} className="flex-1">
              Skip this step
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}