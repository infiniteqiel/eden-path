/**
 * Mock Analysis Service Implementation
 * 
 * Simulates AI-powered document analysis and roadmap generation.
 * Will be replaced with real AI agents (OpenAI/DeepSeek) later.
 */

import { AnalysisJob, Finding, Todo, ImpactSummary, EvidenceExcerpt, ImpactArea, TodoPriority, TodoEffort } from '@/domain/data-contracts';
import { IAnalysisService } from '@/services/ports/analysis';

// localStorage keys
const TODOS_STORAGE_KEY = 'bcstart_todos';
const JOBS_STORAGE_KEY = 'bcstart_jobs';
const FINDINGS_STORAGE_KEY = 'bcstart_findings';

// Default todos data
const defaultTodos: Todo[] = [
  {
    id: '1',
    businessId: '1',
    impact: 'Governance',
    requirementCode: 'GOV-001',
    title: 'Update Articles of Association with mission lock language',
    descriptionMd: 'Your Articles of Association need to include specific B Corp mission lock language to meet certification requirements.',
    priority: 'P1',
    effort: 'Medium',
    status: 'todo',
    evidenceChunkIds: ['chunk-1'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    businessId: '1',
    impact: 'Workers',
    requirementCode: 'WOR-005',
    title: 'Establish formal diversity and inclusion policy',
    descriptionMd: 'Create and implement a comprehensive D&I policy that covers recruitment, promotion, and workplace culture.',
    priority: 'P2',
    effort: 'High',
    status: 'in_progress',
    evidenceChunkIds: ['chunk-2'],
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    businessId: '1',
    impact: 'Environment',
    requirementCode: 'ENV-012',
    title: 'Implement carbon footprint tracking',
    descriptionMd: 'Set up systems to measure and track your company\'s carbon emissions across operations.',
    priority: 'P2',
    effort: 'Medium',
    status: 'todo',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    businessId: '1',
    impact: 'Community',
    requirementCode: 'COM-008',
    title: 'Document community impact initiatives',
    descriptionMd: 'Create formal documentation of your community involvement and social impact programs.',
    priority: 'P3',
    effort: 'Low',
    status: 'done',
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    businessId: '1',
    impact: 'Customers',
    requirementCode: 'CUS-003',
    title: 'Establish customer feedback collection system',
    descriptionMd: 'Implement processes to regularly collect and act on customer feedback regarding product quality and service.',
    priority: 'P2',
    effort: 'Low',
    status: 'todo',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    businessId: '1',
    impact: 'Workers',
    requirementCode: 'WOR-015',
    title: 'Review employee compensation structure',
    descriptionMd: 'Analyze current compensation to ensure fair and equitable pay across all roles and demographics.',
    priority: 'P1',
    effort: 'High',
    status: 'blocked',
    createdAt: '2024-01-06T00:00:00Z'
  }
];

// Helper functions for localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// Initialize storage
let mockJobs: AnalysisJob[] = loadFromStorage(JOBS_STORAGE_KEY, []);
let mockFindings: Finding[] = loadFromStorage(FINDINGS_STORAGE_KEY, []);
let mockTodos: Todo[] = loadFromStorage(TODOS_STORAGE_KEY, defaultTodos);

let nextJobId = 1;
let nextTodoId = mockTodos.length + 1;

export const startIngestion = async (businessId: string): Promise<AnalysisJob> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const job: AnalysisJob = {
    id: String(nextJobId++),
    businessId,
    status: 'queued',
    progressPct: 0,
    startedAt: new Date().toISOString(),
    agent: 'mock'
  };

  mockJobs.push(job);

  // Simulate processing
  setTimeout(() => simulateJobProgress(job.id), 1000);

  return job;
};

export const getJob = async (jobId: string): Promise<AnalysisJob> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  
  return job;
};

export const listFindings = async (businessId: string): Promise<Finding[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockFindings.filter(f => f.businessId === businessId);
};

export const generateRoadmap = async (businessId: string): Promise<{ todos: Todo[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return existing todos plus potentially generate new ones
  const existingTodos = mockTodos.filter(t => t.businessId === businessId);
  
  return { todos: existingTodos };
};

export const listTodos = async (businessId: string): Promise<Todo[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockTodos.filter(t => t.businessId === businessId);
};

export const updateTodoStatus = async (todoId: string, status: Todo['status']): Promise<Todo> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const todoIndex = mockTodos.findIndex(t => t.id === todoId);
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }

  mockTodos[todoIndex] = { ...mockTodos[todoIndex], status };
  
  // Save to localStorage
  saveToStorage(TODOS_STORAGE_KEY, mockTodos);
  
  return mockTodos[todoIndex];
};

export const linkEvidence = async (todoId: string, chunkIds: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const todoIndex = mockTodos.findIndex(t => t.id === todoId);
  if (todoIndex !== -1) {
    mockTodos[todoIndex].evidenceChunkIds = chunkIds;
  }
};

export const impactSummary = async (businessId: string): Promise<ImpactSummary[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const todos = mockTodos.filter(t => t.businessId === businessId);
  
  const impactAreas: ImpactArea[] = ['Governance', 'Workers', 'Community', 'Environment', 'Customers'];
  
  return impactAreas.map(impact => {
    const impactTodos = todos.filter(t => t.impact === impact);
    const done = impactTodos.filter(t => t.status === 'done').length;
    const total = impactTodos.length;
    
    return {
      impact,
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0
    };
  });
};

export const getEvidence = async (todoId: string): Promise<EvidenceExcerpt[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return mock evidence excerpts
  return [
    {
      id: 'evidence-1',
      fileId: '1',
      fileName: 'Articles of Association.pdf',
      chunkId: 'chunk-1',
      text: 'The company shall operate for the benefit of all stakeholders, including shareholders, employees, customers, community, and the environment.',
      pageNumber: 2,
      confidence: 0.85
    },
    {
      id: 'evidence-2', 
      fileId: '2',
      fileName: 'Employee Handbook v2.docx',
      chunkId: 'chunk-2',
      text: 'We are committed to fostering an inclusive workplace where diversity is celebrated and all employees have equal opportunities for growth.',
      pageNumber: 15,
      confidence: 0.92
    }
  ];
};

export const reanalyze = async (businessId: string): Promise<AnalysisJob> => {
  return startIngestion(businessId);
};

// Helper function to simulate job progress
function simulateJobProgress(jobId: string) {
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) return;

  // Update to running
  job.status = 'running';
  job.progressPct = 10;

  // Simulate progress updates
  const progressSteps = [25, 45, 70, 85, 100];
  progressSteps.forEach((progress, index) => {
    setTimeout(() => {
      const currentJob = mockJobs.find(j => j.id === jobId);
      if (currentJob) {
        currentJob.progressPct = progress;
        if (progress === 100) {
          currentJob.status = 'done';
          currentJob.finishedAt = new Date().toISOString();
        }
      }
    }, (index + 1) * 2000);
  });
}