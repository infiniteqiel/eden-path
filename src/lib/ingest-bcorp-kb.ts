/**
 * Ingest B Corp Knowledge Base Documents
 * Call the knowledge base processor to ingest parsed documents
 */

import { ingestBCorpDocuments } from './process-knowledge-base';

// Call the function to process the B Corp documents
export async function ingestKnowledgeBase(): Promise<void> {
  try {
    console.log('Starting B Corp Knowledge Base ingestion...');
    await ingestBCorpDocuments();
    console.log('B Corp Knowledge Base ingestion completed successfully');
  } catch (error) {
    console.error('Error during knowledge base ingestion:', error);
    throw error;
  }
}

// Auto-run the ingestion when this module is imported
ingestKnowledgeBase().catch(console.error);