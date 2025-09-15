/**
 * B Corp 2026 Standards Ingestion Button
 * Processes the uploaded PDF documents into the knowledge base
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { ingestBCorp2026Standards } from '@/lib/bcorp-standards-ingestion';
import { useToast } from '@/hooks/use-toast';

interface BCorp2026IngestionButtonProps {
  parsedDocuments: Record<string, string>;
  onComplete?: () => void;
}

export function BCorp2026IngestionButton({ 
  parsedDocuments, 
  onComplete 
}: BCorp2026IngestionButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  
  const documentCount = Object.keys(parsedDocuments).length;
  const hasMasterDoc = Object.keys(parsedDocuments).some(filename => 
    filename.toLowerCase().includes('all.pdf')
  );
  
  const handleIngest = async () => {
    if (documentCount === 0) {
      toast({
        title: "No documents to process",
        description: "Please upload B Corp documentation first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await ingestBCorp2026Standards(parsedDocuments);
      
      setIsComplete(true);
      toast({
        title: "Knowledge Base Updated",
        description: `Successfully processed ${documentCount} B Corp 2026 Standards documents into the knowledge base.`,
      });
      
      onComplete?.();
      
    } catch (error) {
      console.error('Error ingesting B Corp standards:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process documents into knowledge base. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isComplete) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Knowledge Base Updated</span>
        <span className="text-sm text-muted-foreground">
          ({documentCount} documents)
        </span>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {documentCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{documentCount} documents ready to process</span>
          {hasMasterDoc && (
            <div className="flex items-center gap-1 text-primary">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Master Document Found</span>
            </div>
          )}
        </div>
      )}
      
      <Button 
        onClick={handleIngest}
        disabled={isProcessing || documentCount === 0}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing B Corp Standards...
          </>
        ) : (
          <>
            <BookOpen className="mr-2 h-4 w-4" />
            {documentCount > 0 
              ? `Process ${documentCount} Documents into Knowledge Base`
              : 'No Documents to Process'
            }
          </>
        )}
      </Button>
      
      {hasMasterDoc && (
        <p className="text-xs text-primary font-medium text-center">
          Will set "all.pdf" as the Master Reference Document
        </p>
      )}
    </div>
  );
}