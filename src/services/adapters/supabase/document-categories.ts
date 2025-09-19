/**
 * Supabase Document Categories Service
 * 
 * Manages user-defined document categories using Supabase.
 */

import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory } from '@/domain/data-contracts';
import { IDocumentCategoryService } from '@/services/ports/document-categories';

export class SupabaseDocumentCategoryService implements IDocumentCategoryService {
  async list(businessId: string): Promise<DocumentCategory[]> {
    const { data, error } = await supabase
      .from('user_document_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch document categories: ${error.message}`);
    }

    return (data || []).map(this.mapDbToDocumentCategory);
  }

  async create(
    businessId: string,
    category: Omit<DocumentCategory, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>
  ): Promise<DocumentCategory> {
    const { data, error } = await supabase
      .from('user_document_categories')
      .insert({
        business_id: businessId,
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
        sort_order: category.sortOrder,
        is_system_category: category.isSystemCategory,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create document category: ${error.message}`);
    }

    return this.mapDbToDocumentCategory(data);
  }

  async update(
    categoryId: string,
    updates: Partial<Pick<DocumentCategory, 'name' | 'description' | 'color' | 'icon' | 'sortOrder'>>
  ): Promise<DocumentCategory> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;

    const { data, error } = await supabase
      .from('user_document_categories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update document category: ${error.message}`);
    }

    return this.mapDbToDocumentCategory(data);
  }

  async delete(categoryId: string): Promise<void> {
    // First, move all files in this category to uncategorized (set category_id to NULL)
    const { error: filesError } = await supabase
      .from('files')
      .update({ category_id: null })
      .eq('category_id', categoryId);

    if (filesError) {
      throw new Error(`Failed to uncategorize files: ${filesError.message}`);
    }

    // Then delete the category
    const { error } = await supabase
      .from('user_document_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      throw new Error(`Failed to delete document category: ${error.message}`);
    }
  }

  async getById(categoryId: string): Promise<DocumentCategory | null> {
    const { data, error } = await supabase
      .from('user_document_categories')
      .select('*')
      .eq('id', categoryId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch document category: ${error.message}`);
    }

    return data ? this.mapDbToDocumentCategory(data) : null;
  }

  async reorder(businessId: string, categoryIds: string[]): Promise<void> {
    // Update sort order for each category
    const updates = categoryIds.map((id, index) => ({
      id,
      sort_order: index + 1,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('user_document_categories')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
        .eq('business_id', businessId);

      if (error) {
        throw new Error(`Failed to reorder category ${update.id}: ${error.message}`);
      }
    }
  }

  async seedDefaults(businessId: string): Promise<void> {
    const { error } = await supabase.rpc('seed_default_document_categories', {
      p_business_id: businessId
    });

    if (error) {
      throw new Error(`Failed to seed default categories: ${error.message}`);
    }
  }

  private mapDbToDocumentCategory(row: any): DocumentCategory {
    return {
      id: row.id,
      businessId: row.business_id,
      name: row.name,
      description: row.description,
      color: row.color,
      icon: row.icon,
      sortOrder: row.sort_order,
      isSystemCategory: row.is_system_category,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const supabaseDocumentCategoryService = new SupabaseDocumentCategoryService();