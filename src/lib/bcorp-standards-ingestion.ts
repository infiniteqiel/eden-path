/**
 * B Corp 2026 Standards Ingestion
 * Processes the uploaded B Corp documentation into the knowledge base
 */

import { processBCorpStandards } from './knowledge-base-processor';

// B Corp 2026 Standards content mapping
const BCORP_DOCUMENTS = [
  {
    filename: 'all.pdf',
    title: 'B Lab Standards V2.1 - Official 2026 Standards (Master Document)',
    isMaster: true
  },
  {
    filename: 'ImpactAssessmentSupportContext.pdf',
    title: 'Company Scoping for B Corp Certification',
    isMaster: false
  },
  {
    filename: 'The_BIA_List_of_IBMS_-_V6.pdf',
    title: 'Impact Business Models in the B Impact Assessment V6',
    isMaster: false
  },
  {
    filename: 'LTD_Research.pdf',
    title: 'UK Limited Company B Corp Requirements Research',
    isMaster: false
  },
  {
    filename: 'Step_2_Improve_your_Score.pdf',
    title: 'Step 2: Improving Your B Impact Assessment Score',
    isMaster: false
  },
  {
    filename: 'Updated_stakeholder_governance_guide_APRILpdf.pdf',
    title: 'Stakeholder Governance Implementation Guide',
    isMaster: false
  },
  {
    filename: 'Step_3_Meet_the_B_Corp_legal_requirement.pdf',
    title: 'Step 3: Meeting the B Corp Legal Requirement',
    isMaster: false
  },
  {
    filename: 'UK_B_Corp_Legal_Requirement_2024.pdf',
    title: 'UK B Corp Legal Requirement Guide 2024',
    isMaster: false
  }
];

/**
 * Ingest the B Corp 2026 Standards from parsed documents
 */
export async function ingestBCorp2026Standards(
  parsedDocuments: Record<string, string>
): Promise<void> {
  console.log('Ingesting B Corp 2026 Standards...');
  
  const documentsToProcess = BCORP_DOCUMENTS
    .filter(doc => parsedDocuments[doc.filename])
    .map(doc => ({
      filename: doc.filename,
      content: parsedDocuments[doc.filename]
    }));
  
  if (documentsToProcess.length === 0) {
    throw new Error('No B Corp documents found to process');
  }
  
  // Verify master document is present
  const hasMaster = documentsToProcess.some(doc => 
    doc.filename.toLowerCase().includes('all.pdf')
  );
  
  if (!hasMaster) {
    console.warn('Master document (all.pdf) not found in upload');
  }
  
  await processBCorpStandards(documentsToProcess);
  
  console.log(`Successfully ingested ${documentsToProcess.length} B Corp 2026 Standards documents`);
  console.log('Documents processed:', documentsToProcess.map(d => d.filename));
}