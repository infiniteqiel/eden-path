/**
 * File Service Port
 * 
 * Interface for file management operations.
 * UI components depend only on this interface.
 */

import { DataFile, FileKind } from '@/domain/data-contracts';

export interface IFileService {
  /**
   * List all files in a business dataroom
   */
  list(businessId: string): Promise<DataFile[]>;

  /**
   * Upload a physical file to the dataroom
   */
  upload(businessId: string, file: File): Promise<DataFile>;

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
  updateMetadata(fileId: string, updates: Partial<Pick<DataFile, 'kind' | 'originalName'>>): Promise<DataFile>;

  /**
   * Get file content for display/processing
   */
  getContent(fileId: string): Promise<string>;
}