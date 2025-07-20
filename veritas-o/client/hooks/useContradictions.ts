import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentName } from '@/lib/validators'
import { API_CONFIG } from '@/lib/constants'

export interface Contradiction {
  id?: string
  source: AgentName | string
  content: string
  type: 'doctrinal' | 'logical' | 'temporal' | 'judicial-paradox' | 'system-conflict'
  timestamp: string
  severity?: 'minor' | 'moderate' | 'major' | 'critical'
  resolved?: boolean
  resolution?: string
}

export interface LogContradictionParams {
  source: AgentName | string
  content: string
  type: Contradiction['type']
  timestamp: string
  severity?: Contradiction['severity']
}

export function useContradictions() {
  const [contradictions, setContradictions] = useState<Contradiction[]>([])
  const queryClient = useQueryClient()

  // Fetch contradictions
  const { data: fetchedContradictions, isLoading } = useQuery({
    queryKey: ['contradictions'],
    queryFn: async (): Promise<Contradiction[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/contradictions`)
        if (!response.ok) throw new Error('Failed to fetch contradictions')
        return await response.json()
      } catch (error) {
        console.error('Error fetching contradictions:', error)
        // Return mock data for development
        return [
          {
            id: '1',
            source: 'KAIROS',
            content: 'Temporal loop detected in doctrine version 2.1 vs 2.3',
            type: 'temporal',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            severity: 'major',
            resolved: false
          },
          {
            id: '2',
            source: 'MIRRA',
            content: 'Reflection reveals paradox in growth vs preservation principles',
            type: 'doctrinal',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            severity: 'moderate',
            resolved: false
          },
          {
            id: '3',
            source: 'JUNO',
            content: 'System coordination conflict between agent hierarchies',
            type: 'system-conflict',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            severity: 'critical',
            resolved: true,
            resolution: 'Established dynamic coordination protocol'
          }
        ]
      }
    },
    refetchInterval: 60000, // Check every minute
  })

  // Log contradiction mutation
  const logContradictionMutation = useMutation({
    mutationFn: async (params: LogContradictionParams): Promise<Contradiction> => {
      const contradiction: Contradiction = {
        id: Date.now().toString(),
        source: params.source,
        content: params.content,
        type: params.type,
        timestamp: params.timestamp,
        severity: params.severity || 'moderate',
        resolved: false
      }

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/contradictions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contradiction),
        })
        
        if (!response.ok) throw new Error('Failed to log contradiction')
        return await response.json()
      } catch (error) {
        console.error('Error logging contradiction:', error)
        // For development, just return the contradiction
        return contradiction
      }
    },
    onSuccess: (newContradiction) => {
      setContradictions(prev => [newContradiction, ...prev])
      queryClient.invalidateQueries({ queryKey: ['contradictions'] })
      console.log(`⚡ Contradiction logged by ${newContradiction.source}: ${newContradiction.content}`)
      
      // If critical, trigger system-wide alert
      if (newContradiction.severity === 'critical') {
        console.warn('🚨 CRITICAL CONTRADICTION DETECTED:', newContradiction.content)
      }
    },
    onError: (error) => {
      console.error('Failed to log contradiction:', error)
    }
  })

  // Resolve contradiction mutation
  const resolveContradictionMutation = useMutation({
    mutationFn: async ({ id, resolution }: { id: string, resolution: string }): Promise<Contradiction> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/contradictions/${id}/resolve`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resolution }),
        })
        
        if (!response.ok) throw new Error('Failed to resolve contradiction')
        return await response.json()
      } catch (error) {
        console.error('Error resolving contradiction:', error)
        throw error
      }
    },
    onSuccess: (resolvedContradiction) => {
      setContradictions(prev => 
        prev.map(c => c.id === resolvedContradiction.id ? resolvedContradiction : c)
      )
      queryClient.invalidateQueries({ queryKey: ['contradictions'] })
      console.log(`✅ Contradiction resolved: ${resolvedContradiction.content}`)
    }
  })

  const logContradiction = useCallback((params: LogContradictionParams) => {
    logContradictionMutation.mutate(params)
  }, [logContradictionMutation])

  const resolveContradiction = useCallback((id: string, resolution: string) => {
    resolveContradictionMutation.mutate({ id, resolution })
  }, [resolveContradictionMutation])

  // Update local contradictions when fetched contradictions change
  useEffect(() => {
    if (fetchedContradictions) {
      setContradictions(fetchedContradictions)
    }
  }, [fetchedContradictions])

  // Computed values
  const unresolvedContradictions = contradictions.filter(c => !c.resolved)
  const criticalContradictions = contradictions.filter(c => c.severity === 'critical' && !c.resolved)

  return {
    contradictions,
    unresolvedContradictions,
    criticalContradictions,
    logContradiction,
    resolveContradiction,
    isLoading,
    isLogging: logContradictionMutation.isPending,
    isResolving: resolveContradictionMutation.isPending,
    error: logContradictionMutation.error || resolveContradictionMutation.error
  }
}
