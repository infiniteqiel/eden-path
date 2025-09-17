/**
 * AI Analysis Button Component
 * Triggers AI-powered B Corp analysis from company profile data
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AiAnalysisButtonProps {
  businessId: string;
  triggerText?: string;
  savedDescription?: string;
  hasUnsavedChanges?: boolean;
  onAnalysisComplete?: () => void;
}

export function AiAnalysisButton({ 
  businessId, 
  triggerText = "Start AI Analysis",
  savedDescription = '',
  hasUnsavedChanges = false,
  onAnalysisComplete
}: AiAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!businessId) {
      toast({
        title: "No Business Selected",
        description: "Please select a business to analyze.",
        variant: "destructive"
      });
      return;
    }

    if (hasUnsavedChanges) {
      toast({
        title: "Unsaved Changes",
        description: "Please save your description before analyzing.",
        variant: "destructive"
      });
      return;
    }

    if (!savedDescription || !savedDescription.trim()) {
      toast({
        title: "No Description",
        description: "Please save a company description first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setIsComplete(false);

    try {
      console.log('Starting AI analysis for business:', businessId);
      
      // Call the AI task generation function using the saved description only
      const { data, error } = await supabase.functions.invoke('generate-ai-tasks', {
        body: {
          businessId,
          context: savedDescription.trim(),
          analysisType: 'company_description_analysis'
        }
      });

      if (error) {
        console.error('AI analysis error:', error);
        throw error;
      }

      console.log('AI analysis completed:', data);
      
      setIsComplete(true);
      toast({
        title: "Analysis Complete",
        description: `AI has analyzed your company description and generated ${data?.tasksGenerated || 0} new B Corp tasks.`,
      });

      // Trigger refresh of tasks in the UI if callback provided
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }

      // Reset the complete state after 3 seconds
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);

    } catch (error) {
      console.error('Error during AI analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isComplete) {
    return (
      <Button variant="outline" className="text-green-600 border-green-200">
        <CheckCircle className="mr-2 h-4 w-4" />
        Analysis Complete
      </Button>
    );
  }

  const isDisabled = isAnalyzing || !businessId || hasUnsavedChanges || !savedDescription?.trim();

  return (
    <Button 
      onClick={handleAnalysis}
      disabled={isDisabled}
      className="min-w-[200px]"
      title={
        hasUnsavedChanges 
          ? "Save your description first" 
          : !savedDescription?.trim() 
            ? "No description saved" 
            : undefined
      }
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Brain className="mr-2 h-4 w-4" />
          {triggerText}
        </>
      )}
    </Button>
  );
}