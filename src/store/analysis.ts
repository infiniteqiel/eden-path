/**
 * Analysis Store
 * 
 * Manages document analysis, todos, and impact tracking.
 */

import { create } from 'zustand';
import { Todo, ImpactSummary, AnalysisJob, Finding, EvidenceExcerpt } from '@/domain/data-contracts';
import { analysisService } from '@/services/registry';

interface AnalysisState {
  todos: Todo[];
  impactSummaries: ImpactSummary[];
  findings: Finding[];
  currentJob: AnalysisJob | null;
  evidenceDrawer: {
    isOpen: boolean;
    todoId: string | null;
    evidence: EvidenceExcerpt[];
    isLoading: boolean;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTodos: (businessId: string) => Promise<void>;
  loadImpactSummaries: (businessId: string) => Promise<void>;
  updateTodoStatus: (todoId: string, status: Todo['status']) => Promise<void>;
  startAnalysis: (businessId: string) => Promise<void>;
  generateRoadmap: (businessId: string) => Promise<void>;
  resetTestData: (businessId: string) => Promise<void>;
  resetAllTestData: () => Promise<void>;
  openEvidenceDrawer: (todoId: string) => Promise<void>;
  closeEvidenceDrawer: () => void;
  clearError: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  todos: [],
  impactSummaries: [],
  findings: [],
  currentJob: null,
  evidenceDrawer: {
    isOpen: false,
    todoId: null,
    evidence: [],
    isLoading: false,
  },
  isLoading: false,
  error: null,

  loadTodos: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const todos = await analysisService.listTodos(businessId);
      set({ todos, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load todos', 
        isLoading: false 
      });
    }
  },

  loadImpactSummaries: async (businessId: string) => {
    set({ error: null });
    try {
      const summaries = await analysisService.impactSummary(businessId);
      set({ impactSummaries: summaries });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load impact summaries'
      });
    }
  },

  updateTodoStatus: async (todoId: string, status: Todo['status']) => {
    const { todos } = get();
    const originalTodo = todos.find(t => t.id === todoId);
    if (!originalTodo) return;

    // Optimistically update UI first
    set(state => ({
      todos: state.todos.map(todo => 
        todo.id === todoId ? { ...todo, status } : todo
      ),
      error: null
    }));

    try {
      const updatedTodo = await analysisService.updateTodoStatus(todoId, status);
      
      // Confirm the update with server response
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === todoId ? updatedTodo : todo
        )
      }));

      // Refresh impact summaries to reflect the change
      const businessId = originalTodo.businessId;
      if (businessId) {
        await get().loadImpactSummaries(businessId);
      }
    } catch (error) {
      // Revert optimistic update on error
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === todoId ? originalTodo : todo
        ),
        error: error instanceof Error ? error.message : 'Failed to update todo'
      }));
    }
  },

  startAnalysis: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const job = await analysisService.startIngestion(businessId);
      set({ currentJob: job, isLoading: false });

      // Poll for job completion
      const pollInterval = setInterval(async () => {
        try {
          const updatedJob = await analysisService.getJob(job.id);
          set({ currentJob: updatedJob });

          if (updatedJob.status === 'done' || updatedJob.status === 'failed') {
            clearInterval(pollInterval);
            if (updatedJob.status === 'done') {
              // Reload todos and summaries
              await get().loadTodos(businessId);
              await get().loadImpactSummaries(businessId);
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          set({ 
            error: error instanceof Error ? error.message : 'Job polling failed'
          });
        }
      }, 2000);

    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start analysis', 
        isLoading: false 
      });
    }
  },

  generateRoadmap: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { todos } = await analysisService.generateRoadmap(businessId);
      set({ todos, isLoading: false });
      
      // Also refresh impact summaries
      await get().loadImpactSummaries(businessId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate roadmap', 
        isLoading: false 
      });
    }
  },

  resetTestData: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { todos, impactSummaries } = await analysisService.resetTestData(businessId);
      set({ 
        todos, 
        impactSummaries, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset test data', 
        isLoading: false 
      });
    }
  },

  resetAllTestData: async () => {
    set({ isLoading: true, error: null });
    try {
      await analysisService.resetAllTestData();
      set({ 
        todos: [], 
        impactSummaries: [], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset all test data', 
        isLoading: false 
      });
    }
  },

  openEvidenceDrawer: async (todoId: string) => {
    set(state => ({
      evidenceDrawer: {
        ...state.evidenceDrawer,
        isOpen: true,
        todoId,
        isLoading: true,
        evidence: []
      }
    }));

    try {
      const evidence = await analysisService.getEvidence(todoId);
      set(state => ({
        evidenceDrawer: {
          ...state.evidenceDrawer,
          evidence,
          isLoading: false
        }
      }));
    } catch (error) {
      set(state => ({
        evidenceDrawer: {
          ...state.evidenceDrawer,
          isLoading: false
        },
        error: error instanceof Error ? error.message : 'Failed to load evidence'
      }));
    }
  },

  closeEvidenceDrawer: () => {
    set(state => ({
      evidenceDrawer: {
        isOpen: false,
        todoId: null,
        evidence: [],
        isLoading: false
      }
    }));
  },

  clearError: () => set({ error: null }),
}));