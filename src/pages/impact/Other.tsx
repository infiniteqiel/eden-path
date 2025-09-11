/**
 * Other & Extra Benefits Impact Area Page
 * 
 * Page for uncategorized documents and additional B Corp information
 */

import { useEffect, useState } from 'react';
import { FileText, Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UploadDropzone } from '@/components/upload-dropzone';
import { FileCard } from '@/components/file-card';
import { AIChatModal } from '@/components/ai-chat-modal';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';

export default function Other() {
  const { currentBusiness } = useBusinessStore();
  const { files, loadFiles } = useDataroomStore();
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (currentBusiness?.id) {
      loadFiles(currentBusiness.id);
    }
  }, [currentBusiness?.id, loadFiles]);

  // Filter for uncategorized documents (those without specific impact areas)
  const uncategorizedFiles = files.filter(file => 
    !file.impactArea || file.kind === 'other'
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader mode="auth" />
          
          <main className="flex-1 p-6 space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Other & Extra Benefits</h1>
              <p className="text-lg text-muted-foreground">
                Additional documents and resources for your B Corp journey
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="xl:col-span-2 space-y-6">
                {/* B Corp Information Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      About B Corporation Movement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <h3>What is a B Corporation?</h3>
                      <p>
                        B Corporations are businesses that meet the highest standards of verified social 
                        and environmental performance, public transparency, and legal accountability to 
                        balance profit and purpose.
                      </p>
                      
                      <h3>The B Corp Movement</h3>
                      <p>
                        The B Corp movement began in 2006 with the vision that one day all companies 
                        will compete not just to be the best in the world, but the Best for the World™. 
                        Today, there are over 4,000 Certified B Corporations across 80+ countries.
                      </p>

                      <h3>Key Benefits of B Corp Certification</h3>
                      <ul>
                        <li><strong>Legal Protection:</strong> Protect your mission through legal requirements</li>
                        <li><strong>Credibility:</strong> Join a trusted community of like-minded businesses</li>
                        <li><strong>Stakeholder Trust:</strong> Build trust with customers, employees, and investors</li>
                        <li><strong>Competitive Edge:</strong> Differentiate in the marketplace</li>
                        <li><strong>Network Access:</strong> Connect with B Corp community and resources</li>
                        <li><strong>Talent Attraction:</strong> Attract top talent who value purpose-driven work</li>
                      </ul>

                      <h3>Take B Corp Steps from Month 0</h3>
                      <p className="text-primary font-semibold">
                        Start integrating B Corp principles from the idea stage and beyond. Building 
                        sustainable practices early creates a stronger foundation for certification 
                        and long-term success.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Uncategorized Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Uncategorized Documents ({uncategorizedFiles.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {uncategorizedFiles.length > 0 ? (
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-3">
                          {uncategorizedFiles.map((file) => (
                            <FileCard key={file.id} file={file} />
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No uncategorized documents yet</p>
                        <p className="text-sm">Upload documents that don't fit other impact areas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Upload Area */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentBusiness ? (
                      <UploadDropzone 
                        onFilesAdd={(files) => {
                          // Handle file uploads for the current business
                          files.forEach(file => {
                            // This will be connected to the dataroom store
                          });
                        }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Create a company to upload documents
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Resources Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resources & Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://www.bcorporation.net/" target="_blank" rel="noopener noreferrer">
                        Official B Corp Website
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://www.bcorporation.net/en-us/movement" target="_blank" rel="noopener noreferrer">
                        B Corp Movement
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://www.bcorporation.net/en-us/standards" target="_blank" rel="noopener noreferrer">
                        B Corp Standards
                      </a>
                    </Button>
                    <Separator />
                    <Button 
                      onClick={() => setShowAIChat(true)}
                      className="w-full"
                    >
                      Get AI Guidance
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AIChatModal 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
        impactArea="Other"
      />
    </SidebarProvider>
  );
}