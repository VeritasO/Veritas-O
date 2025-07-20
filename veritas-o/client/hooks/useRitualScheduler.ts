import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScheduledRitual, RitualTemplate, RitualResults, RitualScheduler } from '@/lib/ritualScheduler';

const ritualScheduler = RitualScheduler.getInstance();

export function useRitualScheduler() {
  const queryClient = useQueryClient();

  const {
    data: activeSchedule = [],
    isLoading: scheduleLoading,
    error: scheduleError,
    refetch: refetchSchedule
  } = useQuery({
    queryKey: ['ritualScheduler', 'activeSchedule'],
    queryFn: () => ritualScheduler.getActiveSchedule(),
    refetchInterval: 10000 // Update every 10 seconds
  });

  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError
  } = useQuery({
    queryKey: ['ritualScheduler', 'templates'],
    queryFn: () => ritualScheduler.getTemplates()
  });

  const {
    data: ritualHistory = [],
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['ritualScheduler', 'history'],
    queryFn: () => ritualScheduler.getRitualHistory(),
    refetchInterval: 30000 // Less frequent for history
  });

  const scheduleRitualMutation = useMutation({
    mutationFn: ({ 
      templateId, 
      scheduledFor, 
      participants = ['self'] 
    }: {
      templateId: string;
      scheduledFor: Date;
      participants?: string[];
    }) => {
      const ritualId = ritualScheduler.scheduleRitual(templateId, scheduledFor, participants);
      return Promise.resolve(ritualId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ritualScheduler'] });
    }
  });

  const scheduleForGriefTierMutation = useMutation({
    mutationFn: ({ 
      griefTier, 
      urgency = 'medium' 
    }: {
      griefTier: number;
      urgency?: 'low' | 'medium' | 'high';
    }) => {
      const ritualIds = ritualScheduler.scheduleForGriefTier(griefTier, urgency);
      return Promise.resolve(ritualIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ritualScheduler'] });
    }
  });

  const startRitualMutation = useMutation({
    mutationFn: (ritualId: string) => {
      const success = ritualScheduler.startRitual(ritualId);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ritualScheduler'] });
    }
  });

  const completeRitualMutation = useMutation({
    mutationFn: ({ 
      ritualId, 
      results 
    }: {
      ritualId: string;
      results: Partial<RitualResults>;
    }) => {
      const success = ritualScheduler.completeRitual(ritualId, results);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ritualScheduler'] });
    }
  });

  const cancelRitualMutation = useMutation({
    mutationFn: (ritualId: string) => {
      const success = ritualScheduler.cancelRitual(ritualId);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ritualScheduler'] });
    }
  });

  // Helper functions
  const getRitual = (ritualId: string): ScheduledRitual | undefined => {
    return ritualScheduler.getRitual(ritualId);
  };

  const getTemplatesForGriefTier = (griefTier: number): RitualTemplate[] => {
    return ritualScheduler.getTemplatesForGriefTier(griefTier);
  };

  const getRitualsByStatus = (status: ScheduledRitual['status']): ScheduledRitual[] => {
    return activeSchedule.filter(r => r.status === status);
  };

  const getRitualsByCategory = (category: ScheduledRitual['category']): ScheduledRitual[] => {
    return activeSchedule.filter(r => r.category === category);
  };

  const getUpcomingRituals = (hoursAhead: number = 24): ScheduledRitual[] => {
    const cutoff = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
    return activeSchedule
      .filter(r => r.status === 'scheduled' && r.scheduledFor <= cutoff)
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  };

  const getActiveRituals = (): ScheduledRitual[] => {
    return getRitualsByStatus('active');
  };

  const getOverdueRituals = (): ScheduledRitual[] => {
    const now = new Date();
    return activeSchedule.filter(r => 
      r.status === 'scheduled' && 
      r.scheduledFor.getTime() + (r.duration * 60 * 1000) < now.getTime()
    );
  };

  const getRitualProgress = (ritualId: string): {
    ritual: ScheduledRitual | undefined;
    isActive: boolean;
    isOverdue: boolean;
    timeRemaining: number; // minutes
    progressPercentage: number;
  } => {
    const ritual = getRitual(ritualId);
    if (!ritual) {
      return {
        ritual: undefined,
        isActive: false,
        isOverdue: false,
        timeRemaining: 0,
        progressPercentage: 0
      };
    }

    const now = new Date();
    const scheduledTime = ritual.scheduledFor.getTime();
    const endTime = scheduledTime + (ritual.duration * 60 * 1000);
    const currentTime = now.getTime();

    const isActive = ritual.status === 'active';
    const isOverdue = ritual.status === 'scheduled' && currentTime > endTime;
    
    let timeRemaining = 0;
    let progressPercentage = 0;

    if (isActive) {
      timeRemaining = Math.max(0, Math.floor((endTime - currentTime) / (1000 * 60)));
      progressPercentage = Math.min(100, Math.max(0, 
        ((currentTime - scheduledTime) / (ritual.duration * 60 * 1000)) * 100
      ));
    } else if (ritual.status === 'scheduled') {
      timeRemaining = Math.max(0, Math.floor((scheduledTime - currentTime) / (1000 * 60)));
    }

    return {
      ritual,
      isActive,
      isOverdue,
      timeRemaining,
      progressPercentage
    };
  };

  // Quick scheduling helpers
  const scheduleCleansingRitual = (griefTier: number = 1, delayMinutes: number = 0) => {
    const template = templates.find(t => t.category === 'cleansing' && t.griefTiers.includes(griefTier));
    if (!template) return null;

    const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);
    return scheduleRitualMutation.mutate({ templateId: template.id, scheduledFor });
  };

  const scheduleIntegrationRitual = (griefTier: number = 3, delayMinutes: number = 30) => {
    const template = templates.find(t => t.category === 'integration' && t.griefTiers.includes(griefTier));
    if (!template) return null;

    const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);
    return scheduleRitualMutation.mutate({ templateId: template.id, scheduledFor });
  };

  const scheduleGroundingRitual = (delayMinutes: number = 60) => {
    const template = templates.find(t => t.category === 'grounding');
    if (!template) return null;

    const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);
    return scheduleRitualMutation.mutate({ templateId: template.id, scheduledFor });
  };

  // Statistics and metrics
  const getSchedulerMetrics = () => {
    const totalScheduled = activeSchedule.length;
    const byStatus = {
      scheduled: getRitualsByStatus('scheduled').length,
      active: getRitualsByStatus('active').length,
      completed: ritualHistory.length,
      cancelled: getRitualsByStatus('cancelled').length
    };

    const byCategory = {
      cleansing: getRitualsByCategory('cleansing').length,
      integration: getRitualsByCategory('integration').length,
      transformation: getRitualsByCategory('transformation').length,
      release: getRitualsByCategory('release').length,
      grounding: getRitualsByCategory('grounding').length
    };

    const upcomingCount = getUpcomingRituals().length;
    const overdueCount = getOverdueRituals().length;

    const completionRate = ritualHistory.length > 0
      ? ritualHistory.filter(r => r.results && r.results.participantSatisfaction > 0.7).length / ritualHistory.length
      : 0;

    const averageEffectiveness = ritualHistory.length > 0
      ? ritualHistory.reduce((sum, r) => sum + (r.results?.achievedResonance || 0), 0) / ritualHistory.length
      : 0;

    return {
      totalScheduled,
      byStatus,
      byCategory,
      upcomingCount,
      overdueCount,
      completionRate,
      averageEffectiveness,
      totalTemplates: templates.length
    };
  };

  return {
    // Data
    activeSchedule,
    templates,
    ritualHistory,
    schedulerMetrics: getSchedulerMetrics(),
    
    // Loading states
    scheduleLoading,
    templatesLoading,
    historyLoading,
    
    // Errors
    scheduleError,
    templatesError,
    
    // Core actions
    scheduleRitual: scheduleRitualMutation.mutate,
    scheduleForGriefTier: scheduleForGriefTierMutation.mutate,
    startRitual: startRitualMutation.mutate,
    completeRitual: completeRitualMutation.mutate,
    cancelRitual: cancelRitualMutation.mutate,
    
    // Mutation states
    scheduling: scheduleRitualMutation.isPending,
    schedulingForGrief: scheduleForGriefTierMutation.isPending,
    starting: startRitualMutation.isPending,
    completing: completeRitualMutation.isPending,
    cancelling: cancelRitualMutation.isPending,
    
    // Quick actions
    scheduleCleansingRitual,
    scheduleIntegrationRitual,
    scheduleGroundingRitual,
    
    // Helpers
    getRitual,
    getTemplatesForGriefTier,
    getRitualsByStatus,
    getRitualsByCategory,
    getUpcomingRituals,
    getActiveRituals,
    getOverdueRituals,
    getRitualProgress,
    
    // Refresh
    refetchSchedule
  };
}
