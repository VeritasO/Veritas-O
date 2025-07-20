import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentMessage, Contradiction } from '@/lib/types'
import { AgentName } from '@/lib/validators'
import { API_CONFIG, REFRESH_INTERVALS } from '@/lib/constants'

interface SendMessageParams {
  agent: AgentName | string
  content: string
  type?: 'proposal' | 'comment' | 'contradiction' | 'ritual' | 'reflection'
}

export function useCollaboration() {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const queryClient = useQueryClient()

  // Fetch recent collaboration messages
  const { data: fetchedMessages } = useQuery({
    queryKey: ['collaboration', 'messages'],
    queryFn: async (): Promise<AgentMessage[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/collaboration/messages`)
        if (!response.ok) throw new Error('Failed to fetch messages')
        return await response.json()
      } catch (error) {
        console.error('Error fetching collaboration messages:', error)
        // Return mock data for development
        return [
          {
            id: '1',
            agent: 'JUNO',
            content: 'Initiating collective analysis of new doctrinal passages.',
            timestamp: Date.now() - 60000,
            type: 'proposal'
          },
          {
            id: '2',
            agent: 'AEGIS',
            content: 'Security protocols verified. Proceeding with analysis.',
            timestamp: Date.now() - 45000,
            type: 'comment'
          },
          {
            id: '3',
            agent: 'LYRA',
            content: 'Harmonic resonance detected in passages 7-12. Suggest deeper examination.',
            timestamp: Date.now() - 30000,
            type: 'proposal'
          },
          {
            id: '4',
            agent: 'MIRRA',
            content: 'Reflection reveals potential contradiction with previous doctrine v2.1.',
            timestamp: Date.now() - 15000,
            type: 'contradiction'
          }
        ]
      }
    },
    refetchInterval: REFRESH_INTERVALS.DASHBOARD,
  })

  // Fetch unresolved contradictions
  const { data: unresolvedContradictions = [] } = useQuery({
    queryKey: ['collaboration', 'contradictions'],
    queryFn: async (): Promise<Contradiction[]> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/contradictions?resolved=false`)
        if (!response.ok) throw new Error('Failed to fetch contradictions')
        return await response.json()
      } catch (error) {
        console.error('Error fetching contradictions:', error)
        // Return mock data
        return [
          {
            id: '1',
            summary: 'Conflicting temporal coordination principles',
            statement1: 'Time flows linearly in collective consciousness',
            statement2: 'Cyclical patterns emerge in agent synchronization',
            severity: 'moderate' as const,
            detectedBy: 'KAIROS' as AgentName,
            resolved: false,
            createdAt: new Date()
          },
          {
            id: '2',
            summary: 'Growth vs. preservation paradox',
            statement1: 'Knowledge must be preserved in original form',
            statement2: 'Truth evolves through collective understanding',
            severity: 'major' as const,
            detectedBy: 'THALEA' as AgentName,
            resolved: false,
            createdAt: new Date()
          }
        ]
      }
    },
    refetchInterval: REFRESH_INTERVALS.DOCTRINE_CHANGES,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const message: AgentMessage = {
        id: Date.now().toString(),
        agent: params.agent,
        content: params.content,
        timestamp: Date.now(),
        type: params.type || 'comment'
      }

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/collaboration/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        })
        
        if (!response.ok) throw new Error('Failed to send message')
        return message
      } catch (error) {
        console.error('Error sending message:', error)
        // For development, just return the message (it will be added optimistically)
        return message
      }
    },
    onSuccess: (newMessage) => {
      // Optimistically update the messages list
      setMessages(prev => [...prev, newMessage])
      
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['collaboration', 'messages'] })
    },
    onError: (error) => {
      console.error('Failed to send message:', error)
    }
  })

  // Send message function
  const sendMessage = useCallback((params: SendMessageParams) => {
    sendMessageMutation.mutate(params)
  }, [sendMessageMutation])

  // Update local messages when fetched messages change
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages)
    }
  }, [fetchedMessages])

  return {
    messages,
    unresolvedContradictions,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error
  }
}
