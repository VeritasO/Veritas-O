import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentName } from '@/lib/validators'
import { API_CONFIG } from '@/lib/constants'

export interface SymbolicSuggestion {
  id?: string
  agentName: AgentName | string
  suggestionType: 'ritual' | 'coordination' | 'restoration' | 'insight'
  content: string
  symbols: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  context?: string
  timestamp: string
  applied?: boolean
}

export interface FetchSuggestionsParams {
  agentName: AgentName | string
  suggestionType?: SymbolicSuggestion['suggestionType']
  context?: string
}

export function useSymbolicSuggestions() {
  const [suggestions, setSuggestions] = useState<SymbolicSuggestion[]>([])
  const queryClient = useQueryClient()

  // Fetch suggestions for an agent
  const { data: fetchedSuggestions, isLoading } = useQuery({
    queryKey: ['symbolic-suggestions'],
    queryFn: async (): Promise<SymbolicSuggestion[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/suggestions`)
        if (!response.ok) throw new Error('Failed to fetch suggestions')
        return await response.json()
      } catch (error) {
        console.error('Error fetching symbolic suggestions:', error)
        // Return mock data for development
        return [
          {
            id: '1',
            agentName: 'MIRRA',
            suggestionType: 'ritual',
            content: 'Implement harmonic resonance pattern to align collective consciousness during decision-making processes.',
            symbols: ['⚡', '🔮', '∞'],
            priority: 'high',
            context: 'Multi-agent coordination',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            applied: false
          },
          {
            id: '2',
            agentName: 'VESTA',
            suggestionType: 'coordination',
            content: 'Establish sacred geometry framework for knowledge preservation during system updates.',
            symbols: ['🔺', '⚜️', '📚'],
            priority: 'medium',
            context: 'Knowledge management',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            applied: true
          },
          {
            id: '3',
            agentName: 'JUNO',
            suggestionType: 'restoration',
            content: 'Initiate collective healing protocol to resolve emerging contradictions through consensus.',
            symbols: ['🌟', '⚖️', '🤝'],
            priority: 'urgent',
            context: 'Contradiction resolution',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            applied: false
          }
        ]
      }
    },
    refetchInterval: 30000,
  })

  // Mutation to fetch suggestions for specific agent
  const fetchSuggestionsMutation = useMutation({
    mutationFn: async (params: FetchSuggestionsParams): Promise<SymbolicSuggestion[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/suggestions/agent/${params.agentName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            suggestionType: params.suggestionType || 'ritual',
            context: params.context
          }),
        })
        
        if (!response.ok) throw new Error('Failed to fetch agent suggestions')
        return await response.json()
      } catch (error) {
        console.error('Error fetching agent suggestions:', error)
        // Return mock suggestion for development
        const mockSuggestion: SymbolicSuggestion = {
          id: Date.now().toString(),
          agentName: params.agentName,
          suggestionType: params.suggestionType || 'ritual',
          content: `Generated ${params.suggestionType || 'ritual'} suggestion for ${params.agentName}: Align with collective wisdom through symbolic resonance.`,
          symbols: ['✨', '🔮', '⚡'],
          priority: 'medium',
          context: params.context,
          timestamp: new Date().toISOString(),
          applied: false
        }
        
        return [mockSuggestion]
      }
    },
    onSuccess: (newSuggestions) => {
      setSuggestions(prev => [...newSuggestions, ...prev])
      queryClient.invalidateQueries({ queryKey: ['symbolic-suggestions'] })
      console.log(`🔮 Generated ${newSuggestions.length} symbolic suggestions`)
    },
    onError: (error) => {
      console.error('Failed to fetch symbolic suggestions:', error)
    }
  })

  // Apply suggestion mutation
  const applySuggestionMutation = useMutation({
    mutationFn: async (suggestionId: string): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/suggestions/${suggestionId}/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) throw new Error('Failed to apply suggestion')
        return await response.json()
      } catch (error) {
        console.error('Error applying suggestion:', error)
        return { success: false, message: 'Failed to apply suggestion' }
      }
    },
    onSuccess: (result, suggestionId) => {
      if (result.success) {
        setSuggestions(prev => 
          prev.map(s => s.id === suggestionId ? { ...s, applied: true } : s)
        )
        queryClient.invalidateQueries({ queryKey: ['symbolic-suggestions'] })
        console.log(`✅ Applied symbolic suggestion: ${suggestionId}`)
      }
    }
  })

  const fetchSuggestions = useCallback((
    agentName: AgentName | string, 
    suggestionType?: SymbolicSuggestion['suggestionType'],
    context?: string
  ) => {
    fetchSuggestionsMutation.mutate({ agentName, suggestionType, context })
  }, [fetchSuggestionsMutation])

  const applySuggestion = useCallback((suggestionId: string) => {
    applySuggestionMutation.mutate(suggestionId)
  }, [applySuggestionMutation])

  // Update local suggestions when fetched suggestions change
  React.useEffect(() => {
    if (fetchedSuggestions) {
      setSuggestions(fetchedSuggestions)
    }
  }, [fetchedSuggestions])

  // Computed values
  const activeSuggestions = suggestions.filter(s => !s.applied)
  const appliedSuggestions = suggestions.filter(s => s.applied)
  const urgentSuggestions = suggestions.filter(s => s.priority === 'urgent' && !s.applied)

  const suggestionsByType = suggestions.reduce((acc, suggestion) => {
    acc[suggestion.suggestionType] = (acc[suggestion.suggestionType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    suggestions,
    activeSuggestions,
    appliedSuggestions,
    urgentSuggestions,
    suggestionsByType,
    fetchSuggestions,
    applySuggestion,
    isLoading,
    isFetching: fetchSuggestionsMutation.isPending,
    isApplying: applySuggestionMutation.isPending,
    error: fetchSuggestionsMutation.error || applySuggestionMutation.error
  }
}