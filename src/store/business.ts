/**
 * Business Store
 * 
 * Manages business entities and current business selection.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Business } from '@/domain/data-contracts';
import { businessService } from '@/services/registry';
import { subAreasService } from '@/services/adapters/supabase/sub-areas';

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadBusinesses: () => Promise<void>;
  selectBusiness: (businessId: string) => Promise<void>;
  createBusiness: (business: Omit<Business, 'id' | 'createdAt'>) => Promise<Business>;
  updateBusiness: (id: string, updates: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      businesses: [],
      currentBusiness: null,
      isLoading: false,
      error: null,

      loadBusinesses: async () => {
        set({ isLoading: true, error: null });
        try {
          const businesses = await businessService.list();
          const { currentBusiness } = get();
          
          // If no current business selected, select the first one
          let updatedCurrentBusiness = currentBusiness;
          if (!currentBusiness && businesses.length > 0) {
            updatedCurrentBusiness = businesses[0];
          }
          // Check if current business still exists
          else if (currentBusiness && !businesses.find(b => b.id === currentBusiness.id)) {
            updatedCurrentBusiness = businesses.length > 0 ? businesses[0] : null;
          }

          set({ 
            businesses, 
            currentBusiness: updatedCurrentBusiness,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load businesses', 
            isLoading: false 
          });
        }
      },

      selectBusiness: async (businessId: string) => {
        set({ isLoading: true, error: null });
        try {
          const business = await businessService.get(businessId);
          set({ currentBusiness: business, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to select business', 
            isLoading: false 
          });
        }
      },

      createBusiness: async (businessData: Omit<Business, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const business = await businessService.create(businessData);
          const { businesses } = get();
          
          // Seed default sub-areas for the new business
          try {
            await subAreasService.seedDefaultSubAreas(business.id);
          } catch (subAreaError) {
            console.warn('Failed to seed default sub-areas:', subAreaError);
            // Don't throw here - business creation succeeded
          }
          
          set({ 
            businesses: [...businesses, business],
            currentBusiness: business,
            isLoading: false 
          });
          return business;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create business', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateBusiness: async (id: string, updates: Partial<Business>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedBusiness = await businessService.update(id, updates);
          const { businesses, currentBusiness } = get();
          
          const updatedBusinesses = businesses.map(b => 
            b.id === id ? updatedBusiness : b
          );
          
          const updatedCurrentBusiness = currentBusiness?.id === id 
            ? updatedBusiness 
            : currentBusiness;

          set({ 
            businesses: updatedBusinesses,
            currentBusiness: updatedCurrentBusiness,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update business', 
            isLoading: false 
          });
        }
      },

      deleteBusiness: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await businessService.delete(id);
          const { businesses, currentBusiness } = get();
          
          const updatedBusinesses = businesses.filter(b => b.id !== id);
          const updatedCurrentBusiness = currentBusiness?.id === id 
            ? (updatedBusinesses.length > 0 ? updatedBusinesses[0] : null)
            : currentBusiness;

          set({ 
            businesses: updatedBusinesses,
            currentBusiness: updatedCurrentBusiness,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete business', 
            isLoading: false 
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'bcorp-business-storage',
      partialize: (state) => ({ 
        currentBusiness: state.currentBusiness 
      }),
    }
  )
);