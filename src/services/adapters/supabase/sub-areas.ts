/**
 * Supabase adapter for managing impact sub-areas
 */

import { supabase } from '@/integrations/supabase/client';

export interface ImpactSubArea {
  id: string;
  businessId: string;
  impactArea: string;
  title: string;
  description?: string;
  iconType: 'default' | 'user_added';
  sortOrder: number;
  isUserCreated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubAreaData {
  businessId: string;
  impactArea: string;
  title: string;
  description?: string;
  iconType?: 'default' | 'user_added';
  sortOrder?: number;
  isUserCreated?: boolean;
}

export class SupabaseSubAreasService {
  /**
   * Get all sub-areas for a business
   */
  async getSubAreas(businessId: string): Promise<ImpactSubArea[]> {
    const { data, error } = await supabase
      .from('impact_sub_areas')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return (data || []).map(this.normalizeSubArea);
  }

  /**
   * Get sub-areas for a specific impact area
   */
  async getSubAreasByImpact(businessId: string, impactArea: string): Promise<ImpactSubArea[]> {
    const { data, error } = await supabase
      .from('impact_sub_areas')
      .select('*')
      .eq('business_id', businessId)
      .eq('impact_area', impactArea)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return (data || []).map(this.normalizeSubArea);
  }

  /**
   * Create a new sub-area
   */
  async createSubArea(subAreaData: CreateSubAreaData): Promise<ImpactSubArea> {
    const { data, error } = await supabase
      .from('impact_sub_areas')
      .insert([{
        business_id: subAreaData.businessId,
        impact_area: subAreaData.impactArea,
        title: subAreaData.title,
        description: subAreaData.description,
        icon_type: subAreaData.iconType || 'user_added',
        sort_order: subAreaData.sortOrder || 999,
        is_user_created: subAreaData.isUserCreated !== false
      }])
      .select()
      .single();

    if (error) throw error;

    return this.normalizeSubArea(data);
  }

  /**
   * Update a sub-area
   */
  async updateSubArea(id: string, updates: Partial<CreateSubAreaData>): Promise<ImpactSubArea> {
    const { data, error } = await supabase
      .from('impact_sub_areas')
      .update({
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.iconType && { icon_type: updates.iconType }),
        ...(updates.sortOrder !== undefined && { sort_order: updates.sortOrder })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return this.normalizeSubArea(data);
  }

  /**
   * Delete a sub-area (only user-created ones)
   */
  async deleteSubArea(id: string): Promise<void> {
    const { error } = await supabase
      .from('impact_sub_areas')
      .delete()
      .eq('id', id)
      .eq('is_user_created', true); // Only allow deletion of user-created areas

    if (error) throw error;
  }

  /**
   * Seed default sub-areas for a new business
   */
  async seedDefaultSubAreas(businessId: string): Promise<void> {
    const { error } = await supabase.rpc('seed_default_sub_areas', {
      p_business_id: businessId
    });

    if (error) throw error;
  }

  /**
   * Update sort order for multiple sub-areas
   */
  async updateSortOrder(updates: { id: string; sortOrder: number }[]): Promise<void> {
    const promises = updates.map(({ id, sortOrder }) =>
      supabase
        .from('impact_sub_areas')
        .update({ sort_order: sortOrder })
        .eq('id', id)
    );

    const results = await Promise.all(promises);
    const error = results.find(result => result.error)?.error;
    
    if (error) throw error;
  }

  private normalizeSubArea(row: any): ImpactSubArea {
    return {
      id: row.id,
      businessId: row.business_id,
      impactArea: row.impact_area,
      title: row.title,
      description: row.description,
      iconType: row.icon_type,
      sortOrder: row.sort_order,
      isUserCreated: row.is_user_created,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const subAreasService = new SupabaseSubAreasService();