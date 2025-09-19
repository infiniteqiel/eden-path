/**
 * Document Categories Service Port
 * 
 * Interface for user-defined document category management operations.
 */

import { DocumentCategory } from '@/domain/data-contracts';

export interface IDocumentCategoryService {
  /**
   * List all document categories for a business
   */
  list(businessId: string): Promise<DocumentCategory[]>;

  /**
   * Create a new document category
   */
  create(
    businessId: string,
    category: Omit<DocumentCategory, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>
  ): Promise<DocumentCategory>;

  /**
   * Update a document category
   */
  update(
    categoryId: string,
    updates: Partial<Pick<DocumentCategory, 'name' | 'description' | 'color' | 'icon' | 'sortOrder'>>
  ): Promise<DocumentCategory>;

  /**
   * Delete a document category
   */
  delete(categoryId: string): Promise<void>;

  /**
   * Get a single document category by ID
   */
  getById(categoryId: string): Promise<DocumentCategory | null>;

  /**
   * Reorder categories for a business
   */
  reorder(businessId: string, categoryIds: string[]): Promise<void>;
}