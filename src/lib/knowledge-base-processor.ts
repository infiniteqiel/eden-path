/**
 * Knowledge Base Processing Utilities
 * Handles the ingestion and processing of B Corp documentation
 */

import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeDocument {
  title: string;
  content: string;
  document_type: string;
  impact_area?: string;
  requirement_codes?: string[];
  metadata?: Record<string, any>;
  is_master_document?: boolean;
  source_filename?: string;
}

/**
 * Process B Corp 2026 Standards documents into the knowledge base
 */
export async function processBCorpStandards(documents: {
  filename: string;
  content: string;
}[]): Promise<void> {
  console.log('Processing B Corp 2026 Standards documents...');
  
  const knowledgeDocuments: KnowledgeDocument[] = documents.map(doc => {
    const isMaster = doc.filename.toLowerCase().includes('all.pdf');
    
    // Determine document type and impact area based on filename
    let documentType = 'guidance';
    let impactArea: string | undefined;
    
    if (isMaster) {
      documentType = 'master_standards';
    } else if (doc.filename.toLowerCase().includes('legal')) {
      documentType = 'legal_requirement';
    } else if (doc.filename.toLowerCase().includes('improve')) {
      documentType = 'improvement_guide';
    } else if (doc.filename.toLowerCase().includes('stakeholder')) {
      documentType = 'governance_guide';
      impactArea = 'governance';
    } else if (doc.filename.toLowerCase().includes('ibm')) {
      documentType = 'impact_business_models';
    }
    
    return {
      title: generateDocumentTitle(doc.filename),
      content: doc.content,
      document_type: documentType,
      impact_area: impactArea,
      requirement_codes: extractRequirementCodes(doc.content),
      is_master_document: isMaster,
      source_filename: doc.filename,
      metadata: {
        version: '2026',
        processed_date: new Date().toISOString(),
        content_length: doc.content.length
      }
    };
  });
  
  // Call the knowledge base processing function
  const { error } = await supabase.functions.invoke('process-knowledge-base', {
    body: {
      documents: knowledgeDocuments,
      clearExisting: true // Clear existing to replace with 2026 standards
    }
  });
  
  if (error) {
    console.error('Error processing knowledge base:', error);
    throw new Error(`Failed to process knowledge base: ${error.message}`);
  }
  
  console.log('Successfully processed B Corp 2026 Standards into knowledge base');
}

/**
 * Generate a user-friendly title from filename
 */
function generateDocumentTitle(filename: string): string {
  const baseName = filename.replace('.pdf', '').replace(/_/g, ' ');
  
  const titleMap: Record<string, string> = {
    'all': 'B Lab Standards V2.1 - Official 2026 Standards (Master Document)',
    'UK_B_Corp_Legal_Requirement_2024': 'UK B Corp Legal Requirement Guide 2024',
    'Step_3_Meet_the_B_Corp_legal_requirement': 'Step 3: Meeting the B Corp Legal Requirement',
    'Step_2_Improve_your_Score': 'Step 2: Improving Your B Impact Assessment Score',
    'Updated_stakeholder_governance_guide_APRILpdf': 'Stakeholder Governance Implementation Guide',
    'LTD_Research': 'UK Limited Company B Corp Requirements Research',
    'The_BIA_List_of_IBMS_-_V6': 'Impact Business Models in the B Impact Assessment V6',
    'ImpactAssessmentSupportContext': 'Company Scoping for B Corp Certification'
  };
  
  return titleMap[baseName] || baseName
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract requirement codes from document content
 */
function extractRequirementCodes(content: string): string[] {
  const codes = new Set<string>();
  
  // Common B Corp requirement code patterns
  const patterns = [
    /\b(FR\d+(\.\d+)*)\b/g,  // Foundation Requirements (FR1, FR1.1, etc.)
    /\b(PSG\d+(\.\d+)*)\b/g, // Purpose & Stakeholder Governance
    /\b(FW\d+(\.\d+)*)\b/g,  // Fair Work
    /\b(JEDI\d+(\.\d+)*)\b/g, // Justice, Equity, Diversity & Inclusion
    /\b(HR\d+(\.\d+)*)\b/g,  // Human Rights
    /\b(CA\d+(\.\d+)*)\b/g,  // Climate Action
    /\b(ESC\d+(\.\d+)*)\b/g, // Environmental Stewardship & Circularity
    /\b(GACA\d+(\.\d+)*)\b/g // Government Affairs & Collective Action
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => codes.add(match));
    }
  });
  
  return Array.from(codes);
}

/**
 * Check if knowledge base is populated with 2026 standards
 */
export async function checkKnowledgeBaseStatus(): Promise<{
  hasDocuments: boolean;
  hasMasterDocument: boolean;
  documentCount: number;
  version?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('knowledge_base_documents')
      .select('id, metadata')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error checking knowledge base status:', error);
      return { hasDocuments: false, hasMasterDocument: false, documentCount: 0 };
    }
    
    const documentCount = data?.length || 0;
    const hasMasterDocument = data?.some(doc => 
      doc.metadata && 
      (doc.metadata as any).is_master_document === true
    ) || false;
    
    const version = data?.[0]?.metadata && 
      (data[0].metadata as any).version || undefined;
    
    return {
      hasDocuments: documentCount > 0,
      hasMasterDocument,
      documentCount,
      version
    };
  } catch (error) {
    console.error('Error checking knowledge base:', error);
    return { hasDocuments: false, hasMasterDocument: false, documentCount: 0 };
  }
}