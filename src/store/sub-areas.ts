/**
 * Zustand store for managing impact sub-areas
 */

import { create } from 'zustand';
import { ImpactSubArea, subAreasService } from '@/services/adapters/supabase/sub-areas';

interface SubAreasState {
  subAreas: ImpactSubArea[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSubAreas: (businessId: string) => Promise<void>;
  loadSubAreasByImpact: (businessId: string, impactArea: string) => Promise<ImpactSubArea[]>;
  ensureDefaults: (businessId: string, impactArea: string) => Promise<void>;
  createSubArea: (businessId: string, impactArea: string, title: string, description?: string) => Promise<void>;
  updateSubAreaOrder: (updates: { id: string; sortOrder: number }[]) => Promise<void>;
  clearError: () => void;
}

export const useSubAreasStore = create<SubAreasState>((set, get) => ({
  subAreas: [],
  isLoading: false,
  error: null,

  loadSubAreas: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const subAreas = await subAreasService.getSubAreas(businessId);
      set({ subAreas, isLoading: false });
    } catch (error) {
      console.error('Error loading sub-areas:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load sub-areas',
        isLoading: false 
      });
    }
  },

  loadSubAreasByImpact: async (businessId: string, impactArea: string) => {
    try {
      const subAreas = await subAreasService.getSubAreasByImpact(businessId, impactArea);
      
      // Update the store with the new sub-areas for this impact area
      const currentSubAreas = get().subAreas;
      const otherSubAreas = currentSubAreas.filter(sa => sa.impactArea !== impactArea);
      const updatedSubAreas = [...otherSubAreas, ...subAreas];
      
      set({ subAreas: updatedSubAreas });
      return subAreas;
    } catch (error) {
      console.error('Error loading sub-areas by impact:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load sub-areas'
      });
      return [];
    }
  },

  ensureDefaults: async (businessId: string, impactArea: string) => {
    try {
      // Check if sub-areas already exist for this impact area
      const existingSubAreas = await subAreasService.getSubAreasByImpact(businessId, impactArea);
      
      // Only seed if no sub-areas exist for this impact area
      if (existingSubAreas.length === 0) {
        await subAreasService.seedDefaultSubAreas(businessId);
      }
      
      // Load and set the sub-areas
      await get().loadSubAreasByImpact(businessId, impactArea);
    } catch (error) {
      console.error('Error ensuring default sub-areas:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to ensure default sub-areas'
      });
    }
  },

  createSubArea: async (businessId: string, impactArea: string, title: string, description?: string) => {
    try {
      const newSubArea = await subAreasService.createSubArea({
        businessId,
        impactArea,
        title,
        description,
        iconType: 'user_added',
        isUserCreated: true
      });

      const currentSubAreas = get().subAreas;
      set({ subAreas: [...currentSubAreas, newSubArea] });
    } catch (error) {
      console.error('Error creating sub-area:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create sub-area'
      });
      throw error;
    }
  },

  updateSubAreaOrder: async (updates: { id: string; sortOrder: number }[]) => {
    try {
      await subAreasService.updateSortOrder(updates);
      
      // Update local state
      const currentSubAreas = get().subAreas;
      const updatedSubAreas = currentSubAreas.map(subArea => {
        const update = updates.find(u => u.id === subArea.id);
        return update ? { ...subArea, sortOrder: update.sortOrder } : subArea;
      });
      
      set({ subAreas: updatedSubAreas });
    } catch (error) {
      console.error('Error updating sub-area order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update sub-area order'
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));