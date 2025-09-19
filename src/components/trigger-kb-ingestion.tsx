/**
 * Trigger Knowledge Base Ingestion Component
 * Simple component to trigger KB ingestion
 */

import React, { useEffect } from 'react';

export function TriggerKBIngestion() {
  useEffect(() => {
    const ingestKB = async () => {
      try {
        console.log('Triggering KB ingestion...');
        await import('@/lib/ingest-kb-now');
        console.log('KB ingestion triggered successfully');
      } catch (error) {
        console.error('Error triggering KB ingestion:', error);
      }
    };
    
    ingestKB();
  }, []);

  return null; // This is just a trigger component
}