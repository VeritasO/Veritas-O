import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})

// Query keys factory
export const queryKeys = {
  agents: ['agents'] as const,
  agentTasks: (agentName?: string) => 
    agentName ? ['agents', 'tasks', agentName] : ['agents', 'tasks'],
  books: ['books'] as const,
  doctrine: ['doctrine'] as const,
  reflections: ['reflections'] as const,
  rituals: ['rituals'] as const,
  contradictions: ['contradictions'] as const,
  auditLogs: ['audit-logs'] as const,
}
