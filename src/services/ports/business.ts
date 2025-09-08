/**
 * Business Service Port
 * 
 * Interface for business entity management.
 */

import { Business, Account } from '@/domain/data-contracts';

export interface IBusinessService {
  /**
   * List all businesses for the current user
   */
  list(): Promise<Business[]>;

  /**
   * Get a specific business by ID
   */
  get(id: string): Promise<Business>;

  /**
   * Create a new business
   */
  create(business: Omit<Business, 'id' | 'createdAt'>): Promise<Business>;

  /**
   * Update business information
   */
  update(id: string, updates: Partial<Business>): Promise<Business>;

  /**
   * Delete a business (and all associated data)
   */
  delete(id: string): Promise<void>;

  /**
   * Get the current user's account
   */
  getCurrentAccount(): Promise<Account>;
}