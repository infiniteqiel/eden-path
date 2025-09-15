import React, { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { KnowledgeBaseUpload } from '@/components/knowledge-base-upload';
import { BCorp2026IngestionButton } from '@/components/bcorp-standards-ingestion-button';
import { BookOpen, FileText, Shield } from 'lucide-react';

export default function KnowledgeBase() {
  const [parsedDocuments, setParsedDocuments] = useState<Record<string, string>>({});

  // Simulate the parsed documents from the user uploads
  React.useEffect(() => {
    // This would be populated from the actual document parsing results
    // For now, we'll simulate it
    const mockParsedDocs = {
      'all.pdf': 'B Lab Standards V2.1 content...',
      'UK_B_Corp_Legal_Requirement_2024.pdf': 'Legal requirement content...',
      'Step_2_Improve_your_Score.pdf': 'Score improvement content...',
      'Step_3_Meet_the_B_Corp_legal_requirement.pdf': 'Legal requirement steps...',
      'Updated_stakeholder_governance_guide_APRILpdf.pdf': 'Governance guide content...',
      'LTD_Research.pdf': 'LTD research content...',
      'The_BIA_List_of_IBMS_-_V6.pdf': 'Impact business models...',
      'ImpactAssessmentSupportContext.pdf': 'Assessment support content...'
    };
    setParsedDocuments(mockParsedDocs);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader mode="auth" />
          
          {/* Page Header */}
          <div className="border-b border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <h1 className="font-semibold">Knowledge Base Management</h1>
              </div>
            </div>
          </div>
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">B Corp 2026 Standards Knowledge Base</h2>
                <p className="text-muted-foreground">
                  Upload and process B Corp documentation to power AI-driven analysis and recommendations
                </p>
              </div>

              {/* Upload Section */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Upload B Corp Documentation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload the B Corp 2026 Standards PDF files. The "all.pdf" file will be treated as the master reference document.
                  </p>
                  <KnowledgeBaseUpload />
                </div>
              </Card>

              {/* Processing Section */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Process Standards into Knowledge Base</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Process the uploaded documents into the AI knowledge base for analysis and task generation.
                  </p>
                  <BCorp2026IngestionButton 
                    parsedDocuments={parsedDocuments}
                    onComplete={() => {
                      // Refresh status or navigate
                      console.log('Knowledge base processing complete');
                    }}
                  />
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}