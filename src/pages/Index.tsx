import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { FileText, CheckSquare, Scale, ArrowRight } from "lucide-react";

const Index = () => {
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
