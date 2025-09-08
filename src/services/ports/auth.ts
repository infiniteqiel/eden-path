/**
 * Authentication Service Port
 * 
 * Interface for user authentication and session management.
 */

import { Account } from '@/domain/data-contracts';

export interface IAuthService {
  /**
   * Sign in with email and password
   */
  signIn(email: string, password: string): Promise<{ account: Account; token: string }>;

  /**
   * Sign up with email and password
   */
  signUp(email: string, password: string, name: string): Promise<{ account: Account; token: string }>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<Account | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Reset password
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<Pick<Account, 'name'>>): Promise<Account>;
}