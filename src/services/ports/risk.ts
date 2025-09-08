/**
 * Risk Assessment Service Port
 * 
 * Interface for FR3 risk assessment functionality.
 */

import { RiskAnswer, RiskQuestion } from '@/domain/data-contracts';

export interface IRiskService {
  /**
   * Get all available risk assessment questions
   */
  listQuestions(): Promise<RiskQuestion[]>;

  /**
   * Get current answers for a business
   */
  getAnswers(businessId: string): Promise<RiskAnswer[]>;

  /**
   * Set/update an answer for a specific question
   */
  setAnswer(
    businessId: string, 
    code: string, 
    answer: boolean, 
    notes?: string
  ): Promise<void>;

  /**
   * Get risk assessment summary
   */
  getSummary(businessId: string): Promise<{
    totalQuestions: number;
    answeredCount: number;
    flaggedCount: number;
    completionPct: number;
  }>;

  /**
   * Clear all answers for a business
   */
  clearAnswers(businessId: string): Promise<void>;
}