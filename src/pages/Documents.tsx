/**
 * Documents Page
 * 
 * Manage business documents and data room.
 */

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { EnhancedUploadDropzone } from '@/components/enhanced-upload-dropzone';
import { FileCard } from '@/components/file-card';
import { FileList } from '@/components/file-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';
import { FileText, Upload, Folder, Building, Users, Heart, Leaf, Star, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImpactArea } from '@/domain/data-contracts';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Documents = () => {
  const { currentBusiness } = useBusinessStore();
  const { files, loadFiles, uploadFile } = useDataroomStore();

  useEffect(() => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
    }
  }, [currentBusiness, loadFiles]);

  const handleUploadComplete = () => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
    }
  };

  // Group files by impact area
  const filesByImpactArea = files.reduce((acc, file) => {
    const area = file.impactArea || 'Other';
    if (!acc[area]) acc[area] = [];
    acc[area].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  const impactAreas: Array<{ 
    name: ImpactArea | 'Other'; 
    icon: any; 
    color: string;
    description: string;
  }> = [
    { name: 'Governance', icon: Building, color: 'blue', description: 'Corporate governance and mission' },
    { name: 'Workers', icon: Users, color: 'green', description: 'Employee policies and benefits' },
    { name: 'Community', icon: Heart, color: 'purple', description: 'Community impact and engagement' },
    { name: 'Environment', icon: Leaf, color: 'emerald', description: 'Environmental policies and metrics' },
    { name: 'Customers', icon: Star, color: 'orange', description: 'Customer impact and satisfaction' },
    { name: 'Other', icon: Folder, color: 'gray', description: 'Uncategorized documents' }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <header 
            className="h-16 flex items-center border-b px-4 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <SidebarTrigger />
            <h1 className="ml-4 font-bold text-lg">Documents - Data Room</h1>
          </header>
          
          <main 
            className="flex-1 overflow-auto relative"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-8">
                {/* Upload Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
                    <p className="text-muted-foreground">
                      Upload your business documents for AI analysis and B Corp readiness assessment
                    </p>
                  </div>
                  <EnhancedUploadDropzone 
                    businessId={currentBusiness?.id || ''} 
                    onUploadComplete={handleUploadComplete} 
                  />
                </section>

                {/* Document Categories */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Document Categories</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Business Plan
                        </CardTitle>
                        <CardDescription>
                          Core business documents and strategy
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {files.filter(f => f.kind === 'business_plan').length} files
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Folder className="h-5 w-5" />
                          Policies
                        </CardTitle>
                        <CardDescription>
                          HR, environmental, and governance policies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {files.length} files
                          </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="h-5 w-5" />
                          Legal Documents
                        </CardTitle>
                        <CardDescription>
                          Articles, incorporation, and legal files
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {files.length} files
                          </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Documents by Impact Area */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Documents by Impact Area</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {impactAreas.map((area) => {
                      const areaFiles = filesByImpactArea[area.name] || [];
                      const Icon = area.icon;
                      
                      return (
                        <Card key={area.name} className="bg-white/60">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Icon className={`h-5 w-5 text-${area.color}-600`} />
                              {area.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {area.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-muted-foreground mb-3">
                              {areaFiles.length} files
                            </div>
                            
                            {areaFiles.length > 0 ? (
                              <ScrollArea className="h-32">
                                <div className="space-y-2 pr-2">
                                  {areaFiles.map((file) => (
                                    <div key={file.id} className="flex items-center gap-2 p-2 rounded border bg-white/40">
                                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                      <span className="text-xs truncate flex-1">{file.originalName}</span>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            ) : (
                              <div className="text-center py-4 text-xs text-muted-foreground">
                                No files uploaded
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                {/* All Documents */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Documents</h3>
                  {files.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {files.map((file) => (
                        <div key={file.id} className="bg-white/60 rounded-lg p-3">
                          <FileCard
                            file={file}
                            onDelete={() => console.log('Delete file:', file.id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No documents uploaded yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload your first document to get started with B Corp analysis
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Documents;