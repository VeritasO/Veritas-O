import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentName } from '@/lib/validators'
import { API_CONFIG } from '@/lib/constants'

export interface AgentTask {
  id?: string
  agent: AgentName | string
  title: string
  description: string
  status?: 'pending' | 'active' | 'completed' | 'failed'
  priority?: number
  createdAt?: string
  completedAt?: string
}

export interface TaskDispatchParams {
  agent: AgentName | string
  title: string
  description: string
  priority?: number
}

export function useAgentTasks() {
  const [tasks, setTasks] = useState<AgentTask[]>([])
  const queryClient = useQueryClient()

  // Fetch agent tasks
  const { data: fetchedTasks, isLoading } = useQuery({
    queryKey: ['agent-tasks'],
    queryFn: async (): Promise<AgentTask[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks`)
        if (!response.ok) throw new Error('Failed to fetch tasks')
        return await response.json()
      } catch (error) {
        console.error('Error fetching agent tasks:', error)
        // Return mock data for development
        return [
          {
            id: '1',
            agent: 'JUNO',
            title: 'System Coordination Review',
            description: 'Review and coordinate system-wide agent activities',
            status: 'active',
            priority: 1,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            agent: 'AEGIS',
            title: 'Security Protocol Validation',
            description: 'Validate current security protocols and identify vulnerabilities',
            status: 'completed',
            priority: 2,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            completedAt: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      }
    },
    refetchInterval: 30000,
  })

  // Dispatch task mutation
  const dispatchTaskMutation = useMutation({
    mutationFn: async (params: TaskDispatchParams): Promise<AgentTask> => {
      const task: AgentTask = {
        id: Date.now().toString(),
        agent: params.agent,
        title: params.title,
        description: params.description,
        priority: params.priority || 1,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        })
        
        if (!response.ok) throw new Error('Failed to dispatch task')
        return await response.json()
      } catch (error) {
        console.error('Error dispatching task:', error)
        // For development, just return the task
        return task
      }
    },
    onSuccess: (newTask) => {
      setTasks(prev => [...prev, newTask])
      queryClient.invalidateQueries({ queryKey: ['agent-tasks'] })
      console.log(`📋 Task dispatched to ${newTask.agent}: ${newTask.title}`)
    },
    onError: (error) => {
      console.error('Failed to dispatch task:', error)
    }
  })

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string): Promise<AgentTask> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/tasks/${taskId}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) throw new Error('Failed to complete task')
        return await response.json()
      } catch (error) {
        console.error('Error completing task:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-tasks'] })
    }
  })

  const dispatchTask = useCallback((params: TaskDispatchParams) => {
    dispatchTaskMutation.mutate(params)
  }, [dispatchTaskMutation])

  const completeTask = useCallback((taskId: string) => {
    completeTaskMutation.mutate(taskId)
  }, [completeTaskMutation])

  // Update local tasks when fetched tasks change
  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks)
    }
  }, [fetchedTasks])

  return {
    tasks,
    dispatchTask,
    completeTask,
    isLoading,
    isDispatching: dispatchTaskMutation.isPending,
    isCompleting: completeTaskMutation.isPending,
    error: dispatchTaskMutation.error || completeTaskMutation.error
  }
}
