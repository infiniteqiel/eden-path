/**
 * Legal Requirements Service Port
 * 
 * Interface for UK legal requirement tracking.
 */

import { LegalStatus, LegalStep } from '@/domain/data-contracts';

export interface ILegalService {
  /**
   * Get current legal status for a business
   */
  getStatus(businessId: string): Promise<LegalStatus>;

  /**
   * Update legal status
   */
  setStatus(businessId: string, patch: Partial<LegalStatus>): Promise<LegalStatus>;

  /**
   * Get the legal requirement steps
   */
  getSteps(businessId: string): Promise<LegalStep[]>;

  /**
   * Mark a step as completed
   */
  completeStep(businessId: string, stepId: string, attachments?: string[]): Promise<void>;

  /**
   * Get template documents for legal requirements
   */
  getTemplates(): Promise<{
    id: string;
    name: string;
    description: string;
    templateUrl?: string;
    content?: string;
  }[]>;
}