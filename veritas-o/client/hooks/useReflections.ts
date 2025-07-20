import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentName } from '@/lib/validators'
import { API_CONFIG } from '@/lib/constants'
import { GriefTier } from '@/lib/grief'

export interface Reflection {
  id?: string
  title?: string
  description?: string
  author: AgentName | string
  content: string
  timestamp: string
  category?: 'philosophical' | 'technical' | 'judicial' | 'doctrinal' | 'personal'
  tags?: string[]
  relatedContradiction?: string
  relatedTask?: string
  griefTier?: GriefTier
  contradictionId?: string
}

export interface AddReflectionParams {
  author: AgentName | string
  content: string
  timestamp: string
  category?: Reflection['category']
  tags?: string[]
  relatedContradiction?: string
  relatedTask?: string
}

export function useReflections() {
  const [reflections, setReflections] = useState<Reflection[]>([])
  const queryClient = useQueryClient()

  // Fetch reflections
  const { data: fetchedReflections, isLoading } = useQuery({
    queryKey: ['reflections'],
    queryFn: async (): Promise<Reflection[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/reflections`)
        if (!response.ok) throw new Error('Failed to fetch reflections')
        return await response.json()
      } catch (error) {
        console.error('Error fetching reflections:', error)
        // Return mock data for development
        return [
          {
            id: '1',
            title: 'Judicial Balance Protocol',
            description: 'Analysis of coordination requirements in multi-perspective judicial processes',
            author: 'JUNO',
            content: 'The coordination of multiple perspectives requires both patience and decisive action. In judicial matters, balance is the key to truth.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            category: 'philosophical',
            tags: ['coordination', 'balance', 'justice'],
            griefTier: 3,
          },
          {
            id: '2',
            title: 'System Harmony Patterns',
            description: 'Reflection on tribunal patterns revealing deeper system understanding',
            author: 'MIRRA',
            content: 'Reflection on the tribunal case reveals deeper patterns of system harmony. When contradictions emerge, they point us toward greater understanding.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            category: 'judicial',
            tags: ['patterns', 'harmony', 'understanding'],
            griefTier: 4,
            contradictionId: 'contradiction-456'
          },
          {
            id: '3',
            title: 'Security-Transparency Balance',
            description: 'Protocol analysis for balancing judicial transparency with protection',
            author: 'AEGIS',
            content: 'Security protocols in judicial processes must balance transparency with protection. Justice requires both openness and safety.',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            category: 'technical',
            tags: ['security', 'transparency', 'justice'],
            griefTier: 2,
          },
          {
            id: '4',
            title: 'Sacred Judgment Preservation',
            description: 'Doctrinal examination of sacred aspects in judicial decision-making',
            author: 'VESTA',
            content: 'The sacred nature of judgment requires preservation of both process and outcome. Each tribunal decision becomes part of our collective wisdom.',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            category: 'doctrinal',
            tags: ['sacred', 'preservation', 'wisdom', 'collective'],
            griefTier: 5,
          },
          {
            id: '5',
            title: 'Contradictory Evidence Analysis',
            description: 'Complex grief processing in the face of conflicting testimonies',
            author: 'KAIROS',
            content: 'When evidence contradicts itself, we must find the temporal threads that weave truth through apparent paradox.',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
            category: 'judicial',
            tags: ['paradox', 'evidence', 'time'],
            griefTier: 2,
            contradictionId: 'contradiction-789'
          }
        ]
      }
    },
    refetchInterval: 45000,
  })

  // Add reflection mutation
  const addReflectionMutation = useMutation({
    mutationFn: async (params: AddReflectionParams): Promise<Reflection> => {
      const reflection: Reflection = {
        id: Date.now().toString(),
        author: params.author,
        content: params.content,
        timestamp: params.timestamp,
        category: params.category || 'philosophical',
        tags: params.tags || [],
        relatedContradiction: params.relatedContradiction,
        relatedTask: params.relatedTask
      }

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/reflections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reflection),
        })
        
        if (!response.ok) throw new Error('Failed to add reflection')
        return await response.json()
      } catch (error) {
        console.error('Error adding reflection:', error)
        // For development, just return the reflection
        return reflection
      }
    },
    onSuccess: (newReflection) => {
      setReflections(prev => [newReflection, ...prev])
      queryClient.invalidateQueries({ queryKey: ['reflections'] })
      console.log(`🔮 Reflection added by ${newReflection.author}: ${newReflection.content.substring(0, 50)}...`)
    },
    onError: (error) => {
      console.error('Failed to add reflection:', error)
    }
  })

  // Update reflection mutation (for editing existing reflections)
  const updateReflectionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Reflection> }): Promise<Reflection> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/reflections/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })
        
        if (!response.ok) throw new Error('Failed to update reflection')
        return await response.json()
      } catch (error) {
        console.error('Error updating reflection:', error)
        throw error
      }
    },
    onSuccess: (updatedReflection) => {
      setReflections(prev => 
        prev.map(r => r.id === updatedReflection.id ? updatedReflection : r)
      )
      queryClient.invalidateQueries({ queryKey: ['reflections'] })
    }
  })

  const addReflection = useCallback((params: AddReflectionParams) => {
    addReflectionMutation.mutate(params)
  }, [addReflectionMutation])

  const updateReflection = useCallback((id: string, updates: Partial<Reflection>) => {
    updateReflectionMutation.mutate({ id, updates })
  }, [updateReflectionMutation])

  // Update local reflections when fetched reflections change
  useEffect(() => {
    if (fetchedReflections) {
      setReflections(fetchedReflections)
    }
  }, [fetchedReflections])

  // Computed values
  const reflectionsByCategory = reflections.reduce((acc, reflection) => {
    const category = reflection.category || 'philosophical'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const reflectionsByAgent = reflections.reduce((acc, reflection) => {
    acc[reflection.author] = (acc[reflection.author] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const judicialReflections = reflections.filter(r => r.category === 'judicial')

  return {
    reflections,
    judicialReflections,
    reflectionsByCategory,
    reflectionsByAgent,
    addReflection,
    updateReflection,
    isLoading,
    isAdding: addReflectionMutation.isPending,
    isUpdating: updateReflectionMutation.isPending,
    error: addReflectionMutation.error || updateReflectionMutation.error
  }
}
