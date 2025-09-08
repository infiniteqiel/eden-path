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
import { Upload, FileText, ArrowRight, Building, Leaf, Users, Shield, Handshake, Trophy } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';
import legalProtectionImage from '@/assets/legal-protection-singapore.jpg';
import stakeholderTrustImage from '@/assets/stakeholder-trust-singapore.jpg';
import competitiveEdgeImage from '@/assets/competitive-edge-singapore.jpg';

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

              {/* Benefits Section - Enhanced with Singapore images and detailed info */}
              <section className="py-16">
                <div className="text-center mb-16">
                  <h3 className="text-4xl font-bold mb-6">Why Become a B Corporation?</h3>
                  <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                    Join over 6,000 companies worldwide using business as a force for good. B Corp certification provides measurable benefits across legal protection, stakeholder relationships, and competitive positioning.
                  </p>
                </div>
                
                <div className="space-y-20">
                  {/* Legal Protection Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Shield className="h-10 w-10 text-primary" />
                        <h4 className="text-3xl font-bold">Legal Protection</h4>
                      </div>
                      <div className="space-y-4 text-lg">
                        <p className="text-muted-foreground leading-relaxed">
                          B Corp status provides robust legal protection through stakeholder governance structures that shield directors from shareholder lawsuits when considering broader impacts.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Protected decision-making for environmental and social initiatives</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Legal framework supporting long-term stakeholder value over short-term profits</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Fiduciary duty expansion to include all stakeholders, not just shareholders</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Constitutional protection against mission drift during investment or acquisition</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="relative">
                      <div 
                        className="rounded-2xl h-80 bg-cover bg-center shadow-2xl"
                        style={{
                          backgroundImage: `url(${legalProtectionImage})`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stakeholder Trust Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 lg:order-1">
                      <div 
                        className="rounded-2xl h-80 bg-cover bg-center shadow-2xl"
                        style={{
                          backgroundImage: `url(${stakeholderTrustImage})`,
                        }}
                      />
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                      <div className="flex items-center gap-4 mb-6">
                        <Handshake className="h-10 w-10 text-primary" />
                        <h4 className="text-3xl font-bold">Stakeholder Trust</h4>
                      </div>
                      <div className="space-y-4 text-lg">
                        <p className="text-muted-foreground leading-relaxed">
                          Build unparalleled trust with customers, employees, investors, and communities through third-party verification of your social and environmental performance.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>73% of consumers willing to pay more for sustainable products from B Corps</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Enhanced employee engagement and 40% lower turnover rates</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Preferred partner status with impact-focused investors and suppliers</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Community recognition as a leader in responsible business practices</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Competitive Edge Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Trophy className="h-10 w-10 text-primary" />
                        <h4 className="text-3xl font-bold">Competitive Edge</h4>
                      </div>
                      <div className="space-y-4 text-lg">
                        <p className="text-muted-foreground leading-relaxed">
                          Differentiate your business in crowded markets through verified commitment to positive impact, attracting conscious consumers and top talent.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Access to $150+ billion in impact investment capital globally</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Premium positioning in procurement processes for large corporations</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Measurable performance improvements across operational metrics</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                            <span>Future-proofing against increasing ESG regulations and requirements</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="relative">
                      <div 
                        className="rounded-2xl h-80 bg-cover bg-center shadow-2xl"
                        style={{
                          backgroundImage: `url(${competitiveEdgeImage})`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16 p-8 bg-primary/5 rounded-2xl">
                  <h4 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h4>
                  <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Upload your business documents to receive a personalized roadmap toward B Corp certification and join the global movement of purpose-driven companies.
                  </p>
                  <Button size="lg" className="px-8 py-3">
                    Start Your B Corp Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
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