/**
 * Other & Extra Benefits Impact Area Page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { ImpactFilesSection } from '@/components/impact-files-section';
import { AIChatModal } from '@/components/ai-chat-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Plus, Home, FileText, Upload, HelpCircle } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Other = () => {
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <header 
            className="h-16 flex items-center border-b px-4 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 0.9)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <SidebarTrigger />
            <div className="ml-4 flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Plus className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-lg">Other & Extra Benefits</h1>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(${singaporeCityscape})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}>
            <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
              <div className="space-y-8">
                {/* Welcome Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-center mb-8">
                    <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Other & Extra Benefits</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Upload documents that don't fit into the main B Corp impact areas. This includes unique programs, 
                      additional benefits, miscellaneous policies, and any other supporting materials that showcase 
                      your company's commitment to positive impact.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/60 border-dashed border-2">
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <Upload className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-semibold mb-2">Upload Documents</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add miscellaneous policies, certifications, or programs
                        </p>
                        <Button variant="outline" size="sm">Choose Files</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <FileText className="h-8 w-8 text-secondary mb-3" />
                        <h3 className="font-semibold mb-2">Document Library</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          View all uploaded miscellaneous documents
                        </p>
                        <Button variant="outline" size="sm">View Library</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <HelpCircle className="h-8 w-8 text-accent mb-3" />
                        <h3 className="font-semibold mb-2">Need Help?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get guidance on additional documents to include
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setShowAIChat(true)}>
                          Ask AI
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* File Management Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Document Management</h3>
                  <ImpactFilesSection 
                    impactArea="Other" 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
                </section>

                {/* Additional Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Additional Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle className="text-lg">Certification Programs</CardTitle>
                        <CardDescription>
                          Additional certifications that complement B Corp status
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• ISO 14001 Environmental Management</li>
                          <li>• Fair Trade Certification</li>
                          <li>• LEED Building Certification</li>
                          <li>• Carbon Trust Standard</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle className="text-lg">Unique Benefits</CardTitle>
                        <CardDescription>
                          Innovative programs that set you apart
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Employee ownership programs</li>
                          <li>• Innovation time allocation</li>
                          <li>• Community sabbaticals</li>
                          <li>• Impact investment funds</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        impactArea="Other"
        context={{ level: 'overview' }}
      />
    </SidebarProvider>
  );
};

export default Other;