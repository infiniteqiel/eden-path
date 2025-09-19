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
  binnedFiles: DataFile[];
  uploads: UploadProgress[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFiles: (businessId: string) => Promise<void>;
  loadBinnedFiles: (businessId: string) => Promise<void>;
  uploadFile: (businessId: string, file: File, impactArea?: ImpactArea) => Promise<void>;
  createVirtualFile: (businessId: string, name: string, text: string, kind?: FileKind) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  restoreFile: (fileId: string) => Promise<void>;
  updateFileMetadata: (fileId: string, updates: Partial<Pick<DataFile, 'kind' | 'originalName'>>) => Promise<void>;
  getFileContent: (fileId: string) => Promise<string>;
  clearUploads: () => void;
  clearError: () => void;
}

export const useDataroomStore = create<DataroomState>((set, get) => ({
  files: [],
  binnedFiles: [],
  uploads: [],
  isLoading: false,
  error: null,

  loadFiles: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const allFiles = await fileService.list(businessId);
      const files = allFiles.filter(file => !file.isDeleted);
      set({ files, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load files', 
        isLoading: false 
      });
    }
  },

  loadBinnedFiles: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const allFiles = await fileService.list(businessId);
      const binnedFiles = allFiles.filter(file => file.isDeleted);
      set({ binnedFiles, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load binned files', 
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
    const { files } = get();
    const fileToDelete = files.find(f => f.id === fileId);
    
    // Optimistically update UI
    set(state => ({
      files: state.files.filter(f => f.id !== fileId),
      binnedFiles: fileToDelete ? [...state.binnedFiles, { ...fileToDelete, isDeleted: true }] : state.binnedFiles,
      error: null
    }));

    try {
      await fileService.remove(fileId);
    } catch (error) {
      // Revert on error
      set(state => ({
        files: fileToDelete ? [...state.files, fileToDelete] : state.files,
        binnedFiles: state.binnedFiles.filter(f => f.id !== fileId),
        error: error instanceof Error ? error.message : 'Failed to delete file'
      }));
    }
  },

  restoreFile: async (fileId: string) => {
    const { binnedFiles } = get();
    const fileToRestore = binnedFiles.find(f => f.id === fileId);
    
    if (!fileToRestore) return;
    
    // Optimistically update UI
    const restoredFile = { ...fileToRestore, isDeleted: false };
    set(state => ({
      binnedFiles: state.binnedFiles.filter(f => f.id !== fileId),
      files: [...state.files, restoredFile],
      error: null
    }));

    try {
      await fileService.updateMetadata(fileId, { isDeleted: false } as any);
    } catch (error) {
      // Revert on error
      set(state => ({
        files: state.files.filter(f => f.id !== fileId),
        binnedFiles: [...state.binnedFiles, fileToRestore],
        error: error instanceof Error ? error.message : 'Failed to restore file'
      }));
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