/**
 * Other & Extra Benefits Impact Area Page
 * 
 * Shows uncategorized documents and additional B Corp benefits/resources.
 */

import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { UploadDropzone } from '@/components/upload-dropzone';
import { FileCard } from '@/components/file-card';
import { AIChatModal } from '@/components/ai-chat-modal';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';
import { Star, Award, ExternalLink, Plus, FolderOpen } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Other = () => {
  const { currentBusiness } = useBusinessStore();
  const { files, loadFiles } = useDataroomStore();
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
    }
  }, [currentBusiness, loadFiles]);

  // Filter uncategorized files (files without a specific kind or marked as 'other')
  const uncategorizedFiles = files.filter(file => 
    !file.kind || 
    Object.values(['business_plan', 'articles_of_association', 'certificate_of_incorp', 'employee_handbook', 'hr_policy', 'di_policy', 'env_policy', 'supplier_code', 'privacy_policy', 'impact_report']).indexOf(file.kind) === -1
  );

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
            <div className="ml-4 flex items-center gap-3">
              <Star className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg">Other & Extra Benefits</h1>
            </div>
          </header>
          
          <main 
            className="flex-1 overflow-auto"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid xl:grid-cols-3 gap-8">
                
                {/* Left Column - Main Content */}
                <div className="xl:col-span-2 space-y-8">
                  {/* B Corp Movement Info */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Award className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">B Corporation Movement</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        B Corporation Certification is a movement of companies using business as a force for good. 
                        The "Other" category captures additional benefits and documents that don't fit into the 
                        traditional five impact areas but are valuable for your B Corp journey.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-blue-600">Legal Protection</h4>
                          <p className="text-sm text-muted-foreground">
                            Protect your mission through legal requirements that balance profit with purpose
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-green-600">Movement Benefits</h4>
                          <p className="text-sm text-muted-foreground">
                            Access to a global community of 4,000+ purpose-driven companies
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-purple-600">Market Recognition</h4>
                          <p className="text-sm text-muted-foreground">
                            51% UK awareness means customers increasingly recognize B Corp values
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-orange-600">Future Standards</h4>
                          <p className="text-sm text-muted-foreground">
                            B Lab's 2026 standards continue raising the bar for sustainable business
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Uncategorized Documents */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold">Uncategorized Documents</h3>
                      </div>
                      <AIChatIcon 
                        onClick={() => setShowAIChat(true)}
                        size="md"
                      />
                    </div>
                    
                    {uncategorizedFiles.length > 0 ? (
                      <ScrollArea className="h-96">
                        <div className="grid gap-4 pr-4">
                          {uncategorizedFiles.map((file) => (
                            <div key={file.id} className="bg-white/60 rounded-lg p-3">
                              <FileCard file={file} />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-12">
                        <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No uncategorized documents</p>
                        <p className="text-sm text-muted-foreground">
                          All your documents have been properly categorized across the five impact areas
                        </p>
                      </div>
                    )}
                  </section>
                </div>

                {/* Right Column - Actions & Resources */}
                <div className="space-y-6">
                  {/* Upload New Documents */}
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Upload Documents
                      </CardTitle>
                      <CardDescription>
                        Add additional documents to support your B Corp application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UploadDropzone
                        onFilesAdd={(files) => {
                          console.log('Files uploaded:', files);
                        }}
                        className="min-h-[120px]"
                      />
                    </CardContent>
                  </Card>

                  {/* External Resources */}
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>External Resources</CardTitle>
                      <CardDescription>
                        Helpful resources for your B Corp journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://bcorporation.uk', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        B Corp UK Website
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://bcorporation.uk/about-b-lab-uk/b-lab-uk/our-standards/b-labs-new-standards-are-here/', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        New 2026 Standards
                      </Button>
                      
                      <Button 
                        onClick={() => setShowAIChat(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Get AI Guidance
                      </Button>
                    </CardContent>
                  </Card>

                  {/* B Corp Stats */}
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/20">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">B Corp Movement Stats</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Global B Corps:</span>
                          <span className="font-semibold">4,000+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Countries:</span>
                          <span className="font-semibold">80+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">UK Awareness:</span>
                          <span className="font-semibold">51%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
};

export default Other;