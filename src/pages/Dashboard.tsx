/**
 * Dashboard Page
 * 
 * Main dashboard showing business overview and progress across Impact Areas.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader, MissionSnippet } from '@/components/app-header';
import { BusinessSwitcher } from '@/components/business-switcher';
import { ImpactCard } from '@/components/impact-card';
import { TodoItem } from '@/components/todo-item';
import { EmptyState } from '@/components/empty-state';
import { UploadDropzone } from '@/components/upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Upload, FileText, ArrowRight, Building, Leaf, Users } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Dashboard = () => {
  const { businesses, currentBusiness, loadBusinesses, selectBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();

  // Get quick todos (top 5 priority P1/P2 not done)
  const quickTodos = todos
    .filter(todo => todo.status !== 'done' && ['P1', 'P2'].includes(todo.priority))
    .slice(0, 5);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
    }
  };

  if (!businesses.length) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader mode="auth" />
        <main className="container mx-auto px-4 py-8">
          <EmptyState
            title="Welcome to bcstart.ai"
            description="Let's get started by setting up your first business profile."
            ctaLabel="Create Business"
            onCta={() => {}}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader mode="auth" />
      
      {/* Hero Section with Background */}
      <div 
        className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border-b overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url(${singaporeCityscape})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              B Corp Readiness Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your business into a force for good. Track your progress toward B Corporation certification with our comprehensive readiness platform.
            </p>
            {businesses.length > 0 && currentBusiness && (
              <div className="mt-6 inline-block">
                <BusinessSwitcher
                  businesses={businesses}
                  currentBusiness={currentBusiness}
                  onBusinessChange={(business) => selectBusiness(business.id)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {currentBusiness ? (
            <>
              {/* Progress Overview */}
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Your B Corp Progress</h2>
                  <p className="text-lg text-muted-foreground">
                    Track your advancement across the five key impact areas
                  </p>
                </div>
                
                {/* Impact Cards Grid - 3 then 2 layout */}
                <div className="space-y-6">
                  {/* First row - 3 cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                    {impactSummaries.slice(0, 3).map((summary) => (
                      <ImpactCard
                        key={summary.impact}
                        summary={summary}
                        onViewTasks={() => {
                          console.log(`Viewing completed tasks for ${summary.impact}`);
                        }}
                        className="w-full max-w-sm"
                      />
                    ))}
                  </div>
                  
                  {/* Second row - 2 cards centered */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center max-w-2xl mx-auto">
                    {impactSummaries.slice(3, 5).map((summary) => (
                      <ImpactCard
                        key={summary.impact}
                        summary={summary}
                        onViewTasks={() => {
                          console.log(`Viewing completed tasks for ${summary.impact}`);
                        }}
                        className="w-full max-w-sm"
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Upload Documents Section */}
              <section className="bg-muted/30 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Upload Your Business Documents</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Share your business plan, policies, and data room documents to receive personalized recommendations for your B Corp journey.
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <UploadDropzone
                    onFilesAdd={(files) => {
                      console.log('Files uploaded:', files);
                      // Handle file upload
                    }}
                  />
                </div>
              </section>

              {/* View All Tasks Button */}
              <section className="text-center">
                <Button asChild variant="outline" size="lg" className="px-8 py-3">
                  <Link to={`/business/${currentBusiness.id}/roadmap`}>
                    View All Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </section>

              {/* Benefits Section */}
              <section className="py-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-4">Why Become a B Corporation?</h3>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Join a global movement of companies using business as a force for good
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="text-center p-6 border-2 hover:border-primary/20 transition-colors">
                    <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h4 className="text-xl font-semibold mb-3">Build Trust</h4>
                    <p className="text-muted-foreground">
                      Demonstrate your commitment to purpose and accountability through rigorous third-party verification.
                    </p>
                  </Card>
                  
                  <Card className="text-center p-6 border-2 hover:border-primary/20 transition-colors">
                    <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h4 className="text-xl font-semibold mb-3">Attract Talent</h4>
                    <p className="text-muted-foreground">
                      Top talent increasingly seeks purpose-driven employers. B Corp certification signals your values.
                    </p>
                  </Card>
                  
                  <Card className="text-center p-6 border-2 hover:border-primary/20 transition-colors">
                    <Leaf className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h4 className="text-xl font-semibold mb-3">Drive Impact</h4>
                    <p className="text-muted-foreground">
                      Join 6,000+ companies worldwide committed to balancing profit with positive impact on all stakeholders.
                    </p>
                  </Card>
                </div>
              </section>
            </>
          ) : (
            <EmptyState
              title="Select a Business"
              description="Choose a business from the dropdown above to view its dashboard."
              ctaLabel="Create New Business"
              onCta={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;