/**
 * AI Chat Hierarchy System
 * 
 * Manages chat contexts at different levels:
 * Home → Impact Area → Specific → Task level
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    businessId?: string;
    impactArea?: string;
    taskId?: string;
    documentIds?: string[];
  };
}

export interface ChatSession {
  id: string;
  level: 'home' | 'impact' | 'specific' | 'task';
  context: {
    businessId: string;
    impactArea?: string;
    specificArea?: string;
    taskId?: string;
  };
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface AIChatHierarchyState {
  sessions: ChatSession[];
  activeSessions: Record<string, string>; // level-context-key -> sessionId
  
  // Actions
  createSession: (level: ChatSession['level'], context: ChatSession['context']) => string;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getSession: (sessionId: string) => ChatSession | undefined;
  getActiveSession: (level: ChatSession['level'], context: ChatSession['context']) => ChatSession | undefined;
  clearSessions: () => void;
}

export const useAIChatHierarchy = create<AIChatHierarchyState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessions: {},

      createSession: (level, context) => {
        const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const contextKey = `${level}-${context.businessId}-${context.impactArea || ''}-${context.specificArea || ''}-${context.taskId || ''}`;
        
        const newSession: ChatSession = {
          id: sessionId,
          level,
          context,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          sessions: [...state.sessions, newSession],
          activeSessions: {
            ...state.activeSessions,
            [contextKey]: sessionId
          }
        }));

        return sessionId;
      },

      addMessage: (sessionId, message) => {
        const messageWithId: ChatMessage = {
          ...message,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, messageWithId],
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
      },

      getSession: (sessionId) => {
        return get().sessions.find(s => s.id === sessionId);
      },

      getActiveSession: (level, context) => {
        const contextKey = `${level}-${context.businessId}-${context.impactArea || ''}-${context.specificArea || ''}-${context.taskId || ''}`;
        const sessionId = get().activeSessions[contextKey];
        return sessionId ? get().getSession(sessionId) : undefined;
      },

      clearSessions: () => set({ sessions: [], activeSessions: {} }),
    }),
    {
      name: 'bcpath-ai-chat-hierarchy',
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessions: state.activeSessions,
      }),
    }
  )
);

// Hook for getting the appropriate chat context
export function useChatContext(
  level: ChatSession['level'],
  businessId: string,
  impactArea?: string,
  specificArea?: string,
  taskId?: string
) {
  const { getActiveSession, createSession } = useAIChatHierarchy();
  
  const context = {
    businessId,
    impactArea,
    specificArea,
    taskId,
  };

  let session = getActiveSession(level, context);
  
  if (!session) {
    const sessionId = createSession(level, context);
    session = getActiveSession(level, context);
  }

  return session;
}