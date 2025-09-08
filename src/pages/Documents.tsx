/**
 * Documents Page
 * 
 * Manage business documents and data room.
 */

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { UploadDropzone } from '@/components/upload-dropzone';
import { FileCard } from '@/components/file-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';
import { FileText, Upload, Folder } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Documents = () => {
  const { currentBusiness } = useBusinessStore();
  const { files, loadFiles, uploadFile } = useDataroomStore();

  useEffect(() => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
    }
  }, [currentBusiness, loadFiles]);

  const handleUpload = async (uploadedFiles: File[]) => {
    if (currentBusiness) {
      for (const file of uploadedFiles) {
        await uploadFile(currentBusiness.id, file);
      }
      loadFiles(currentBusiness.id);
    }
  };

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
                  <UploadDropzone onFilesAdd={handleUpload} />
                </section>

                {/* Document Categories */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Document Categories</h3>
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

                {/* File List */}
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