/**
 * Data Room Store
 * 
 * Manages file uploads and data room contents.
 */

import { create } from 'zustand';
import { DataFile, UploadProgress, ImpactArea, FileKind } from '@/domain/data-contracts';
import { fileService } from '@/services/registry';

interface DataroomState {
  files: DataFile[];
  uploads: UploadProgress[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFiles: (businessId: string) => Promise<void>;
  uploadFile: (businessId: string, file: File, impactArea?: ImpactArea) => Promise<void>;
  createVirtualFile: (businessId: string, name: string, text: string, kind?: FileKind) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  updateFileMetadata: (fileId: string, updates: Partial<Pick<DataFile, 'kind' | 'originalName'>>) => Promise<void>;
  getFileContent: (fileId: string) => Promise<string>;
  clearUploads: () => void;
  clearError: () => void;
}

export const useDataroomStore = create<DataroomState>((set, get) => ({
  files: [],
  uploads: [],
  isLoading: false,
  error: null,

  loadFiles: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const files = await fileService.list(businessId);
      set({ files, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load files', 
        isLoading: false 
      });
    }
  },

  uploadFile: async (businessId: string, file: File, impactArea: ImpactArea = "Other") => {
    const uploadId = `upload-${Date.now()}-${Math.random()}`;
    
    // Add upload progress tracking
    set(state => ({
      uploads: [...state.uploads, {
        fileId: uploadId,
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }]
    }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        set(state => ({
          uploads: state.uploads.map(upload => 
            upload.fileId === uploadId && upload.progress < 90
              ? { ...upload, progress: upload.progress + 10 }
              : upload
          )
        }));
      }, 200);

      const uploadedFile = await fileService.upload(businessId, file, impactArea);
      clearInterval(progressInterval);

      // Update progress to complete
      set(state => ({
        uploads: state.uploads.map(upload => 
          upload.fileId === uploadId
            ? { ...upload, progress: 100, status: 'complete' }
            : upload
        ),
        files: [...state.files, uploadedFile]
      }));

      // Remove upload progress after delay
      setTimeout(() => {
        set(state => ({
          uploads: state.uploads.filter(upload => upload.fileId !== uploadId)
        }));
      }, 2000);

    } catch (error) {
      set(state => ({
        uploads: state.uploads.map(upload => 
          upload.fileId === uploadId
            ? { 
                ...upload, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed' 
              }
            : upload
        ),
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
    }
  },

  createVirtualFile: async (businessId: string, name: string, text: string, kind?: FileKind) => {
    set({ isLoading: true, error: null });
    try {
      const virtualFile = await fileService.createVirtual(businessId, name, text, kind);
      set(state => ({ 
        files: [...state.files, virtualFile], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create virtual file', 
        isLoading: false 
      });
    }
  },

  removeFile: async (fileId: string) => {
    set({ error: null });
    try {
      await fileService.remove(fileId);
      set(state => ({
        files: state.files.filter(f => f.id !== fileId)
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove file'
      });
    }
  },

  updateFileMetadata: async (fileId: string, updates: Partial<Pick<DataFile, 'kind' | 'originalName'>>) => {
    set({ error: null });
    try {
      const updatedFile = await fileService.updateMetadata(fileId, updates);
      set(state => ({
        files: state.files.map(f => f.id === fileId ? updatedFile : f)
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update file'
      });
    }
  },

  getFileContent: async (fileId: string): Promise<string> => {
    try {
      return await fileService.getContent(fileId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get file content'
      });
      throw error;
    }
  },

  clearUploads: () => set({ uploads: [] }),
  clearError: () => set({ error: null }),
}));