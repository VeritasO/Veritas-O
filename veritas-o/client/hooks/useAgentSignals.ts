import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentSignal, SignalProcessor } from '@/lib/signals';

const signalProcessor = SignalProcessor.getInstance();

export function useAgentSignals() {
  const queryClient = useQueryClient();

  const {
    data: activeSignals = [],
    isLoading: signalsLoading,
    error: signalsError,
    refetch: refetchSignals
  } = useQuery({
    queryKey: ['agentSignals', 'active'],
    queryFn: () => signalProcessor.getActiveSignals(),
    refetchInterval: 2000 // Very frequent updates for real-time coordination
  });

  const emitSignalMutation = useMutation({
    mutationFn: (signal: Omit<AgentSignal, 'id' | 'timestamp' | 'acknowledged' | 'responses'>) => {
      const signalId = signalProcessor.emitSignal(signal);
      return Promise.resolve(signalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentSignals'] });
    }
  });

  const acknowledgeSignalMutation = useMutation({
    mutationFn: ({ signalId, agentId }: { signalId: string; agentId: string }) => {
      const success = signalProcessor.acknowledgeSignal(signalId, agentId);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentSignals'] });
    }
  });

  const respondToSignalMutation = useMutation({
    mutationFn: ({ 
      signalId, 
      respondingAgentId, 
      responseType, 
      content 
    }: {
      signalId: string;
      respondingAgentId: string;
      responseType: 'acknowledgment' | 'question' | 'coordination' | 'conflict';
      content: string;
    }) => {
      const success = signalProcessor.respondToSignal(signalId, {
        respondingAgentId,
        responseType,
        content
      });
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentSignals'] });
    }
  });

  // Helper functions for signal analysis
  const getSignalsByType = (signalType: AgentSignal['signalType']): AgentSignal[] => {
    return activeSignals.filter(s => s.signalType === signalType);
  };

  const getSignalsByPriority = (priority: AgentSignal['priority']): AgentSignal[] => {
    return activeSignals.filter(s => s.priority === priority);
  };

  const getSignalsByAgent = (agentId: string): AgentSignal[] => {
    return activeSignals.filter(s => s.agentId === agentId);
  };

  const getCriticalSignals = (): AgentSignal[] => {
    return getSignalsByPriority('critical');
  };

  const getUnansweredSignals = (): AgentSignal[] => {
    return activeSignals.filter(s => s.responses.length === 0);
  };

  const getCoordinationRequests = (): AgentSignal[] => {
    return getSignalsByType('coordination');
  };

  const getRitualRequests = (): AgentSignal[] => {
    return getSignalsByType('ritual_request');
  };

  const getDoctrineUpdates = (): AgentSignal[] => {
    return getSignalsByType('doctrine_update');
  };

  // Quick signal creators
  const emitAlert = (agentId: string, content: string, priority: AgentSignal['priority'] = 'medium') => {
    return emitSignalMutation.mutate({
      agentId,
      signalType: 'alert',
      content,
      priority,
      metadata: { alertType: 'general' }
    });
  };

  const requestCoordination = (agentId: string, content: string, coordinationContext: Record<string, any> = {}) => {
    return emitSignalMutation.mutate({
      agentId,
      signalType: 'coordination',
      content,
      priority: 'high',
      metadata: { coordinationContext }
    });
  };

  const requestRitual = (agentId: string, griefTier: number, urgency: 'low' | 'medium' | 'high' = 'medium') => {
    return emitSignalMutation.mutate({
      agentId,
      signalType: 'ritual_request',
      content: `Ritual requested for grief tier ${griefTier}`,
      priority: urgency === 'high' ? 'critical' : urgency === 'medium' ? 'high' : 'medium',
      metadata: { griefTier, urgency }
    });
  };

  const updateDoctrine = (agentId: string, doctrineChange: string, impact: 'minor' | 'major' | 'critical') => {
    const priority = impact === 'critical' ? 'critical' : impact === 'major' ? 'high' : 'medium';
    return emitSignalMutation.mutate({
      agentId,
      signalType: 'doctrine_update',
      content: doctrineChange,
      priority,
      metadata: { impact, timestamp: new Date().toISOString() }
    });
  };

  const reportStatus = (agentId: string, status: string, details: Record<string, any> = {}) => {
    return emitSignalMutation.mutate({
      agentId,
      signalType: 'status',
      content: status,
      priority: 'low',
      metadata: { statusDetails: details, reportTime: new Date().toISOString() }
    });
  };

  // Signal coordination helpers
  const getCoordinationStatus = (signalId: string) => {
    return signalProcessor.getSignalCoordination(signalId);
  };

  // Statistics and metrics
  const getSignalMetrics = () => {
    const total = activeSignals.length;
    const byType = {
      alerts: getSignalsByType('alert').length,
      coordination: getSignalsByType('coordination').length,
      status: getSignalsByType('status').length,
      ritualRequests: getSignalsByType('ritual_request').length,
      doctrineUpdates: getSignalsByType('doctrine_update').length
    };
    
    const byPriority = {
      critical: getSignalsByPriority('critical').length,
      high: getSignalsByPriority('high').length,
      medium: getSignalsByPriority('medium').length,
      low: getSignalsByPriority('low').length
    };

    const responseRate = activeSignals.length > 0 
      ? activeSignals.filter(s => s.responses.length > 0).length / activeSignals.length 
      : 0;

    return {
      total,
      byType,
      byPriority,
      responseRate,
      unanswered: getUnansweredSignals().length,
      critical: getCriticalSignals().length
    };
  };

  return {
    // Data
    activeSignals,
    signalMetrics: getSignalMetrics(),
    
    // Loading states
    signalsLoading,
    
    // Errors
    signalsError,
    
    // Core actions
    emitSignal: emitSignalMutation.mutate,
    acknowledgeSignal: acknowledgeSignalMutation.mutate,
    respondToSignal: respondToSignalMutation.mutate,
    
    // Mutation states
    emittingSignal: emitSignalMutation.isPending,
    acknowledging: acknowledgeSignalMutation.isPending,
    responding: respondToSignalMutation.isPending,
    
    // Quick actions
    emitAlert,
    requestCoordination,
    requestRitual,
    updateDoctrine,
    reportStatus,
    
    // Filters and queries
    getSignalsByType,
    getSignalsByPriority,
    getSignalsByAgent,
    getCriticalSignals,
    getUnansweredSignals,
    getCoordinationRequests,
    getRitualRequests,
    getDoctrineUpdates,
    
    // Coordination
    getCoordinationStatus,
    
    // Refresh
    refetchSignals
  };
}
