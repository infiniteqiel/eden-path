/**
 * Analysis Store
 * 
 * Manages document analysis, todos, and impact tracking.
 */

import { create } from 'zustand';
import { Todo, ImpactSummary, AnalysisJob, Finding, EvidenceExcerpt, ImpactArea } from '@/domain/data-contracts';
import { analysisService } from '@/services/registry';

interface AnalysisState {
  todos: Todo[];
  binnedTodos: Todo[];
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
  loadBinnedTodos: (businessId: string) => Promise<void>;
  loadImpactSummaries: (businessId: string) => Promise<void>;
  updateTodoStatus: (todoId: string, status: Todo['status']) => Promise<void>;
  assignTaskToSubArea: (todoId: string, subAreaId: string | null) => Promise<void>;
  updateTaskImpactArea: (todoId: string, impactArea: ImpactArea) => Promise<void>;
  updateTaskLockState: (todoId: string, isLocked: boolean) => Promise<void>;
  deleteTask: (todoId: string) => Promise<void>;
  restoreTask: (todoId: string) => Promise<void>;
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
  binnedTodos: [],
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

  assignTaskToSubArea: async (todoId: string, subAreaId: string | null) => {
    const { todos } = get();
    const originalTodo = todos.find(t => t.id === todoId);
    if (!originalTodo) return;

    // Optimistically update UI first
    set(state => ({
      todos: state.todos.map(todo => 
        todo.id === todoId ? { ...todo, subAreaId } : todo
      ),
      error: null
    }));

    try {
      const updatedTodo = await analysisService.assignTaskToSubArea(todoId, subAreaId);
      
      // Confirm the update with server response
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === todoId ? updatedTodo : todo
        )
      }));
    } catch (error) {
      // Revert optimistic update on error
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === todoId ? originalTodo : todo
        ),
        error: error instanceof Error ? error.message : 'Failed to assign task to sub-area'
      }));
    }
  },

  updateTaskImpactArea: async (todoId: string, impactArea: ImpactArea) => {
    const { todos } = get();
    const originalTodo = todos.find(t => t.id === todoId);
    if (!originalTodo) return;

    // Optimistically update UI first
    set(state => ({
      todos: state.todos.map(todo => 
        todo.id === todoId ? { ...todo, impact: impactArea } : todo
      ),
      error: null
    }));

    try {
      const updatedTodo = await analysisService.updateTaskImpactArea(todoId, impactArea);
      
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
        error: error instanceof Error ? error.message : 'Failed to update task impact area'
      }));
    }
  },

  updateTaskLockState: async (todoId: string, isLocked: boolean) => {
    const { todos } = get();
    const originalTodo = todos.find(t => t.id === todoId);
    if (!originalTodo) return;

    // Optimistically update UI first
    set(state => ({
      todos: state.todos.map(todo => 
        todo.id === todoId ? { ...todo, isImpactLocked: isLocked } : todo
      ),
      error: null
    }));

    try {
      const updatedTodo = await analysisService.updateTaskLockState(todoId, isLocked);
      
      // Confirm the update with server response
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === todoId ? updatedTodo : todo
        )
      }));
    } catch (error) {
      // Revert optimistic update on error
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === todoId ? originalTodo : todo
        ),
        error: error instanceof Error ? error.message : 'Failed to update task lock state'
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

  loadBinnedTodos: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const binnedTodos = await analysisService.listBinnedTodos(businessId);
      set({ binnedTodos, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load binned todos', 
        isLoading: false 
      });
    }
  },

  deleteTask: async (todoId: string) => {
    const { todos } = get();
    const taskToDelete = todos.find(t => t.id === todoId);
    if (!taskToDelete) return;

    // Optimistically update UI first
    set(state => ({
      todos: state.todos.filter(todo => todo.id !== todoId),
      binnedTodos: [...state.binnedTodos, { ...taskToDelete, deletedAt: new Date().toISOString() }],
      error: null
    }));

    try {
      await analysisService.deleteTask(todoId);
      
      // Refresh impact summaries to reflect the change
      const businessId = taskToDelete.businessId;
      if (businessId) {
        await get().loadImpactSummaries(businessId);
      }
    } catch (error) {
      // Revert optimistic update on error
      set(state => ({
        todos: [...state.todos, taskToDelete],
        binnedTodos: state.binnedTodos.filter(todo => todo.id !== todoId),
        error: error instanceof Error ? error.message : 'Failed to delete task'
      }));
    }
  },

  restoreTask: async (todoId: string) => {
    const { binnedTodos } = get();
    const taskToRestore = binnedTodos.find(t => t.id === todoId);
    if (!taskToRestore) return;

    // Optimistically update UI first
    const restoredTask = { ...taskToRestore, deletedAt: undefined };
    set(state => ({
      binnedTodos: state.binnedTodos.filter(todo => todo.id !== todoId),
      todos: [...state.todos, restoredTask],
      error: null
    }));

    try {
      await analysisService.restoreTask(todoId);
      
      // Refresh impact summaries to reflect the change
      const businessId = taskToRestore.businessId;
      if (businessId) {
        await get().loadImpactSummaries(businessId);
      }
    } catch (error) {
      // Revert optimistic update on error
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== todoId),
        binnedTodos: [...state.binnedTodos, taskToRestore],
        error: error instanceof Error ? error.message : 'Failed to restore task'
      }));
    }
  },

  clearError: () => set({ error: null }),
}));