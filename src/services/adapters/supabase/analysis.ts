/**
 * Supabase Analysis Service Implementation
 * 
 * Live analysis service using Supabase for todos, impact summaries, and chat data.
 */

import { AnalysisJob, Finding, Todo, ImpactSummary, EvidenceExcerpt, ImpactArea } from '@/domain/data-contracts';
import { IAnalysisService } from '@/services/ports/analysis';
import { supabase } from '@/integrations/supabase/client';

export const startIngestion = async (businessId: string): Promise<AnalysisJob> => {
  // Simulated ingestion job
  const job: AnalysisJob = {
    id: crypto.randomUUID(),
    businessId,
    status: 'done',
    progressPct: 100,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    agent: 'mock'
  };
  
  return job;
};

export const getJob = async (jobId: string): Promise<AnalysisJob> => {
  throw new Error('Job not found');
};

export const listFindings = async (businessId: string): Promise<Finding[]> => {
  return [];
};

export const generateRoadmap = async (businessId: string): Promise<{ todos: Todo[] }> => {
  const todos = await listTodos(businessId);
  return { todos };
};

export const listTodos = async (businessId: string): Promise<Todo[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Backward compatibility: normalize any legacy data
  const normalizeImpact = (impact: string): ImpactArea => {
    const impactMap: Record<string, ImpactArea> = {
      'governance': 'Governance',
      'workers': 'Workers',
      'community': 'Community', 
      'environment': 'Environment',
      'customers': 'Customers'
    };
    return impactMap[impact.toLowerCase()] || (impact as ImpactArea) || 'Other';
  };

  const normalizePriority = (priority: string): Todo['priority'] => {
    const priorityMap: Record<string, Todo['priority']> = {
      'high': 'P1',
      'medium': 'P2',
      'low': 'P3'
    };
    return priorityMap[priority.toLowerCase()] || (priority as Todo['priority']) || 'P2';
  };

  const normalizeEffort = (effort: string): Todo['effort'] => {
    const effortMap: Record<string, Todo['effort']> = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High'
    };
    return effortMap[effort.toLowerCase()] || (effort as Todo['effort']) || 'Medium';
  };

  const normalizeStatus = (status: string): Todo['status'] => {
    const statusMap: Record<string, Todo['status']> = {
      'not_started': 'todo',
      'in_progress': 'in_progress',
      'blocked': 'blocked',
      'done': 'done'
    };
    return statusMap[status] || (status as Todo['status']) || 'todo';
  };

  return (data || []).map(row => ({
    id: row.id,
    businessId: row.business_id,
    impact: normalizeImpact(row.impact),
    requirementCode: row.requirement_code,
    kbActionId: row.kb_action_id,
    title: row.title,
    descriptionMd: row.description_md,
    priority: normalizePriority(row.priority),
    effort: normalizeEffort(row.effort),
    status: normalizeStatus(row.status),
    evidenceChunkIds: row.evidence_chunk_ids || [],
    ownerUserId: row.owner_user_id,
    dueDate: row.due_date,
    createdAt: row.created_at,
    subAreaId: row.sub_area_id,
    isImpactLocked: (row as any).is_impact_locked || false
  }));
};

export const updateTodoStatus = async (todoId: string, status: Todo['status']): Promise<Todo> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: any = { 
    status,
    updated_at: new Date().toISOString()
  };
  
  if (status === 'done') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('todos')
    .update(updateData)
    .eq('id', todoId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    businessId: data.business_id,
    impact: data.impact as ImpactArea,
    requirementCode: data.requirement_code,
    kbActionId: data.kb_action_id,
    title: data.title,
    descriptionMd: data.description_md,
    priority: data.priority as Todo['priority'],
    effort: data.effort as Todo['effort'],
    status: data.status as Todo['status'],
    evidenceChunkIds: data.evidence_chunk_ids || [],
    ownerUserId: data.owner_user_id,
    dueDate: data.due_date,
    createdAt: data.created_at,
    subAreaId: data.sub_area_id,
    isImpactLocked: (data as any).is_impact_locked || false
  };
};

export const assignTaskToSubArea = async (todoId: string, subAreaId: string | null): Promise<Todo> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('todos')
    .update({ 
      sub_area_id: subAreaId,
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    businessId: data.business_id,
    impact: data.impact as ImpactArea,
    requirementCode: data.requirement_code,
    kbActionId: data.kb_action_id,
    title: data.title,
    descriptionMd: data.description_md,
    priority: data.priority as Todo['priority'],
    effort: data.effort as Todo['effort'],
    status: data.status as Todo['status'],
    evidenceChunkIds: data.evidence_chunk_ids || [],
    ownerUserId: data.owner_user_id,
    dueDate: data.due_date,
    createdAt: data.created_at,
    subAreaId: data.sub_area_id
  };
};

export const updateTaskImpactArea = async (todoId: string, impactArea: ImpactArea): Promise<Todo> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('todos')
    .update({ 
      impact: impactArea,
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    businessId: data.business_id,
    impact: data.impact as ImpactArea,
    requirementCode: data.requirement_code,
    kbActionId: data.kb_action_id,
    title: data.title,
    descriptionMd: data.description_md,
    priority: data.priority as Todo['priority'],
    effort: data.effort as Todo['effort'],
    status: data.status as Todo['status'],
    evidenceChunkIds: data.evidence_chunk_ids || [],
    ownerUserId: data.owner_user_id,
    dueDate: data.due_date,
    createdAt: data.created_at,
    subAreaId: data.sub_area_id,
    isImpactLocked: (data as any).is_impact_locked || false
  };
};

export const linkEvidence = async (todoId: string, chunkIds: string[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('todos')
    .update({ evidence_chunk_ids: chunkIds })
    .eq('id', todoId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const impactSummary = async (businessId: string): Promise<ImpactSummary[]> => {
  const todos = await listTodos(businessId); // Only count active todos
  
  const impactAreas: ImpactArea[] = ['Governance', 'Workers', 'Community', 'Environment', 'Customers'];
  
  return impactAreas.map(impact => {
    const areaTodos = todos.filter(t => t.impact === impact);
    const doneTodos = areaTodos.filter(t => t.status === 'done');
    const total = areaTodos.length;
    const done = doneTodos.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    
    return { impact, total, done, pct };
  });
};

export const getEvidence = async (todoId: string): Promise<EvidenceExcerpt[]> => {
  return [];
};

export const reanalyze = async (businessId: string): Promise<AnalysisJob> => {
  return startIngestion(businessId);
};

export const resetAllTestData = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Delete all todos for this user
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;
};

export const resetTestData = async (businessId: string): Promise<{ todos: Todo[], impactSummaries: ImpactSummary[] }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Delete existing todos for this business
  await supabase
    .from('todos')
    .delete()
    .eq('business_id', businessId)
    .eq('user_id', user.id);

  // Generate baseline tasks using the edge function to maintain consistency
  try {
    const { data, error } = await supabase.functions.invoke('generate-baseline-tasks', {
      body: {
        businessId,
        businessData: null
      }
    });

    if (error) {
      console.error('Failed to generate baseline tasks via edge function:', error);
      throw error;
    }

    console.log('Baseline tasks generated via edge function successfully:', data);
  } catch (error) {
    console.error('Error generating baseline tasks via edge function:', error);
    throw error;
  }

  // Load the newly created todos
  const todos = await listTodos(businessId);
  const summaries = await impactSummary(businessId);
  
  return { todos, impactSummaries: summaries };
};

export const listBinnedTodos = async (businessId: string): Promise<Todo[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) throw error;

  // Use same normalization logic as listTodos
  const normalizeImpact = (impact: string): ImpactArea => {
    const impactMap: Record<string, ImpactArea> = {
      'governance': 'Governance',
      'workers': 'Workers',
      'community': 'Community', 
      'environment': 'Environment',
      'customers': 'Customers'
    };
    return impactMap[impact.toLowerCase()] || (impact as ImpactArea) || 'Other';
  };

  const normalizePriority = (priority: string): Todo['priority'] => {
    const priorityMap: Record<string, Todo['priority']> = {
      'high': 'P1',
      'medium': 'P2',
      'low': 'P3'
    };
    return priorityMap[priority.toLowerCase()] || (priority as Todo['priority']) || 'P2';
  };

  const normalizeEffort = (effort: string): Todo['effort'] => {
    const effortMap: Record<string, Todo['effort']> = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High'
    };
    return effortMap[effort.toLowerCase()] || (effort as Todo['effort']) || 'Medium';
  };

  const normalizeStatus = (status: string): Todo['status'] => {
    const statusMap: Record<string, Todo['status']> = {
      'not_started': 'todo',
      'in_progress': 'in_progress',
      'blocked': 'blocked',
      'done': 'done'
    };
    return statusMap[status] || (status as Todo['status']) || 'todo';
  };

  return (data || []).map(row => ({
    id: row.id,
    businessId: row.business_id,
    impact: normalizeImpact(row.impact),
    requirementCode: row.requirement_code,
    kbActionId: row.kb_action_id,
    title: row.title,
    descriptionMd: row.description_md,
    priority: normalizePriority(row.priority),
    effort: normalizeEffort(row.effort),
    status: normalizeStatus(row.status),
    evidenceChunkIds: row.evidence_chunk_ids || [],
    ownerUserId: row.owner_user_id,
    dueDate: row.due_date,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
    subAreaId: row.sub_area_id,
    isImpactLocked: (row as any).is_impact_locked || false
  }));
};

export const deleteTask = async (todoId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('todos')
    .update({ 
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const restoreTask = async (todoId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('todos')
    .update({ 
      deleted_at: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const updateTaskLockState = async (todoId: string, isLocked: boolean): Promise<Todo> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('todos')
    .update({ 
      is_impact_locked: isLocked,
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    businessId: data.business_id,
    impact: data.impact as ImpactArea,
    requirementCode: data.requirement_code,
    kbActionId: data.kb_action_id,
    title: data.title,
    descriptionMd: data.description_md,
    priority: data.priority as Todo['priority'],
    effort: data.effort as Todo['effort'],
    status: data.status as Todo['status'],
    evidenceChunkIds: data.evidence_chunk_ids || [],
    ownerUserId: data.owner_user_id,
    dueDate: data.due_date,
    createdAt: data.created_at,
    subAreaId: data.sub_area_id,
    isImpactLocked: (data as any).is_impact_locked
  };
};