import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppHeader, MissionSnippet } from "@/components/app-header";
import { ImpactCard } from "@/components/impact-card";
import { UploadDropzone } from "@/components/upload-dropzone";
import { BusinessSwitcher } from "@/components/business-switcher";
import { useAuthStore } from "@/store/auth";
import { useBusinessStore } from "@/store/business";
import { useAnalysisStore } from "@/store/analysis";
import { useDataroomStore } from "@/store/dataroom";
import { FileText, CheckSquare, Scale, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuthStore();
  const { businesses, currentBusiness, loadBusinesses, selectBusiness } = useBusinessStore();
  const { impactSummaries, loadImpactSummaries } = useAnalysisStore();
  const { uploadFile } = useDataroomStore();

  useEffect(() => {
    if (user) {
      loadBusinesses();
    }
  }, [user, loadBusinesses]);

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries]);

  const handleUpload = async (files: File[]) => {
    if (currentBusiness) {
      // Upload files one by one
      for (const file of files) {
        await uploadFile(currentBusiness.id, file);
      }
    }
  };

  // If user is authenticated, show the authenticated home page
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader mode="auth" />
        
        {/* Hero Section with Business Info */}
        <div className="bg-muted/50 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                  Get B-Corp Ready,{" "}
                  <span className="text-primary">the simple way</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  A UK-only, document-first platform that guides your startup through B Corporation certification
                </p>
              </div>
              {businesses.length > 0 && (
                <div className="flex-shrink-0">
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
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.email}</h2>
              <p className="text-muted-foreground">Here's a quick glimpse of your B-Corp journey progress</p>
            </div>

            {currentBusiness && (
              <>
                {/* Progress Overview */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Progress Overview</h3>
                    <Button asChild variant="outline">
                      <Link to="/dashboard">
                        View Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {impactSummaries.map((summary) => (
                      <ImpactCard
                        key={summary.impact}
                        summary={summary}
                        onViewTasks={() => {}} // Quick view only
                      />
                    ))}
                  </div>
                </section>

                {/* Upload Documents */}
                <section>
                  <h3 className="text-xl font-semibold mb-6">Upload Any Documents</h3>
                  <UploadDropzone onFilesAdd={handleUpload} />
                </section>

                {/* Key Benefits */}
                <section className="bg-muted/30 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Why Choose B-Corp Certification?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scale className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Legal Protection</h4>
                      <p className="text-sm text-muted-foreground">Mission lock protects your company's purpose</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckSquare className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Stakeholder Trust</h4>
                      <p className="text-sm text-muted-foreground">Build trust with customers, employees, and investors</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Competitive Edge</h4>
                      <p className="text-sm text-muted-foreground">Stand out in the market with verified impact</p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Public home page
  return (
    <div className="min-h-screen bg-background">
      <AppHeader mode="public" />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Get B-Corp Ready,{" "}
            <span className="text-primary">the simple way</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A UK-only, document-first platform that guides your startup through B Corporation 
            certification with clear actions, legal guidance, and progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/auth/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Document-First Approach</h3>
            <p className="text-muted-foreground">
              Upload your existing business documents and let our AI analyze your current B Corp 
              readiness across all five impact areas.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Clear Action Items</h3>
            <p className="text-muted-foreground">
              Get prioritized to-do lists with specific actions for Governance, Workers, 
              Community, Environment, and Customer impact areas.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">UK Legal Guidance</h3>
            <p className="text-muted-foreground">
              Step-by-step legal guidance for UK mission lock requirements, including 
              Articles of Association updates and Companies House filings.
            </p>
          </Card>
        </div>

        {/* How it Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How it works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="font-semibold mb-2">Upload Documents</h4>
                <p className="text-sm text-muted-foreground">Add your business documents to create a comprehensive data room</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">Our AI analyzes your readiness across all B Corp impact areas</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="font-semibold mb-2">Get Your Roadmap</h4>
                <p className="text-sm text-muted-foreground">Receive prioritized action items and progress tracking</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  4
                </div>
                <h4 className="font-semibold mb-2">Legal Compliance</h4>
                <p className="text-sm text-muted-foreground">Complete UK legal requirements with guided templates</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to start your B Corp journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join forward-thinking UK businesses that are building sustainable, 
            stakeholder-focused companies.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link to="/auth/signup">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
