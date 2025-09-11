/**
 * Enhanced BCpath Homepage
 * 
 * Modern homepage with hero image, enhanced visuals, and B Corp messaging
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Shield, Users, TrendingUp, MessageCircle, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { BroadChat } from '@/components/broad-chat';
import { CompanyCreationModal } from '@/components/company-creation-modal';
import { UploadDropzone } from '@/components/upload-dropzone';
import { BusinessSwitcher } from '@/components/business-switcher';
import { ImpactCard } from '@/components/impact-card';
import { useAuthStore } from '@/store/auth';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';
import { useAnalysisStore } from '@/store/analysis';
import { Business } from '@/domain/data-contracts';
import heroImage from '@/assets/hero-utopia.jpg';

interface BCorpBenefit {
  icon: typeof Shield;
  title: string;
  description: string;
  color: string;
}

export default function EnhancedIndex() {
  const { user } = useAuthStore();
  const { businesses, currentBusiness, loadBusinesses, selectBusiness } = useBusinessStore();
  const { uploadFile } = useDataroomStore();
  const { impactSummaries, loadImpactSummaries } = useAnalysisStore();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadBusinesses();
    }
  }, [user, loadBusinesses]);

  // Load impact summaries when business changes
  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries]);

  // Show company creation modal for first-time users
  useEffect(() => {
    if (user && businesses.length === 0) {
      setShowCompanyModal(true);
    }
  }, [user, businesses.length]);

  const handleBusinessChange = (business: Business) => {
    selectBusiness(business.id);
  };

  const handleUploadFiles = (files: File[]) => {
    if (currentBusiness) {
      files.forEach(file => {
        uploadFile(currentBusiness.id, file);
      });
    }
  };

  const bCorpBenefits: BCorpBenefit[] = [
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Protect your mission through legal requirements that balance profit with purpose",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Stakeholder Trust", 
      description: "Build trust with customers, employees, and investors through verified impact",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Competitive Edge",
      description: "Differentiate in the marketplace and attract purpose-driven talent and customers",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <AppHeader mode={user ? "auth" : "public"} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-[85vh] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-4xl text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                Welcome to Your B Corp Journey
              </h1>
              <p className="text-xl md:text-2xl mb-4 animate-fade-in [animation-delay:0.3s]">
                Transform your business into a force for good. Track your progress toward 
                B Corporation certification with our comprehensive readiness platform.
              </p>
              <div className="text-center animate-fade-in [animation-delay:0.6s] mb-8">
                <p className="text-lg md:text-xl font-semibold">
                  Take B Corp steps from Month 0 of the Idea stage and Beyond
                </p>
              </div>

              {/* Business Switcher and Impact Cards in Header (for authenticated users) */}
              {user && businesses.length > 0 && (
                <div className="animate-fade-in [animation-delay:0.7s] space-y-6">
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <BusinessSwitcher 
                      businesses={businesses}
                      currentBusiness={currentBusiness}
                      onBusinessChange={handleBusinessChange}
                    />
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      variant="outline"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      Go to Dashboard
                    </Button>
                  </div>

                  {/* Impact Cards in Header */}
                  {impactSummaries.length > 0 && (
                    <div className="grid grid-cols-5 gap-3">
                      {impactSummaries.map((summary, index) => (
                        <ImpactCardSmall
                          key={summary.impact}
                          summary={summary}
                          onViewTasks={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {!user && (
                <div className="mt-8 animate-fade-in [animation-delay:0.9s]">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90"
                    asChild
                  >
                    <Link to="/auth/signup">Start Your Journey</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Waves Bottom Border */}
          <div className="absolute bottom-0 w-full">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                    fill="hsl(var(--background))" 
                    className="opacity-90"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {user ? (
          <AuthenticatedContent 
            currentBusiness={currentBusiness}
            businesses={businesses}
            onUploadFiles={handleUploadFiles}
            onCreateCompany={() => setShowCompanyModal(true)}
            navigate={navigate}
            impactSummaries={impactSummaries}
          />
        ) : (
          <PublicContent benefits={bCorpBenefits} />
        )}
      </section>

      {/* Company Creation Modal */}
      <CompanyCreationModal 
        open={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
      />
    </div>
  );
}

// Small Impact Card Component for Header
function ImpactCardSmall({ summary, onViewTasks, delay }: { 
  summary: any; 
  onViewTasks: () => void; 
  delay: number; 
}) {
  const impactColors = {
    Governance: 'text-blue-400',
    Workers: 'text-purple-400', 
    Community: 'text-orange-400',
    Environment: 'text-green-400',
    Customers: 'text-indigo-400'
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-fade-in cursor-pointer hover:bg-white/20 transition-all"
      style={{ animationDelay: `${delay}s` }}
      onClick={onViewTasks}
    >
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 ${impactColors[summary.impact]}`}>
          {summary.pct}%
        </div>
        <div className="text-xs text-white/90 mb-2">{summary.impact}</div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-500" 
            style={{ width: `${summary.pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Authenticated user content
function AuthenticatedContent({ 
  currentBusiness, 
  businesses, 
  onUploadFiles,
  onCreateCompany,
  navigate,
  impactSummaries 
}: {
  currentBusiness: any;
  businesses: any[];
  onUploadFiles: (files: File[]) => void;
  onCreateCompany: () => void;
  navigate: (path: string) => void;
  impactSummaries: any[];
}) {
  if (businesses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Welcome to BCpath!</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <CardContent className="text-center">
              <Plus className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-4">Add a Company</h3>
              <p className="text-muted-foreground mb-6">
                Create your company profile to start your B Corp journey
              </p>
              <Button onClick={onCreateCompany} className="w-full">
                Create Company Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card className="p-8">
            <CardContent className="text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
              <p className="text-muted-foreground mb-6">
                Upload your business documents to analyze B Corp readiness
              </p>
              <UploadDropzone onFilesAdd={onUploadFiles} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Impact Cards Section - Using Real Data */}
      {impactSummaries.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">
            Your B Corp Progress Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {impactSummaries.map((summary, index) => (
              <div key={summary.impact} className={`animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <ImpactCard
                  summary={summary}
                  onViewTasks={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {/* Upload Area */}
        <Card className="animate-fade-in [animation-delay:0.6s]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Documents
              {currentBusiness && (
                <span className="text-sm text-muted-foreground">
                  for {currentBusiness.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UploadDropzone onFilesAdd={onUploadFiles} />
            
            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Broad Chat */}
        <div className="animate-fade-in [animation-delay:0.7s]">
          <BroadChat 
            className="h-[400px]"
            impactSummaries={impactSummaries.filter(s => s.impact !== 'Other')}
            todos={impactSummaries.reduce((acc, summary) => {
              // Generate skeletal task data for each impact area for the chat to reference
              const areaPercentage = summary.pct;
              const tasksNeeded = Math.max(1, Math.floor((100 - areaPercentage) / 20));
              
              const skeletalTasks = Array.from({ length: tasksNeeded }, (_, i) => ({
                id: `${summary.impact}-task-${i}`,
                title: `${summary.impact} improvement task ${i + 1}`,
                impact: summary.impact as any,
                status: 'todo' as const,
                priority: i === 0 ? 'P1' : i === 1 ? 'P2' : 'P3' as const,
                description: `Key task to improve ${summary.impact} readiness`,
                category: summary.impact.toLowerCase() as any,
                estimated_hours: 2,
                business_id: currentBusiness?.id || ''
              }));
              
              return acc.concat(skeletalTasks);
            }, [] as any[])}
          />
        </div>
      </div>
        </div>
      </div>

      {/* Enhanced B Corp Information */}
      <div className="mt-16 space-y-16">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose B Corporation Certification?
          </h2>
          <BCorpBenefitsSection />
        </div>

        {/* Additional B Corp Movement Information */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/20 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Join the UK B Corp Movement</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/80 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary mb-2">4,000+</div>
                <p className="text-muted-foreground">Global B Corps across 80+ countries</p>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary mb-2">51%</div>
                <p className="text-muted-foreground">UK awareness of B Corp certification</p>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary mb-2">2026</div>
                <p className="text-muted-foreground">New enhanced standards raising the bar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional B Corp Content Sections */}
        <BCorporationContentSections />
      </div>
    </div>
  );
}
}

// Additional B Corp Content Sections
function BCorporationContentSections() {
  return (
    <div className="space-y-16">
      {/* Section 1: B Corp Standards */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold">The New 2026 Standards</h3>
          <p className="text-lg text-muted-foreground">
            B Lab's enhanced standards raise the bar for sustainable business practices. 
            Companies must now demonstrate deeper impact across all five areas: Governance, 
            Workers, Community, Environment, and Customers.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">Stricter verification processes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">Enhanced transparency requirements</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">Deeper stakeholder engagement</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
          <div className="text-6xl font-bold text-primary mb-4">2026</div>
          <p className="text-lg font-semibold">New Standards Era</p>
          <p className="text-sm text-muted-foreground mt-2">
            Higher impact, greater accountability
          </p>
        </div>
      </div>

      {/* Section 2: Business Benefits */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 order-2 md:order-1">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">28%</div>
              <p className="text-xs text-muted-foreground">Higher employee retention</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">73%</div>
              <p className="text-xs text-muted-foreground">Attract top talent</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50%</div>
              <p className="text-xs text-muted-foreground">Faster revenue growth</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">63%</div>
              <p className="text-xs text-muted-foreground">Customer loyalty increase</p>
            </div>
          </div>
        </div>
        <div className="space-y-6 order-1 md:order-2">
          <h3 className="text-3xl font-bold">Proven Business Impact</h3>
          <p className="text-lg text-muted-foreground">
            B Corps don't just do good - they perform better. Research shows certified 
            B Corporations outperform their peers across key business metrics while 
            creating positive social and environmental impact.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth/signup">Measure Your Impact</Link>
          </Button>
        </div>
      </div>

      {/* Section 3: UK Movement */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/10 rounded-2xl p-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-6">The UK B Corp Community</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join a growing community of UK businesses leading the way in sustainable business practices. 
            From startups to established enterprises, B Corps are reshaping the economy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center bg-white/60 rounded-lg p-6">
            <div className="text-2xl font-bold text-primary mb-2">500+</div>
            <p className="text-sm font-medium mb-1">UK B Corps</p>
            <p className="text-xs text-muted-foreground">And growing rapidly</p>
          </div>
          <div className="text-center bg-white/60 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">£15B+</div>
            <p className="text-sm font-medium mb-1">Combined Revenue</p>
            <p className="text-xs text-muted-foreground">UK B Corp collective</p>
          </div>
          <div className="text-center bg-white/60 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
            <p className="text-sm font-medium mb-1">Would Recommend</p>
            <p className="text-xs text-muted-foreground">B Corp certification</p>
          </div>
          <div className="text-center bg-white/60 rounded-lg p-6">
            <div className="text-2xl font-bold text-purple-600 mb-2">12x</div>
            <p className="text-sm font-medium mb-1">More Likely</p>
            <p className="text-xs text-muted-foreground">To prioritize purpose</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Public (non-authenticated) content
function PublicContent({ benefits }: { benefits: BCorpBenefit[] }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6">
          The B Corp Movement
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join over 4,000 companies across 80+ countries that are redefining success in business. 
          B Corporations are companies that balance profit with purpose, creating positive impact 
          for all stakeholders.
        </p>
      </div>

      <BCorpBenefitsSection benefits={benefits} />

      {/* Additional content for public users */}
      <BCorporationContentSections />

      <div className="text-center mt-16">
        <Button size="lg" asChild>
          <Link to="/auth/signup">Start Your B Corp Journey</Link>
        </Button>
      </div>
    </div>
  );
}

// Benefits section with animations
function BCorpBenefitsSection({ benefits }: { benefits?: BCorpBenefit[] }) {
  const defaultBenefits: BCorpBenefit[] = [
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Protect your mission through legal requirements that balance profit with purpose",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Stakeholder Trust", 
      description: "Build trust with customers, employees, and investors through verified impact",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Competitive Edge",
      description: "Differentiate in the marketplace and attract purpose-driven talent and customers",
      color: "text-purple-600"
    }
  ];

  const bCorpBenefits = benefits || defaultBenefits;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {bCorpBenefits.map((benefit, index) => (
        <Card 
          key={benefit.title}
          className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <CardContent className="p-8 text-center">
            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
              <benefit.icon className={`w-16 h-16 mx-auto ${benefit.color}`} />
            </div>
            <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}