/**
 * Supabase Document Categories Service
 * 
 * Manages user-defined document categories
 */

import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory } from '@/domain/data-contracts';

export interface IDocumentCategoryService {
  list(businessId: string): Promise<DocumentCategory[]>;
  create(businessId: string, category: Omit<DocumentCategory, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>): Promise<DocumentCategory>;
  update(categoryId: string, updates: Partial<Pick<DocumentCategory, 'name' | 'description' | 'color' | 'icon' | 'sortOrder'>>): Promise<DocumentCategory>;
  delete(categoryId: string): Promise<void>;
}

export class SupabaseDocumentCategoryService implements IDocumentCategoryService {
  async list(businessId: string): Promise<DocumentCategory[]> {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to load document categories: ${error.message}`);
    }

    return data.map(this.mapDbToDocumentCategory);
  }

  async create(businessId: string, category: Omit<DocumentCategory, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>): Promise<DocumentCategory> {
    const { data, error } = await supabase
      .from('document_categories')
      .insert({
        business_id: businessId,
        name: category.name,
        description: category.description || null,
        color: category.color,
        icon: category.icon,
        sort_order: category.sortOrder
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create document category: ${error.message}`);
    }

    return this.mapDbToDocumentCategory(data);
  }

  async update(categoryId: string, updates: Partial<Pick<DocumentCategory, 'name' | 'description' | 'color' | 'icon' | 'sortOrder'>>): Promise<DocumentCategory> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;

    const { data, error } = await supabase
      .from('document_categories')
      .update(updateData)
      .eq('id', categoryId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update document category: ${error.message}`);
    }

    return this.mapDbToDocumentCategory(data);
  }

  async delete(categoryId: string): Promise<void> {
    const { error } = await supabase
      .from('document_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      throw new Error(`Failed to delete document category: ${error.message}`);
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
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const supabaseDocumentCategoryService = new SupabaseDocumentCategoryService();