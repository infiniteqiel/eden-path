import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedUploadDropzone } from '@/components/enhanced-upload-dropzone';
import { AiAnalysisButton } from '@/components/ai-analysis-button';
import { Building2, Save, Upload, Brain } from 'lucide-react';
import { useBusinessStore } from '@/store/business';
import { useToast } from '@/hooks/use-toast';
import { Business } from '@/domain/data-contracts';

export default function CompanyProfile() {
  const { currentBusiness, updateBusiness } = useBusinessStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Business>>({});
  const [companyDescription, setCompanyDescription] = useState('');
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      setFormData({
        name: currentBusiness.name,
        companyNumber: currentBusiness.companyNumber || '',
        legalForm: currentBusiness.legalForm,
        country: currentBusiness.country,
        operatingMonths: currentBusiness.operatingMonths,
        workersCount: currentBusiness.workersCount,
        industry: currentBusiness.industry || ''
      });
      
      // Initialize company description from saved value or generate one
      const initialDesc = currentBusiness.description && currentBusiness.description.trim().length > 0
        ? currentBusiness.description
        : generateCompanyDescription(currentBusiness);
      setCompanyDescription(initialDesc);
    }
  }, [currentBusiness]);

  const generateCompanyDescription = (business: Business): string => {
    return `${business.name} is a ${business.legalForm || 'UK'} company operating in the ${business.industry || 'business'} sector. The company has been operating for ${business.operatingMonths || 0} months and currently employs ${business.workersCount || 0} people.`;
  };

  const handleInputChange = (field: keyof Business, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentBusiness) return;
    
    setIsSaving(true);
    try {
      await updateBusiness(currentBusiness.id, formData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Company profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update company profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!currentBusiness) return;
    
    setIsSavingDescription(true);
    try {
      await updateBusiness(currentBusiness.id, { description: companyDescription.trim() });
      toast({
        title: "Description Saved",
        description: "Company description has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving description:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save company description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleUploadComplete = () => {
    toast({
      title: "Documents Uploaded",
      description: "Business documents have been uploaded successfully.",
    });
  };

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please select a business to view its profile.</p>
      </div>
    );
  }

  // Determine if the description has unsaved changes
  const isDescriptionDirty = (companyDescription.trim() !== (currentBusiness.description?.trim() || ''));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader mode="auth" />
          
          {/* Page Header */}
          <div className="border-b border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h1 className="font-semibold">Company Profile</h1>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Company Information Card */}
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => setIsEditing(false)} 
                          variant="outline"
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyNumber">Company Number</Label>
                      <Input
                        id="companyNumber"
                        value={formData.companyNumber || ''}
                        onChange={(e) => handleInputChange('companyNumber', e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., 12345678"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="legalForm">Legal Form</Label>
                      <Select
                        value={formData.legalForm || ''}
                        onValueChange={(value) => handleInputChange('legalForm', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select legal form" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ltd">Limited Company (Ltd)</SelectItem>
                          <SelectItem value="LLP">Limited Liability Partnership (LLP)</SelectItem>
                          <SelectItem value="CIC">Community Interest Company (CIC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country || 'UK'}
                        onValueChange={(value) => handleInputChange('country', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="operatingMonths">Operating Months</Label>
                      <Input
                        id="operatingMonths"
                        type="number"
                        value={formData.operatingMonths || ''}
                        onChange={(e) => handleInputChange('operatingMonths', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        placeholder="Number of months in operation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workersCount">Number of Workers</Label>
                      <Input
                        id="workersCount"
                        type="number"
                        value={formData.workersCount || ''}
                        onChange={(e) => handleInputChange('workersCount', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        placeholder="Total number of employees"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry || ''}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Company Description & AI Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Company Description & AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="Describe your company's mission, business model, and activities..."
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      This description will be used for AI analysis to generate B Corp recommendations.
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <Button 
                      onClick={handleSaveDescription}
                      disabled={isSavingDescription || !companyDescription.trim()}
                      variant="outline"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSavingDescription ? 'Saving...' : 'Save Description'}
                    </Button>
                    <AiAnalysisButton 
                      businessId={currentBusiness.id}
                      triggerText="Analyze Company Description"
                      customContext={companyDescription}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Business Documents Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Business Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Upload your business documents for comprehensive B Corp analysis. Include business plans, 
                      policies, certificates, and other relevant documentation.
                    </p>
                    <EnhancedUploadDropzone
                      businessId={currentBusiness.id}
                      onUploadComplete={handleUploadComplete}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}