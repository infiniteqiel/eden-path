import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { ImpactCard } from "@/components/impact-card";
import { UploadDropzone } from "@/components/upload-dropzone";
import { BusinessSwitcher } from "@/components/business-switcher";
import { useAuthStore } from "@/store/auth";
import { useBusinessStore } from "@/store/business";
import { useAnalysisStore } from "@/store/analysis";
import { useDataroomStore } from "@/store/dataroom";
import { FileText, CheckSquare, Scale, ArrowRight, Shield, Users, Target, Building, Leaf } from "lucide-react";
import { useEffect } from "react";
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';
import legalProtectionImage from '@/assets/legal-protection-singapore.jpg';
import stakeholderTrustImage from '@/assets/stakeholder-trust-singapore.jpg';
import competitiveEdgeImage from '@/assets/competitive-edge-singapore.jpg';

const Index = () => {
  const navigate = useNavigate();
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
        
        {/* Hero Section with Background Image */}
        <div 
          className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border-b overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url(${singaporeCityscape})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Welcome to Your B Corp Journey,{" "}
                <span className="text-primary">the simple way</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Transform your business into a force for good. Track your progress toward B Corporation certification with our comprehensive readiness platform.
              </p>
              {businesses.length > 0 && (
                <div className="inline-block">
                  <BusinessSwitcher
                    businesses={businesses}
                    currentBusiness={currentBusiness}
                    onBusinessChange={(business) => selectBusiness(business.id)}
                  />
                </div>
              )}
            </div>

            {/* Progress Overview on Hero */}
            {currentBusiness && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Your Progress Overview</h3>
                  <Button asChild variant="outline">
                    <Link to="/dashboard">
                      View Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                 {/* Impact Cards - 3 then 2 layout */}
                <div className="space-y-6">
                  {/* First row - 3 cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                    {impactSummaries.slice(0, 3).map((summary) => (
                      <div 
                        key={summary.impact} 
                        className="w-full max-w-sm cursor-pointer transform hover:scale-105 transition-transform duration-200"
                        onClick={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                      >
                        <ImpactCard
                          summary={summary}
                          onViewTasks={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Second row - 2 cards centered */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center max-w-2xl mx-auto">
                    {impactSummaries.slice(3, 5).map((summary) => (
                      <div 
                        key={summary.impact} 
                        className="w-full max-w-sm cursor-pointer transform hover:scale-105 transition-transform duration-200"
                        onClick={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                      >
                        <ImpactCard
                          summary={summary}
                          onViewTasks={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-12">
          <div className="space-y-16">
            {currentBusiness && (
              <>
                {/* Upload Documents */}
                <section className="bg-muted/30 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Upload Your Business Documents</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Share your business plan, policies, and data room documents to receive personalized recommendations for your B Corp journey.
                    </p>
                  </div>
                  <div className="max-w-3xl mx-auto">
                    <UploadDropzone onFilesAdd={handleUpload} />
                  </div>
                </section>

                {/* Enhanced B-Corp Benefits with Images */}
                <section className="py-12">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">Why Become a B Corporation?</h3>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      Join a global movement of companies using business as a force for good
                    </p>
                  </div>
                  
                  <div className="space-y-16">
                    {/* Legal Protection */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div 
                        className="relative h-80 rounded-2xl overflow-hidden"
                        style={{
                          backgroundImage: `url(${legalProtectionImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                      </div>
                      <div>
                        <div className="flex items-center mb-4">
                          <Shield className="h-8 w-8 text-primary mr-3" />
                          <h4 className="text-2xl font-bold">Legal Protection</h4>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">
                          B Corp certification provides legal protection through mission lock clauses in your Articles of Association. This ensures your company's purpose cannot be compromised by future ownership changes or investor pressure.
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Protected mission and values
                          </li>
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Legal framework for stakeholder governance
                          </li>
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Long-term purpose preservation
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Stakeholder Trust */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="lg:order-2">
                        <div 
                          className="relative h-80 rounded-2xl overflow-hidden"
                          style={{
                            backgroundImage: `url(${stakeholderTrustImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                        </div>
                      </div>
                      <div className="lg:order-1">
                        <div className="flex items-center mb-4">
                          <Users className="h-8 w-8 text-primary mr-3" />
                          <h4 className="text-2xl font-bold">Stakeholder Trust</h4>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">
                          Build unparalleled trust with all stakeholders through rigorous third-party verification. B Corp certification demonstrates genuine commitment to social and environmental performance.
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Enhanced customer loyalty and trust
                          </li>
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Increased employee engagement
                          </li>
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Improved investor confidence
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Competitive Edge */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div 
                        className="relative h-80 rounded-2xl overflow-hidden"
                        style={{
                          backgroundImage: `url(${competitiveEdgeImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                      </div>
                      <div>
                        <div className="flex items-center mb-4">
                          <Target className="h-8 w-8 text-primary mr-3" />
                          <h4 className="text-2xl font-bold">Competitive Edge</h4>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">
                          Stand out in the marketplace with verified impact credentials. B Corp certification differentiates your business and opens new opportunities with conscious consumers and partners.
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Market differentiation and premium positioning
                          </li>
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Access to B Corp community and networks
                          </li>
                          <li className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            Attraction of top talent and conscious consumers
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Statistics Section */}
                <section className="bg-primary/5 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
                    <p className="text-muted-foreground">B Corps are leading the way toward a more inclusive and sustainable economy</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">6,000+</div>
                      <p className="text-muted-foreground">Certified B Corps worldwide</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">80+</div>
                      <p className="text-muted-foreground">Countries represented</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">150+</div>
                      <p className="text-muted-foreground">Industries covered</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">300K+</div>
                      <p className="text-muted-foreground">Workers employed</p>
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
