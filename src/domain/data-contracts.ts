/**
 * B-Corp Domain Data Contracts
 * 
 * These are the core data types that define the business domain.
 * The UI layer imports ONLY from here to maintain clean separation.
 */

export type ImpactArea = 'Governance' | 'Workers' | 'Community' | 'Environment' | 'Customers' | 'Other';

export type TodoStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TodoPriority = 'P1' | 'P2' | 'P3';
export type TodoEffort = 'Low' | 'Medium' | 'High';

export type FileKind =
  | 'business_plan'
  | 'articles_of_association' 
  | 'certificate_of_incorp'
  | 'employee_handbook'
  | 'hr_policy'
  | 'di_policy'
  | 'env_policy'
  | 'supplier_code'
  | 'privacy_policy'
  | 'impact_report'
  | 'other';

export type OcrStatus = 'pending' | 'done' | 'failed';
export type AnalysisStatus = 'idle' | 'queued' | 'running' | 'done' | 'failed';

export interface Account {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Business {
  id: string;
  accountId: string;
  name: string;
  companyNumber?: string;
  legalForm?: 'Ltd' | 'LLP' | 'CIC';
  country?: 'UK';
  operatingMonths?: number;
  workersCount?: number;
  industry?: string;
  createdAt: string;
}

export interface DataFile {
  id: string;
  dataroomId: string;
  kind: FileKind;
  originalName: string;
  storagePath: string;
  contentType?: string;
  uploadedAt: string;
  ocrStatus: OcrStatus;
  size?: number;
  impactArea?: ImpactArea;
  linkedTodoId?: string;
}

export interface DocChunk {
  id: string;
  fileId: string;
  idx: number;
  pageFrom?: number;
  pageTo?: number;
  text: string;
}

export interface Finding {
  id: string;
  businessId: string;
  impact?: ImpactArea;
  requirementCode?: string;
  evidenceChunkId?: string;
  evidenceExcerpt?: string;
  confidence?: number;
  notes?: Record<string, unknown>;
}

export interface Todo {
  id: string;
  businessId: string;
  impact: ImpactArea;
  requirementCode?: string;
  kbActionId?: string;
  title: string;
  descriptionMd?: string;
  priority: TodoPriority;
  effort: TodoEffort;
  status: TodoStatus;
  evidenceChunkIds?: string[];
  ownerUserId?: string;
  dueDate?: string;
  createdAt: string;
}

export interface ImpactSummary {
  impact: ImpactArea;
  total: number;
  done: number;
  pct: number;
}

export interface AnalysisJob {
  id: string;
  businessId: string;
  status: AnalysisStatus;
  progressPct?: number;
  startedAt?: string;
  finishedAt?: string;
  agent?: 'openai' | 'deepseek' | 'mock';
}

export interface RiskAnswer {
  code: string;
  answer: boolean;
  notes?: string;
  updatedAt?: string;
}

export interface RiskQuestion {
  code: string;
  label: string;
  details?: string;
  category?: string;
}

export interface LegalStatus {
  businessId: string;
  hasMissionLock: boolean;
  resolutionPassedAt?: string;
  filedAtCompaniesHouse?: string;
  cc04Filed?: boolean;
  notes?: string;
  updatedAt?: string;
}

export interface EvidenceExcerpt {
  id: string;
  fileId: string;
  fileName: string;
  chunkId: string;
  text: string;
  pageNumber?: number;
  confidence?: number;
}

// UI-specific types
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

// Navigation and routing types
export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  disabled?: boolean;
  external?: boolean;
}

// Form types for legal wizard
export interface LegalStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  attachments?: string[];
}