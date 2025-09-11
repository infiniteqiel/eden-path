/**
 * Other & Extra Benefits Impact Area Page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { ImpactFilesSection } from '@/components/impact-files-section';
import { AIChatModal } from '@/components/ai-chat-modal';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { Plus, Home } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Other = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useBusinessStore();
  const [showAIChat, setShowAIChat] = useState(false);

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
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <h2 className="text-2xl font-bold mb-4">Other & Extra Benefits</h2>
                  <p className="text-muted-foreground mb-6">
                    Additional impact areas and unique programs that contribute to your B Corp journey.
                  </p>
                </section>

                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ImpactFilesSection 
                    impactArea="Other" 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
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