import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TribunalCase, TribunalEvidence, TribunalVerdict, TribunalEngine } from '@/lib/tribunalLogic';

const tribunalEngine = TribunalEngine.getInstance();

export function useTribunal() {
  const queryClient = useQueryClient();

  const {
    data: cases = [],
    isLoading: casesLoading,
    error: casesError,
    refetch: refetchCases
  } = useQuery({
    queryKey: ['tribunal', 'cases'],
    queryFn: () => tribunalEngine.getAllCases(),
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  const {
    data: judges = [],
    isLoading: judgesLoading,
    error: judgesError
  } = useQuery({
    queryKey: ['tribunal', 'judges'],
    queryFn: () => tribunalEngine.getJudges()
  });

  const {
    data: activeCases = [],
    isLoading: activeCasesLoading
  } = useQuery({
    queryKey: ['tribunal', 'activeCases'],
    queryFn: () => tribunalEngine.getActiveCases(),
    refetchInterval: 3000
  });

  const createCaseMutation = useMutation({
    mutationFn: ({ reflectionId, contradictionId, griefTier }: {
      reflectionId: string;
      contradictionId?: string;
      griefTier?: number;
    }) => {
      const caseId = tribunalEngine.createCase(reflectionId, contradictionId, griefTier);
      return Promise.resolve(caseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribunal'] });
    }
  });

  const addEvidenceMutation = useMutation({
    mutationFn: ({ caseId, evidence }: {
      caseId: string;
      evidence: Omit<TribunalEvidence, 'id' | 'timestamp'>;
    }) => {
      const success = tribunalEngine.addEvidence(caseId, evidence);
      return Promise.resolve(success);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribunal'] });
    }
  });

  const deliberateCaseMutation = useMutation({
    mutationFn: (caseId: string) => {
      const verdict = tribunalEngine.deliberateCase(caseId);
      return Promise.resolve(verdict);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribunal'] });
    }
  });

  const getCase = (caseId: string): TribunalCase | undefined => {
    return tribunalEngine.getCase(caseId);
  };

  const getCasesByStatus = (status: TribunalCase['status']): TribunalCase[] => {
    return cases.filter(c => c.status === status);
  };

  const getJudgeWorkload = (judgeId: string): number => {
    const judge = judges.find(j => j.id === judgeId);
    return judge?.activeCases.length || 0;
  };

  const getCasesByGriefTier = (griefTier: number): TribunalCase[] => {
    return cases.filter(c => c.griefTier === griefTier);
  };

  const getCasesByJusticeTier = (justiceTier: number): TribunalCase[] => {
    return cases.filter(c => c.justiceTier === justiceTier);
  };

  const getRecentVerdicts = (limit: number = 10): TribunalVerdict[] => {
    return cases
      .filter(c => c.verdict && c.resolvedAt)
      .sort((a, b) => (b.resolvedAt?.getTime() || 0) - (a.resolvedAt?.getTime() || 0))
      .slice(0, limit)
      .map(c => c.verdict!)
      .filter(Boolean);
  };

  return {
    // Data
    cases,
    judges,
    activeCases,
    
    // Loading states
    casesLoading,
    judgesLoading,
    activeCasesLoading,
    
    // Errors
    casesError,
    judgesError,
    
    // Mutations
    createCase: createCaseMutation.mutate,
    addEvidence: addEvidenceMutation.mutate,
    deliberateCase: deliberateCaseMutation.mutate,
    
    // Mutation states
    creatingCase: createCaseMutation.isPending,
    addingEvidence: addEvidenceMutation.isPending,
    deliberating: deliberateCaseMutation.isPending,
    
    // Helpers
    getCase,
    getCasesByStatus,
    getJudgeWorkload,
    getCasesByGriefTier,
    getCasesByJusticeTier,
    getRecentVerdicts,
    refetchCases,
    
    // Statistics
    totalCases: cases.length,
    pendingCases: getCasesByStatus('pending').length,
    resolvedCases: getCasesByStatus('resolved').length,
    averageResolutionTime: cases
      .filter(c => c.resolvedAt)
      .reduce((sum, c) => {
        const duration = (c.resolvedAt!.getTime() - c.createdAt.getTime()) / (1000 * 60); // minutes
        return sum + duration;
      }, 0) / Math.max(1, getCasesByStatus('resolved').length)
  };
}
