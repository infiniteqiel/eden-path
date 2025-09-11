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
import { useAuthStore } from '@/store/auth';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';
import heroImage from '@/assets/hero-utopia.jpg';

interface BCorpBenefit {
  icon: typeof Shield;
  title: string;
  description: string;
  color: string;
}

export default function EnhancedIndex() {
  const { user } = useAuthStore();
  const { businesses, currentBusiness, loadBusinesses } = useBusinessStore();
  const { uploadFile } = useDataroomStore();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadBusinesses();
    }
  }, [user, loadBusinesses]);

  // Show company creation modal for first-time users
  useEffect(() => {
    if (user && businesses.length === 0) {
      setShowCompanyModal(true);
    }
  }, [user, businesses.length]);

  const handleBusinessChange = (businessId: string) => {
    // Stay on homepage when business is changed
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
          className="h-[70vh] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                Welcome to Your B Corp Journey
              </h1>
              <p className="text-xl md:text-2xl mb-4 animate-fade-in [animation-delay:0.3s]">
                Transform your business into a force for good. Track your progress toward 
                B Corporation certification with our comprehensive readiness platform.
              </p>
              <div className="text-center animate-fade-in [animation-delay:0.6s]">
                <p className="text-lg md:text-xl font-semibold">
                  Take B Corp steps from Month 0 of the Idea stage and Beyond
                </p>
              </div>
              
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

// Authenticated user content
function AuthenticatedContent({ 
  currentBusiness, 
  businesses, 
  onUploadFiles,
  onCreateCompany,
  navigate 
}: {
  currentBusiness: any;
  businesses: any[];
  onUploadFiles: (files: File[]) => void;
  onCreateCompany: () => void;
  navigate: (path: string) => void;
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
      {/* Business Switcher */}
      <div className="mb-8">
        <BusinessSwitcher 
          businesses={businesses}
          currentBusiness={currentBusiness}
          onBusinessChange={() => {}} 
        />
      </div>

      {/* Impact Cards Section - Moved to Top */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">
          Your B Corp Progress Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Mock Impact Cards with actual data when available */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in [animation-delay:0.1s]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-blue-600" />
                Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full bg-secondary rounded-full h-2 mb-3">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Mission & stakeholder governance</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/impact/governance')}
                className="w-full text-xs"
              >
                View Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in [animation-delay:0.2s]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                Workers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full bg-secondary rounded-full h-2 mb-3">
                <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Employee benefits & culture</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/impact/workers')}
                className="w-full text-xs"
              >
                View Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in [animation-delay:0.3s]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-orange-600" />
                Community  
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full bg-secondary rounded-full h-2 mb-3">
                <div className="bg-orange-600 h-2 rounded-full transition-all duration-500" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Local impact & supply chain</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/impact/community')}
                className="w-full text-xs"
              >
                View Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in [animation-delay:0.4s]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full bg-secondary rounded-full h-2 mb-3">
                <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Environmental practices</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/impact/environment')}
                className="w-full text-xs"
              >
                View Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in [animation-delay:0.5s]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full bg-secondary rounded-full h-2 mb-3">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Customer impact & welfare</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/impact/customers')}
                className="w-full text-xs"
              >
                View Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
          <BroadChat />
        </div>
      </div>

      {/* Animated Benefits */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose B Corporation Certification?
        </h2>
        <BCorpBenefitsSection />
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