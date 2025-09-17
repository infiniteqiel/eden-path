/**
 * Business Context Hook
 * 
 * Manages business switching and coordinates data clearing/loading across stores
 */

import { useEffect } from 'react';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { useDataroomStore } from '@/store/dataroom';
import { useSubAreasStore } from '@/store/sub-areas';

export function useBusinessContext() {
  const { currentBusiness } = useBusinessStore();
  const analysisStore = useAnalysisStore();
  const dataroomStore = useDataroomStore();
  const subAreasStore = useSubAreasStore();

  // Clear and reload data when business changes
  useEffect(() => {
    if (!currentBusiness) {
      // Clear all business-specific data when no business is selected
      analysisStore.clearError();
      dataroomStore.clearError();
      subAreasStore.clearError();
      return;
    }

    // Load business-specific data for the current business
    const loadBusinessData = async () => {
      try {
        // Load sub-areas first (needed for task organization)
        await subAreasStore.loadSubAreas(currentBusiness.id);
        
        // Load analysis data (todos, impact summaries)
        await analysisStore.loadTodos(currentBusiness.id);
        await analysisStore.loadImpactSummaries(currentBusiness.id);
        
        // Load dataroom files
        await dataroomStore.loadFiles(currentBusiness.id);
      } catch (error) {
        console.warn('Failed to load business data:', error);
      }
    };

    loadBusinessData();
  }, [currentBusiness?.id]);

  return {
    currentBusiness,
    isBusinessSelected: !!currentBusiness
  };
}

/**
 * Hook for post-business-creation initialization
 */
export function usePostBusinessCreation() {
  const analysisStore = useAnalysisStore();
  const dataroomStore = useDataroomStore();
  const subAreasStore = useSubAreasStore();

  const initializeNewBusiness = async (businessId: string, businessData?: any) => {
    try {
      // Ensure default sub-areas are loaded
      await subAreasStore.ensureDefaults(businessId);
      
      // Generate baseline B Corp tasks for new company
      await generateBaselineTasks(businessId, businessData);
      
      // Initialize empty state for other stores
      analysisStore.clearError();
      dataroomStore.clearError();
      
      // Load initial data
      await Promise.all([
        analysisStore.loadTodos(businessId),
        analysisStore.loadImpactSummaries(businessId),
        dataroomStore.loadFiles(businessId)
      ]);
    } catch (error) {
      console.warn('Failed to initialize new business:', error);
    }
  };

  const generateBaselineTasks = async (businessId: string, businessData?: any) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('generate-baseline-tasks', {
        body: {
          businessId,
          businessData
        }
      });

      if (error) {
        console.error('Failed to generate baseline tasks:', error);
        return;
      }

      console.log('Baseline tasks generated successfully:', data);
    } catch (error) {
      console.error('Error generating baseline tasks:', error);
    }
  };

  return { initializeNewBusiness };
}