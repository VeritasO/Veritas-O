import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DoctrineLoop, DoctrineCycleEvent, DoctrineNode, DoctrineCycle } from '@/lib/doctrineCycle';

const doctrineCycle = DoctrineCycle.getInstance();

export function useDoctrineLoop() {
  const queryClient = useQueryClient();

  const {
    data: doctrineLoops = [],
    isLoading: loopsLoading,
    error: loopsError,
    refetch: refetchLoops
  } = useQuery({
    queryKey: ['doctrineLoop', 'loops'],
    queryFn: () => doctrineCycle.getDoctrineLoops(),
    refetchInterval: 15000 // Update every 15 seconds for doctrine analysis
  });

  const {
    data: activeLoops = [],
    isLoading: activeLoopsLoading
  } = useQuery({
    queryKey: ['doctrineLoop', 'activeLoops'],
    queryFn: () => doctrineCycle.getActiveLoops(),
    refetchInterval: 10000
  });

  const {
    data: criticalLoops = [],
    isLoading: criticalLoopsLoading
  } = useQuery({
    queryKey: ['doctrineLoop', 'criticalLoops'],
    queryFn: () => doctrineCycle.getCriticalLoops(),
    refetchInterval: 5000 // More frequent for critical loops
  });

  const {
    data: cycleEvents = [],
    isLoading: eventsLoading
  } = useQuery({
    queryKey: ['doctrineLoop', 'events'],
    queryFn: () => doctrineCycle.getCycleEvents(100),
    refetchInterval: 8000
  });

  const {
    data: allNodes = [],
    isLoading: nodesLoading
  } = useQuery({
    queryKey: ['doctrineLoop', 'nodes'],
    queryFn: () => doctrineCycle.getAllNodes(),
    refetchInterval: 20000
  });

  const addDoctrineNodeMutation = useMutation({
    mutationFn: ({ 
      content, 
      sourceType, 
      contradictions = [] 
    }: {
      content: string;
      sourceType: DoctrineNode['sourceType'];
      contradictions?: string[];
    }) => {
      const nodeId = doctrineCycle.addDoctrineNode(content, sourceType, contradictions);
      return Promise.resolve(nodeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctrineLoop'] });
    }
  });

  const updateNodeStrengthMutation = useMutation({
    mutationFn: ({ nodeId, strength }: { nodeId: string; strength: number }) => {
      const success = doctrineCycle.updateNodeStrength(nodeId, strength);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctrineLoop'] });
    }
  });

  const addNodeConnectionMutation = useMutation({
    mutationFn: ({ parentId, childId }: { parentId: string; childId: string }) => {
      const success = doctrineCycle.addNodeConnection(parentId, childId);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctrineLoop'] });
    }
  });

  const attemptLoopResolutionMutation = useMutation({
    mutationFn: ({ 
      loopId, 
      method 
    }: {
      loopId: string;
      method: 'ritual_intervention' | 'tribunal_processing' | 'agent_mediation' | 'symbolic_integration';
    }) => {
      const success = doctrineCycle.attemptLoopResolution(loopId, method);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctrineLoop'] });
    }
  });

  // Helper functions
  const getLoop = (loopId: string): DoctrineLoop | undefined => {
    return doctrineCycle.getLoop(loopId);
  };

  const getNode = (nodeId: string): DoctrineNode | undefined => {
    return doctrineCycle.getNodeById(nodeId);
  };

  const getLoopsByStatus = (status: DoctrineLoop['status']): DoctrineLoop[] => {
    return doctrineLoops.filter(loop => loop.status === status);
  };

  const getEventsByType = (eventType: DoctrineCycleEvent['eventType']): DoctrineCycleEvent[] => {
    return cycleEvents.filter(event => event.eventType === eventType);
  };

  const getNodesBySourceType = (sourceType: DoctrineNode['sourceType']): DoctrineNode[] => {
    return allNodes.filter(node => node.sourceType === sourceType);
  };

  const getHighTensionLoops = (threshold: number = 0.7): DoctrineLoop[] => {
    return doctrineLoops.filter(loop => loop.contradictionTension > threshold);
  };

  const getStrongLoops = (threshold: number = 0.7): DoctrineLoop[] => {
    return doctrineLoops.filter(loop => loop.cycleStrength > threshold);
  };

  const getLoopsContainingNode = (nodeId: string): DoctrineLoop[] => {
    return doctrineLoops.filter(loop => loop.nodes.includes(nodeId));
  };

  const getRecentResolutionAttempts = (limit: number = 20) => {
    return doctrineLoops
      .flatMap(loop => loop.resolutionAttempts.map(attempt => ({
        ...attempt,
        loopId: loop.id,
        loopStatus: loop.status
      })))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  };

  // Quick actions
  const addReflectionNode = (content: string, contradictions: string[] = []) => {
    return addDoctrineNodeMutation.mutate({
      content,
      sourceType: 'reflection',
      contradictions
    });
  };

  const addRitualResultNode = (content: string, supportingReflection?: string) => {
    const contradictions = supportingReflection ? [supportingReflection] : [];
    return addDoctrineNodeMutation.mutate({
      content,
      sourceType: 'ritual_result',
      contradictions
    });
  };

  const addTribunalVerdictNode = (content: string, relatedNodes: string[] = []) => {
    return addDoctrineNodeMutation.mutate({
      content,
      sourceType: 'tribunal_verdict',
      contradictions: relatedNodes
    });
  };

  const strengthenBelief = (nodeId: string, increment: number = 0.1) => {
    const node = getNode(nodeId);
    if (!node) return false;
    
    const newStrength = Math.min(1, node.beliefStrength + increment);
    return updateNodeStrengthMutation.mutate({ nodeId, strength: newStrength });
  };

  const weakenBelief = (nodeId: string, decrement: number = 0.1) => {
    const node = getNode(nodeId);
    if (!node) return false;
    
    const newStrength = Math.max(0, node.beliefStrength - decrement);
    return updateNodeStrengthMutation.mutate({ nodeId, strength: newStrength });
  };

  const attemptRitualResolution = (loopId: string) => {
    return attemptLoopResolutionMutation.mutate({
      loopId,
      method: 'ritual_intervention'
    });
  };

  const attemptTribunalResolution = (loopId: string) => {
    return attemptLoopResolutionMutation.mutate({
      loopId,
      method: 'tribunal_processing'
    });
  };

  const attemptSymbolicResolution = (loopId: string) => {
    return attemptLoopResolutionMutation.mutate({
      loopId,
      method: 'symbolic_integration'
    });
  };

  const attemptAgentMediation = (loopId: string) => {
    return attemptLoopResolutionMutation.mutate({
      loopId,
      method: 'agent_mediation'
    });
  };

  // Analysis and metrics
  const getDoctrineMetrics = () => {
    const totalLoops = doctrineLoops.length;
    const totalNodes = allNodes.length;
    
    const loopsByStatus = {
      stable: getLoopsByStatus('stable').length,
      growing: getLoopsByStatus('growing').length,
      weakening: getLoopsByStatus('weakening').length,
      critical: getLoopsByStatus('critical').length,
      dissolved: getLoopsByStatus('dissolved').length
    };

    const nodesBySource = {
      reflections: getNodesBySourceType('reflection').length,
      ritualResults: getNodesBySourceType('ritual_result').length,
      tribunalVerdicts: getNodesBySourceType('tribunal_verdict').length,
      agentInputs: getNodesBySourceType('agent_input').length
    };

    const avgLoopStrength = doctrineLoops.length > 0
      ? doctrineLoops.reduce((sum, loop) => sum + loop.cycleStrength, 0) / doctrineLoops.length
      : 0;

    const avgContradictionTension = doctrineLoops.length > 0
      ? doctrineLoops.reduce((sum, loop) => sum + loop.contradictionTension, 0) / doctrineLoops.length
      : 0;

    const avgBeliefStrength = allNodes.length > 0
      ? allNodes.reduce((sum, node) => sum + node.beliefStrength, 0) / allNodes.length
      : 0;

    const resolutionAttempts = doctrineLoops.reduce((sum, loop) => sum + loop.resolutionAttempts.length, 0);
    const successfulResolutions = doctrineLoops.reduce((sum, loop) => 
      sum + loop.resolutionAttempts.filter(attempt => attempt.success).length, 0);
    
    const resolutionSuccessRate = resolutionAttempts > 0 ? successfulResolutions / resolutionAttempts : 0;

    return {
      totalLoops,
      totalNodes,
      loopsByStatus,
      nodesBySource,
      avgLoopStrength,
      avgContradictionTension,
      avgBeliefStrength,
      resolutionAttempts,
      resolutionSuccessRate,
      criticalLoopCount: criticalLoops.length,
      highTensionLoopCount: getHighTensionLoops().length
    };
  };

  const getLoopAnalysis = (loopId: string) => {
    const loop = getLoop(loopId);
    if (!loop) return null;

    const nodes = loop.nodes.map(id => getNode(id)).filter(Boolean) as DoctrineNode[];
    const avgNodeStrength = nodes.reduce((sum, node) => sum + node.beliefStrength, 0) / nodes.length;
    
    const resolutionHistory = loop.resolutionAttempts;
    const mostEffectiveMethod = resolutionHistory.length > 0
      ? resolutionHistory.reduce((best, current) => 
          current.impactLevel > best.impactLevel ? current : best
        ).method
      : null;

    const recommendedResolution = loop.contradictionTension > 0.7 
      ? 'ritual_intervention'
      : loop.cycleStrength > 0.8
      ? 'symbolic_integration'
      : 'agent_mediation';

    return {
      loop,
      nodes,
      avgNodeStrength,
      resolutionHistory,
      mostEffectiveMethod,
      recommendedResolution,
      riskLevel: loop.status === 'critical' ? 'high' : 
                 loop.contradictionTension > 0.6 ? 'medium' : 'low',
      urgency: loop.status === 'critical' && loop.cycleStrength > 0.8 ? 'immediate' :
               loop.status === 'growing' ? 'moderate' : 'low'
    };
  };

  return {
    // Data
    doctrineLoops,
    activeLoops,
    criticalLoops,
    cycleEvents,
    allNodes,
    doctrineMetrics: getDoctrineMetrics(),
    
    // Loading states
    loopsLoading,
    activeLoopsLoading,
    criticalLoopsLoading,
    eventsLoading,
    nodesLoading,
    
    // Errors
    loopsError,
    
    // Core actions
    addDoctrineNode: addDoctrineNodeMutation.mutate,
    updateNodeStrength: updateNodeStrengthMutation.mutate,
    addNodeConnection: addNodeConnectionMutation.mutate,
    attemptLoopResolution: attemptLoopResolutionMutation.mutate,
    
    // Mutation states
    addingNode: addDoctrineNodeMutation.isPending,
    updatingStrength: updateNodeStrengthMutation.isPending,
    addingConnection: addNodeConnectionMutation.isPending,
    attemptingResolution: attemptLoopResolutionMutation.isPending,
    
    // Quick actions
    addReflectionNode,
    addRitualResultNode,
    addTribunalVerdictNode,
    strengthenBelief,
    weakenBelief,
    attemptRitualResolution,
    attemptTribunalResolution,
    attemptSymbolicResolution,
    attemptAgentMediation,
    
    // Helpers and filters
    getLoop,
    getNode,
    getLoopsByStatus,
    getEventsByType,
    getNodesBySourceType,
    getHighTensionLoops,
    getStrongLoops,
    getLoopsContainingNode,
    getRecentResolutionAttempts,
    getLoopAnalysis,
    
    // Refresh
    refetchLoops
  };
}
