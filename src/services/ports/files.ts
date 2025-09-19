/**
 * File Service Port
 * 
 * Interface for file management operations.
 * UI components depend only on this interface.
 */

import { DataFile, FileKind, ImpactArea } from '@/domain/data-contracts';

export interface IFileService {
  /**
   * List all files in a business dataroom
   */
  list(businessId: string): Promise<DataFile[]>;

  /**
   * Upload a physical file to the dataroom
   */
  upload(businessId: string, file: File, impactArea?: ImpactArea): Promise<DataFile>;

  /**
   * Create a virtual file from text content (e.g., copy-paste)
   */
  createVirtual(
    businessId: string, 
    name: string, 
    text: string, 
    kind?: FileKind
  ): Promise<DataFile>;

  /**
   * Remove a file from the dataroom
   */
  remove(fileId: string): Promise<void>;

  /**
   * Update file metadata
   */
  updateMetadata(fileId: string, updates: Partial<Pick<DataFile, 'kind' | 'originalName' | 'isDeleted'>>): Promise<DataFile>;

  /**
   * Update file category assignment
   */
  updateFileCategory(fileId: string, categoryId: string | null): Promise<DataFile>;

  /**
   * Get file content for display/processing
   */
  getContent(fileId: string): Promise<string>;
}