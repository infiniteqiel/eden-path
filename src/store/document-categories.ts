/**
 * Document Categories Store
 * 
 * Manages user-defined document categories.
 */

import { create } from 'zustand';
import { DocumentCategory } from '@/domain/data-contracts';
import { supabaseDocumentCategoryService } from '@/services/adapters/supabase/document-categories';

interface DocumentCategoryState {
  categories: DocumentCategory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCategories: (businessId: string) => Promise<void>;
  createCategory: (
    businessId: string, 
    category: Omit<DocumentCategory, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateCategory: (
    categoryId: string,
    updates: Partial<Pick<DocumentCategory, 'name' | 'description' | 'color' | 'icon' | 'sortOrder'>>
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  reorderCategories: (businessId: string, categoryIds: string[]) => Promise<void>;
  clearError: () => void;
}

export const useDocumentCategoryStore = create<DocumentCategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const categories = await supabaseDocumentCategoryService.list(businessId);
      set({ categories, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load categories', 
        isLoading: false 
      });
    }
  },

  createCategory: async (businessId: string, category) => {
    set({ error: null });
    try {
      const newCategory = await supabaseDocumentCategoryService.create(businessId, category);
      set(state => ({ 
        categories: [...state.categories, newCategory].sort((a, b) => a.sortOrder - b.sortOrder)
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create category'
      });
    }
  },

  updateCategory: async (categoryId: string, updates) => {
    set({ error: null });
    try {
      const updatedCategory = await supabaseDocumentCategoryService.update(categoryId, updates);
      set(state => ({
        categories: state.categories.map(c => c.id === categoryId ? updatedCategory : c)
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update category'
      });
    }
  },

  deleteCategory: async (categoryId: string) => {
    // Optimistically update UI
    set(state => ({
      categories: state.categories.filter(c => c.id !== categoryId),
      error: null
    }));

    try {
      await supabaseDocumentCategoryService.delete(categoryId);
    } catch (error) {
      // Revert on error
      await get().loadCategories(''); // Will need business ID passed in
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete category'
      });
    }
  },

  reorderCategories: async (businessId: string, categoryIds: string[]) => {
    try {
      await supabaseDocumentCategoryService.reorder(businessId, categoryIds);
      // Reload to get updated sort order
      await get().loadCategories(businessId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reorder categories'
      });
    }
  },

  clearError: () => set({ error: null }),
}));