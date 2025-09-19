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
    subAreaId: row.sub_area_id
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
    subAreaId: data.sub_area_id
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

  const baselineTodos = [
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Governance',
      requirement_code: 'GOV-001',
      title: 'Update Articles of Association with mission lock language',
      description_md: 'Your Articles of Association must include specific B Corp mission lock language to meet certification requirements.',
      priority: 'P1',
      effort: 'High',
      status: 'todo',
      sub_area_id: 'Legal Requirements'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Governance',
      requirement_code: 'GOV-002',
      title: 'Establish stakeholder governance framework',
      description_md: 'Create formal processes for considering all stakeholders in business decisions.',
      priority: 'P1',
      effort: 'Medium',
      status: 'todo',
      sub_area_id: 'Accountability'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Workers',
      requirement_code: 'WOR-001',
      title: 'Implement fair compensation policy',
      description_md: 'Establish and document fair wage policies, including living wage considerations.',
      priority: 'P1',
      effort: 'Medium',
      status: 'todo',
      sub_area_id: 'Compensation & Benefits'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Workers',
      requirement_code: 'WOR-002',
      title: 'Create employee handbook with health and safety policies',
      description_md: 'Develop comprehensive employee handbook covering health, safety, and wellbeing policies.',
      priority: 'P2',
      effort: 'Medium',
      status: 'todo',
      sub_area_id: 'Well-being & Safety'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Environment',
      requirement_code: 'ENV-001',
      title: 'Establish environmental management system',
      description_md: 'Create formal environmental policies and begin tracking key environmental metrics.',
      priority: 'P2',
      effort: 'Medium',
      status: 'todo',
      sub_area_id: 'Environmental Policy'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Environment',
      requirement_code: 'ENV-002',
      title: 'Implement carbon footprint tracking',
      description_md: 'Begin measuring and tracking your company\'s carbon emissions and energy usage.',
      priority: 'P2',
      effort: 'Low',
      status: 'todo',
      sub_area_id: 'Energy & Carbon'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Community',
      requirement_code: 'COM-001',
      title: 'Document community impact initiatives',
      description_md: 'Formally document your community involvement and social impact programs.',
      priority: 'P2',
      effort: 'Low',
      status: 'todo',
      sub_area_id: 'Local Community'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Community',
      requirement_code: 'COM-002',
      title: 'Develop supplier diversity program',
      description_md: 'Create policies and practices to work with diverse suppliers and local businesses.',
      priority: 'P2',
      effort: 'Medium',
      status: 'todo',
      sub_area_id: 'Supply Chain'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Customers',
      requirement_code: 'CUS-001',
      title: 'Implement customer feedback and data protection systems',
      description_md: 'Establish customer feedback collection and ensure GDPR-compliant data protection.',
      priority: 'P2',
      effort: 'Medium',
      status: 'todo',
      sub_area_id: 'Data Protection'
    },
    {
      user_id: user.id,
      business_id: businessId,
      impact: 'Customers',
      requirement_code: 'CUS-002',
      title: 'Create customer satisfaction measurement system',
      description_md: 'Implement systems to regularly measure and improve customer satisfaction.',
      priority: 'P3',
      effort: 'Low',
      status: 'todo',
      sub_area_id: 'Customer Experience'
    }
  ];

  // Insert baseline todos
  const { data: insertedTodos, error } = await supabase
    .from('todos')
    .insert(baselineTodos)
    .select();

  if (error) throw error;

  // Convert to domain objects
  const todos: Todo[] = (insertedTodos || []).map(row => ({
    id: row.id,
    businessId: row.business_id,
    impact: row.impact as ImpactArea,
    requirementCode: row.requirement_code,
    kbActionId: row.kb_action_id,
    title: row.title,
    descriptionMd: row.description_md,
    priority: row.priority as Todo['priority'],
    effort: row.effort as Todo['effort'],
    status: row.status as Todo['status'],
    evidenceChunkIds: row.evidence_chunk_ids || [],
    ownerUserId: row.owner_user_id,
    dueDate: row.due_date,
    createdAt: row.created_at,
    subAreaId: row.sub_area_id
  }));

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
    subAreaId: row.sub_area_id
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