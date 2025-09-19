/**
 * Supabase File Service Adapter
 * 
 * Production implementation using Supabase Storage + Database
 * Handles file uploads, text extraction, and AI processing pipeline
 */

import { supabase } from '@/integrations/supabase/client';
import { DataFile, FileKind, ImpactArea, OcrStatus } from '@/domain/data-contracts';
import { IFileService } from '@/services/ports/files';

export class SupabaseFileService implements IFileService {
  private readonly BUCKET_NAME = 'business-documents';

  /**
   * List all files in a business dataroom
   */
  async list(businessId: string): Promise<DataFile[]> {
    try {
      // Get or create dataroom for the business
      const dataroom = await this.ensureDataroom(businessId);
      
      // Fetch files from the enhanced files table
      const { data: files, error } = await supabase
        .from('files')
        .select(`
          id,
          storage_path,
          original_name,
          file_kind,
          content_type,
          file_size_bytes,
          impact_area,
          extraction_status,
          uploaded_at,
          created_at,
          updated_at,
          extracted_text,
          extraction_method,
          processed_at,
          category_id,
          is_deleted
        `)
        .eq('dataroom_id', dataroom.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Transform to DataFile format for backward compatibility
      return files.map(file => ({
        id: file.id,
        dataroomId: dataroom.id,
        kind: (file.file_kind as FileKind) || 'other',
        originalName: file.original_name,
        storagePath: file.storage_path,
        contentType: file.content_type || undefined,
        uploadedAt: file.uploaded_at,
        ocrStatus: this.mapExtractionStatus(file.extraction_status),
        size: file.file_size_bytes ? Number(file.file_size_bytes) : undefined,
        impactArea: file.impact_area as ImpactArea || undefined,
        categoryId: file.category_id || undefined,
        isDeleted: file.is_deleted || false,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        extractedText: file.extracted_text,
        extractionStatus: file.extraction_status,
        extractionMethod: file.extraction_method,
        processedAt: file.processed_at,
        fileSizeBytes: file.file_size_bytes ? Number(file.file_size_bytes) : undefined,
      }));

    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files');
    }
  }

  /**
   * Upload a physical file to the dataroom
   */
  async upload(businessId: string, file: File, impactArea?: ImpactArea): Promise<DataFile> {
    try {
      // Get or create dataroom
      const dataroom = await this.ensureDataroom(businessId);
      
      // Generate unique storage path with user ID for RLS
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${user.id}/${timestamp}_${sanitizedName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Insert file record into database - no automatic categorization
      const fileKind = this.inferFileKind(file.name);
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          dataroom_id: dataroom.id,
          storage_bucket: this.BUCKET_NAME,
          storage_path: storagePath,
          original_name: file.name,
          file_kind: fileKind,
          content_type: file.type,
          file_size_bytes: file.size,
          impact_area: impactArea,
          extraction_status: 'pending',
          category_id: null, // No automatic categorization
          is_deleted: false
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Queue async text extraction
      await this.queueTextExtraction(fileRecord.id, businessId, dataroom.id);

      return {
        id: fileRecord.id,
        dataroomId: dataroom.id,
        kind: fileKind,
        originalName: file.name,
        storagePath,
        contentType: file.type,
        uploadedAt: fileRecord.uploaded_at,
        ocrStatus: 'pending',
        size: file.size,
        impactArea,
      };

    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Create a virtual file from text content
   */
  async createVirtual(
    businessId: string, 
    name: string, 
    text: string, 
    kind?: FileKind
  ): Promise<DataFile> {
    try {
      const dataroom = await this.ensureDataroom(businessId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create text blob and upload
      const textBlob = new Blob([text], { type: 'text/plain' });
      const timestamp = Date.now();
      const sanitizedName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${user.id}/virtual_${timestamp}_${sanitizedName}.txt`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(storagePath, textBlob);

      if (uploadError) throw uploadError;

      // Insert file record
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          dataroom_id: dataroom.id,
          storage_bucket: this.BUCKET_NAME,
          storage_path: storagePath,
          original_name: name,
          file_kind: kind || 'other',
          content_type: 'text/plain',
          file_size_bytes: text.length,
          extracted_text: text,
          extraction_status: 'completed',
          extraction_method: 'plain_text'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        id: fileRecord.id,
        dataroomId: dataroom.id,
        kind: kind || 'other',
        originalName: name,
        storagePath,
        contentType: 'text/plain',
        uploadedAt: fileRecord.uploaded_at,
        ocrStatus: 'done',
        size: text.length,
      };

    } catch (error) {
      console.error('Error creating virtual file:', error);
      throw new Error('Failed to create virtual file');
    }
  }

  /**
   * Remove a file from the dataroom (soft delete)
   */
  async remove(fileId: string): Promise<void> {
    try {
      // Soft delete by setting is_deleted flag
      const { error } = await supabase
        .from('files')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId);

      if (error) throw error;

    } catch (error) {
      console.error('Error removing file:', error);
      throw new Error('Failed to remove file');
    }
  }

  /**
   * Update file category assignment
   */
  async updateFileCategory(fileId: string, categoryId: string | null): Promise<DataFile> {
    try {
      const { data: file, error } = await supabase
        .from('files')
        .update({ 
          category_id: categoryId,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId)
        .select(`
          id,
          dataroom_id,
          storage_path,
          original_name,
          file_kind,
          content_type,
          file_size_bytes,
          impact_area,
          extraction_status,
          uploaded_at,
          created_at,
          updated_at,
          extracted_text,
          extraction_method,
          processed_at,
          category_id,
          is_deleted
        `)
        .single();

      if (error) throw error;

      return {
        id: file.id,
        dataroomId: file.dataroom_id,
        kind: file.file_kind as FileKind,
        originalName: file.original_name,
        storagePath: file.storage_path,
        contentType: file.content_type || undefined,
        uploadedAt: file.uploaded_at,
        ocrStatus: this.mapExtractionStatus(file.extraction_status),
        size: file.file_size_bytes ? Number(file.file_size_bytes) : undefined,
        impactArea: file.impact_area as ImpactArea || undefined,
        categoryId: file.category_id || undefined,
        isDeleted: file.is_deleted || false,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        extractedText: file.extracted_text,
        extractionStatus: file.extraction_status,
        extractionMethod: file.extraction_method,
        processedAt: file.processed_at,
        fileSizeBytes: file.file_size_bytes ? Number(file.file_size_bytes) : undefined,
      };

    } catch (error) {
      console.error('Error updating file category:', error);
      throw new Error('Failed to update file category');
    }
  }

  /**
   * Update file metadata
   */
  async updateMetadata(
    fileId: string, 
    updates: Partial<Pick<DataFile, 'kind' | 'originalName' | 'isDeleted'>>
  ): Promise<DataFile> {
    try {
      const dbUpdates: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.kind) dbUpdates.file_kind = updates.kind;
      if (updates.originalName) dbUpdates.original_name = updates.originalName;
      if (updates.isDeleted !== undefined) dbUpdates.is_deleted = updates.isDeleted;

      const { data: file, error } = await supabase
        .from('files')
        .update(dbUpdates)
        .eq('id', fileId)
        .select(`
          id,
          dataroom_id,
          storage_path,
          original_name,
          file_kind,
          content_type,
          file_size_bytes,
          impact_area,
          extraction_status,
          uploaded_at,
          created_at,
          updated_at,
          extracted_text,
          extraction_method,
          processed_at,
          category_id,
          is_deleted
        `)
        .single();

      if (error) throw error;

      return {
        id: file.id,
        dataroomId: file.dataroom_id,
        kind: file.file_kind as FileKind,
        originalName: file.original_name,
        storagePath: file.storage_path,
        contentType: file.content_type || undefined,
        uploadedAt: file.uploaded_at,
        ocrStatus: this.mapExtractionStatus(file.extraction_status),
        size: file.file_size_bytes ? Number(file.file_size_bytes) : undefined,
        impactArea: file.impact_area as ImpactArea || undefined,
        categoryId: file.category_id || undefined,
        isDeleted: file.is_deleted || false,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        extractedText: file.extracted_text,
        extractionStatus: file.extraction_status,
        extractionMethod: file.extraction_method,
        processedAt: file.processed_at,
        fileSizeBytes: file.file_size_bytes ? Number(file.file_size_bytes) : undefined,
      };

    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw new Error('Failed to update file metadata');
    }
  }

  /**
   * Get file content for display/processing
   */
  async getContent(fileId: string): Promise<string> {
    try {
      // First check if we have extracted text
      const { data: file, error: fetchError } = await supabase
        .from('files')
        .select('extracted_text, storage_bucket, storage_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Return extracted text if available
      if (file.extracted_text) {
        return file.extracted_text;
      }

      // Fallback to downloading and reading the file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(file.storage_bucket)
        .download(file.storage_path);

      if (downloadError) throw downloadError;

      return await fileData.text();

    } catch (error) {
      console.error('Error getting file content:', error);
      throw new Error('Failed to get file content');
    }
  }

  // Private helper methods

  private async ensureDataroom(businessId: string) {
    const { data: existing, error: fetchError } = await supabase
      .from('datarooms')
      .select('id')
      .eq('business_id', businessId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) return existing;

    // Create new dataroom
    const { data: newDataroom, error: createError } = await supabase
      .from('datarooms')
      .insert({ business_id: businessId })
      .select('id')
      .single();

    if (createError) throw createError;
    return newDataroom;
  }

  private inferFileKind(filename: string): FileKind {
    const name = filename.toLowerCase();
    
    if (name.includes('business') && name.includes('plan')) return 'business_plan';
    if (name.includes('articles') || name.includes('association')) return 'articles_of_association';
    if (name.includes('certificate') || name.includes('incorporation')) return 'certificate_of_incorp';
    if (name.includes('employee') || name.includes('handbook')) return 'employee_handbook';
    if (name.includes('hr') || name.includes('human')) return 'hr_policy';
    if (name.includes('diversity') || name.includes('inclusion')) return 'di_policy';
    if (name.includes('environment') || name.includes('sustainability')) return 'env_policy';
    if (name.includes('supplier') || name.includes('vendor')) return 'supplier_code';
    if (name.includes('privacy') || name.includes('data')) return 'privacy_policy';
    if (name.includes('impact') || name.includes('report')) return 'impact_report';
    
    return 'other';
  }

  private mapExtractionStatus(status: string): OcrStatus {
    switch (status) {
      case 'pending': return 'pending';
      case 'processing': return 'pending';
      case 'completed': return 'done';
      case 'failed': return 'failed';
      default: return 'pending';
    }
  }

  private async queueTextExtraction(fileId: string, businessId: string, dataroomId: string) {
    try {
      // Create analysis job for async text extraction
      await supabase
        .from('analysis_jobs')
        .insert({
          business_id: businessId,
          dataroom_id: dataroomId,
          job_type: 'document_extraction',
          status: 'pending',
          metadata: { file_id: fileId }
        });

      // TODO: Trigger edge function for processing
      // This will be implemented in Phase 2
      console.log(`Queued text extraction for file ${fileId}`);

    } catch (error) {
      console.error('Failed to queue text extraction:', error);
      // Don't throw - upload should succeed even if extraction queuing fails
    }
  }
}

export const supabaseFileService = new SupabaseFileService();