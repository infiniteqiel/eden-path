/**
 * About Page
 * 
 * Explains B Corps and UK context with FAQ section.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, Building, Users, Leaf, Heart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader mode="public" />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            What is a B Corporation?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            B Corporations are a global movement of companies using business as a force for good. 
            They balance profit with purpose, creating value for all stakeholders — not just shareholders.
          </p>
        </div>

        {/* B Corp Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          <Card className="p-6 text-center">
            <Building className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Governance</h3>
            <p className="text-sm text-muted-foreground">
              Transparent, accountable leadership structures
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Workers</h3>
            <p className="text-sm text-muted-foreground">
              Fair wages, benefits, and inclusive workplaces
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Positive local and social impact initiatives
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Leaf className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Environment</h3>
            <p className="text-sm text-muted-foreground">
              Sustainable practices and environmental stewardship
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Customers</h3>
            <p className="text-sm text-muted-foreground">
              Quality products and services that benefit consumers
            </p>
          </Card>
        </div>

        {/* UK Context */}
        <div className="bg-muted rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">B Corps in the UK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-muted-foreground mb-4">
                The UK has one of the fastest-growing B Corp communities globally, with over 1,000 
                certified companies. UK B Corps must meet specific legal requirements, including 
                "mission lock" provisions in their Articles of Association.
              </p>
              <p className="text-muted-foreground">
                This legal protection ensures that the company's commitment to social and environmental 
                impact cannot be easily changed, even if ownership changes.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6">
              <h4 className="font-semibold mb-3">Key UK Requirements:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mission lock in Articles of Association</li>
                <li>• Special resolution (75% vote) to adopt changes</li>
                <li>• Filing with Companies House</li>
                <li>• Annual benefit reporting</li>
                <li>• Third-party impact assessment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="eligibility">
              <AccordionTrigger>What makes a UK company eligible for B Corp certification?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  UK companies must operate for at least 12 months before applying and meet specific 
                  legal form requirements. Most Ltd companies, LLPs, and Community Interest Companies 
                  are eligible.
                </p>
                <p>
                  The company must score at least 80 points on the B Impact Assessment and complete 
                  the UK-specific legal requirements, including mission lock provisions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="timeline">
              <AccordionTrigger>How long does the B Corp certification process take?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  The typical timeline is 6-18 months, depending on your starting point and how 
                  quickly you can implement required changes.
                </p>
                <p>
                  Using bcstart.ai, many companies reduce this timeline by 3-6 months through 
                  better preparation and clear action planning.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="scoring">
              <AccordionTrigger>Does bcstart.ai provide B Corp scoring?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  No, bcstart.ai focuses on readiness preparation rather than scoring. Only B Lab 
                  can provide official B Impact Assessment scores.
                </p>
                <p>
                  We help you identify gaps, implement best practices, and organize documentation 
                  so you're fully prepared for the official assessment process.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cost">
              <AccordionTrigger>What are the costs involved in B Corp certification?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  B Lab charges annual certification fees based on company revenue (typically £500-£25,000 annually). 
                  Additional costs may include legal fees for Articles amendments and consultant fees if needed.
                </p>
                <p>
                  bcstart.ai helps minimize consultant costs by providing guided preparation and 
                  clear action plans for most requirements.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maintenance">
              <AccordionTrigger>What happens after certification?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Certified B Corps must recertify every three years and submit annual reports. 
                  The ongoing process ensures continuous improvement in impact performance.
                </p>
                <p>
                  Many companies find the framework valuable for ongoing strategic planning and 
                  stakeholder engagement, not just certification compliance.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 border border-primary/20 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Ready to explore B Corp readiness?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start by uploading your business documents and see where your company stands 
            across the five B Corp impact areas.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth/signup">
              Start Your Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default About;