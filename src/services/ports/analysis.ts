/**
 * Analysis Service Port
 * 
 * Interface for document analysis and roadmap generation.
 * This will later be implemented by AI agents.
 */

import { AnalysisJob, Finding, Todo, ImpactSummary, EvidenceExcerpt } from '@/domain/data-contracts';

export interface IAnalysisService {
  /**
   * Start document ingestion and analysis for a business
   */
  startIngestion(businessId: string): Promise<AnalysisJob>;

  /**
   * Get current status of an analysis job
   */
  getJob(jobId: string): Promise<AnalysisJob>;

  /**
   * List all findings from document analysis
   */
  listFindings(businessId: string): Promise<Finding[]>;

  /**
   * Generate B-Corp readiness roadmap based on current state
   */
  generateRoadmap(businessId: string): Promise<{ todos: Todo[] }>;

  /**
   * List all todos for a business
   */
  listTodos(businessId: string): Promise<Todo[]>;

  /**
   * Update the status of a specific todo item
   */
  updateTodoStatus(todoId: string, status: Todo['status']): Promise<Todo>;

  /**
   * Link evidence chunks to a todo item
   */
  linkEvidence(todoId: string, chunkIds: string[]): Promise<void>;

  /**
   * Get progress summary across all impact areas
   */
  impactSummary(businessId: string): Promise<ImpactSummary[]>;

  /**
   * Get evidence excerpts for a specific todo
   */
  getEvidence(todoId: string): Promise<EvidenceExcerpt[]>;

  /**
   * Re-analyze documents after changes
   */
  reanalyze(businessId: string): Promise<AnalysisJob>;

  /**
   * Reset test data with fresh random tasks
   */
  resetTestData(businessId: string): Promise<{ todos: Todo[], impactSummaries: ImpactSummary[] }>;
}