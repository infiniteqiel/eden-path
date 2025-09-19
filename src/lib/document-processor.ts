/**
 * Document Processing Utilities
 * 
 * Client-side helpers for document upload and processing
 */

import { supabase } from '@/integrations/supabase/client';

export interface ProcessingProgress {
  fileId: string;
  fileName: string;
  status: 'uploading' | 'extracting' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

/**
 * Process uploaded files with progress tracking
 */
export async function processDocumentsWithProgress(
  files: File[],
  businessId: string,
  onProgress?: (progress: ProcessingProgress[]) => void
): Promise<void> {
  const progressMap = new Map<string, ProcessingProgress>();
  
  // Initialize progress tracking
  files.forEach(file => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    progressMap.set(file.name, {
      fileId: tempId,
      fileName: file.name,
      status: 'uploading',
      progress: 0
    });
  });

  // Report initial progress
  onProgress?.(Array.from(progressMap.values()));

  try {
    // Upload files in parallel
    const uploadPromises = files.map(async (file) => {
      const progress = progressMap.get(file.name)!;
      
      try {
        // Simulate upload progress (in real implementation, this would track actual upload)
        progress.progress = 25;
        progress.status = 'uploading';
        onProgress?.(Array.from(progressMap.values()));

        // Use the file service for upload without impact area (defaults to "Other")
        const { fileService } = await import('@/services/registry');
        const uploadedFile = await fileService.upload(businessId, file, "Other");

        progress.fileId = uploadedFile.id;
        progress.progress = 50;
        progress.status = 'extracting';
        onProgress?.(Array.from(progressMap.values()));

        // Trigger async text extraction
        await triggerTextExtraction(uploadedFile.id, businessId);

        progress.progress = 100;
        progress.status = 'completed';
        onProgress?.(Array.from(progressMap.values()));

      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        progress.status = 'failed';
        progress.error = String(error);
        onProgress?.(Array.from(progressMap.values()));
      }
    });

    await Promise.allSettled(uploadPromises);

  } catch (error) {
    console.error('Failed to process documents:', error);
    throw error;
  }
}

/**
 * Trigger server-side text extraction for a file
 */
export async function triggerTextExtraction(fileId: string, businessId: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('extract-document-text', {
      body: { 
        file_id: fileId, 
        business_id: businessId 
      }
    });

    if (error) {
      console.error('Failed to trigger text extraction:', error);
      // Don't throw - extraction can happen later
    }
  } catch (error) {
    console.error('Text extraction trigger error:', error);
    // Don't throw - this is a background process
  }
}

/**
 * Check extraction status for files
 */
export async function checkExtractionStatus(fileIds: string[]): Promise<Record<string, string>> {
  try {
    const { data: files, error } = await supabase
      .from('files')
      .select('id, extraction_status')
      .in('id', fileIds);

    if (error) throw error;

    const statusMap: Record<string, string> = {};
    files.forEach(file => {
      statusMap[file.id] = file.extraction_status;
    });

    return statusMap;
  } catch (error) {
    console.error('Failed to check extraction status:', error);
    return {};
  }
}

/**
 * Get file content with fallback to storage download
 */
export async function getFileContent(fileId: string): Promise<string> {
  try {
    const { fileService } = await import('@/services/registry');
    return await fileService.getContent(fileId);
  } catch (error) {
    console.error('Failed to get file content:', error);
    return 'Failed to load file content';
  }
}