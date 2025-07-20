import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentGriefTier, type GriefTier } from '@/lib/grief'
import { API_CONFIG } from '@/lib/constants'

export interface Ritual {
  id: string
  title: string
  description: string
  griefTier: GriefTier
  symbols: string[]
  duration?: string
  instructions?: string[]
  category: 'cleansing' | 'integration' | 'transformation' | 'release' | 'grounding'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const getMockRituals = (griefTier: GriefTier): Ritual[] => {
  const baseRituals: Record<GriefTier, Ritual[]> = {
    1: [
      {
        id: '1-destabilization-1',
        title: 'Wave Acknowledgment Ritual',
        description: 'Recognize and honor the initial wave of grief as it arrives',
        griefTier: 1,
        symbols: ['🌊', '👁️', '💎'],
        duration: '60 seconds',
        instructions: [
          'Place hand on heart',
          'Breathe deeply three times', 
          'Say: "I see you, grief. I acknowledge your presence."',
          'Feel the wave without resistance'
        ],
        category: 'grounding',
        difficulty: 'beginner'
      },
      {
        id: '1-destabilization-2', 
        title: 'Sensing Circle',
        description: 'Create sacred space for initial grief awareness',
        griefTier: 1,
        symbols: ['⭕', '🕯️', '🌊'],
        duration: '90 seconds',
        instructions: [
          'Draw imaginary circle around yourself',
          'Light candle or visualize flame',
          'Notice what you sense in your body',
          'Welcome all sensations with curiosity'
        ],
        category: 'grounding',
        difficulty: 'beginner'
      }
    ],
    2: [
      {
        id: '2-mourning-1',
        title: 'Echo Chamber Meditation',
        description: 'Dive safely into the depth of mourning memories',
        griefTier: 2,
        symbols: ['🕳️', '🌀', '💜'],
        duration: '60 seconds',
        instructions: [
          'Close eyes and breathe slowly',
          'Allow memories to surface naturally',
          'Hold each memory like a precious stone',
          'Let tears flow if they come'
        ],
        category: 'integration',
        difficulty: 'intermediate'
      },
      {
        id: '2-mourning-2',
        title: 'Depth Diving Breath',
        description: 'Controlled descent into mourning with breath as anchor',
        griefTier: 2,
        symbols: ['🌊', '🫁', '🕳️'],
        duration: '90 seconds',
        instructions: [
          'Inhale for 4 counts',
          'Hold for 4 counts',
          'Exhale for 8 counts',
          'With each exhale, allow yourself to go deeper'
        ],
        category: 'transformation',
        difficulty: 'beginner'
      }
    ],
    3: [
      {
        id: '3-insight-1',
        title: 'Witnessing Light Ritual',
        description: 'Illuminate insights emerging from grief work',
        griefTier: 3,
        symbols: ['💡', '✨', '👁️'],
        duration: '60 seconds',
        instructions: [
          'Visualize golden light in your chest',
          'Ask: "What is this grief teaching me?"',
          'Listen for the first insight that comes',
          'Name it aloud or write it down'
        ],
        category: 'integration',
        difficulty: 'intermediate'
      },
      {
        id: '3-insight-2',
        title: 'Truth Speaking Circle',
        description: 'Voice the truths that grief has revealed',
        griefTier: 3,
        symbols: ['🗣️', '💎', '🌟'],
        duration: '75 seconds',
        instructions: [
          'Stand in your power pose',
          'Speak one truth grief has shown you',
          'Say: "I witness this truth"',
          'Feel the clarity in your body'
        ],
        category: 'transformation',
        difficulty: 'intermediate'
      }
    ],
    4: [
      {
        id: '4-transmutation-1',
        title: 'Phoenix Voice Activation',
        description: 'Channel transformative energy into reconstruction',
        griefTier: 4,
        symbols: ['⚡', '🔥', '🦅'],
        duration: '60 seconds',
        instructions: [
          'Stand with arms raised',
          'Speak your intentions for rebuilding',
          'Feel energy moving through your body',
          'End with: "I am transforming"'
        ],
        category: 'transformation',
        difficulty: 'advanced'
      },
      {
        id: '4-transmutation-2',
        title: 'Reconstruction Mandala',
        description: 'Visualize and energize your path forward',
        griefTier: 4,
        symbols: ['🔨', '🌟', '⚡'],
        duration: '90 seconds',
        instructions: [
          'Draw or visualize a mandala',
          'Place your new intentions in the center',
          'Add symbols of strength around the edges',
          'See it glowing with transformative power'
        ],
        category: 'transformation',
        difficulty: 'intermediate'
      }
    ],
    5: [
      {
        id: '5-liberation-1',
        title: 'Freedom Flight Visualization',
        description: 'Release grief and claim wisdom-based liberation',
        griefTier: 5,
        symbols: ['🕊️', '🌈', '✨'],
        duration: '60 seconds',
        instructions: [
          'Imagine yourself as a bird taking flight',
          'Feel grief transforming into wisdom beneath you',
          'Spread your arms and feel your freedom',
          'Say: "I am free and wise"'
        ],
        category: 'release',
        difficulty: 'beginner'
      },
      {
        id: '5-liberation-2',
        title: 'Mythic Integration Ceremony',
        description: 'Integrate grief as part of your heroic journey',
        griefTier: 5,
        symbols: ['📖', '👑', '🕊️'],
        duration: '120 seconds',
        instructions: [
          'Tell the story of your grief journey',
          'Identify yourself as the hero of this story',
          'Name the gifts grief has given you',
          'Crown yourself with this new wisdom'
        ],
        category: 'integration',
        difficulty: 'advanced'
      }
    ]
  }

  return baseRituals[griefTier] || []
}

export function useGriefRituals(griefTier?: GriefTier) {
  const [rituals, setRituals] = useState<Ritual[]>([])
  const queryClient = useQueryClient()
  const currentTier = griefTier || getCurrentGriefTier()

  // Fetch rituals for current grief tier
  const { data: fetchedRituals, isLoading, refetch } = useQuery({
    queryKey: ['grief-rituals', currentTier],
    queryFn: async (): Promise<Ritual[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/rituals/grief-tier/${currentTier}`)
        if (!response.ok) throw new Error('Failed to fetch rituals')
        return await response.json()
      } catch (error) {
        console.error('Error fetching grief rituals:', error)
        // Return mock data for development
        return getMockRituals(currentTier)
      }
    },
    refetchInterval: 60000, // Refetch every minute as tiers change
  })

  // Enact ritual mutation
  const enactRitualMutation = useMutation({
    mutationFn: async (ritualId: string): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/rituals/${ritualId}/enact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            griefTier: currentTier,
            timestamp: new Date().toISOString()
          }),
        })
        
        if (!response.ok) throw new Error('Failed to enact ritual')
        return await response.json()
      } catch (error) {
        console.error('Error enacting ritual:', error)
        return { success: true, message: `Ritual ${ritualId} enacted for Grief Tier ${currentTier}` }
      }
    },
    onSuccess: (result, ritualId) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['grief-rituals'] })
        console.log(`✨ Ritual enacted: ${ritualId}`)
      }
    }
  })

  const enactRitual = useCallback((ritualId: string) => {
    enactRitualMutation.mutate(ritualId)
  }, [enactRitualMutation])

  // Update local rituals when fetched rituals change
  useEffect(() => {
    if (fetchedRituals) {
      setRituals(fetchedRituals)
    }
  }, [fetchedRituals])

  // Filter rituals by category
  const ritualsByCategory = rituals.reduce((acc, ritual) => {
    acc[ritual.category] = (acc[ritual.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    rituals,
    griefTier: currentTier,
    ritualsByCategory,
    enactRitual,
    isLoading,
    isEnacting: enactRitualMutation.isPending,
    refetch,
    error: enactRitualMutation.error
  }
}
