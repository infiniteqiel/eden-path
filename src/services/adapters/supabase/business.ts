/**
 * Supabase Business Service Implementation
 * 
 * Live business data using Supabase.
 */

import { Business, Account } from '@/domain/data-contracts';
import { IBusinessService } from '@/services/ports/business';
import { supabase } from '@/integrations/supabase/client';

export const list = async (): Promise<Business[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    accountId: row.user_id,
    name: row.name,
    companyNumber: row.company_number,
    legalForm: row.legal_form as Business['legalForm'],
    country: row.country as Business['country'],
    operatingMonths: row.operating_months,
    workersCount: row.workers_count,
    industry: row.industry,
    description: row.description,
    createdAt: row.created_at
  }));
};

export const get = async (id: string): Promise<Business> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    accountId: data.user_id,
    name: data.name,
    companyNumber: data.company_number,
    legalForm: data.legal_form as Business['legalForm'],
    country: data.country as Business['country'],
    operatingMonths: data.operating_months,
    workersCount: data.workers_count,
    industry: data.industry,
    description: data.description,
    createdAt: data.created_at
  };
};

export const create = async (business: Omit<Business, 'id' | 'createdAt'>): Promise<Business> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('businesses')
    .insert({
      user_id: user.id,
      name: business.name,
      company_number: business.companyNumber,
      legal_form: business.legalForm,
      country: business.country,
      operating_months: business.operatingMonths,
      workers_count: business.workersCount,
      industry: business.industry,
      description: business.description,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    accountId: data.user_id,
    name: data.name,
    companyNumber: data.company_number,
    legalForm: data.legal_form as Business['legalForm'],
    country: data.country as Business['country'],
    operatingMonths: data.operating_months,
    workersCount: data.workers_count,
    industry: data.industry,
    description: data.description,
    createdAt: data.created_at
  };
};

export const update = async (id: string, updates: Partial<Business>): Promise<Business> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('businesses')
    .update({
      name: updates.name,
      company_number: updates.companyNumber,
      legal_form: updates.legalForm,
      country: updates.country,
      operating_months: updates.operatingMonths,
      workers_count: updates.workersCount,
      industry: updates.industry,
      description: updates.description,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    accountId: data.user_id,
    name: data.name,
    companyNumber: data.company_number,
    legalForm: data.legal_form as Business['legalForm'],
    country: data.country as Business['country'],
    operatingMonths: data.operating_months,
    workersCount: data.workers_count,
    industry: data.industry,
    description: data.description,
    createdAt: data.created_at
  };
};

export const deleteBusiness = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const getCurrentAccount = async (): Promise<Account> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    createdAt: user.created_at
  };
};

// Alias for delete
export { deleteBusiness as delete };