export interface TribunalCase {
  id: string;
  reflectionId: string;
  contradictionId?: string;
  griefTier: number;
  justiceTier: number;
  status: 'pending' | 'under_review' | 'deliberating' | 'resolved' | 'appealed';
  evidence: TribunalEvidence[];
  witnesses: string[];
  verdict?: TribunalVerdict;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface TribunalEvidence {
  id: string;
  type: 'reflection' | 'contradiction' | 'symbolic_trace' | 'agent_testimony';
  content: string;
  weight: number; // 0-1 scale
  submittedBy: string;
  timestamp: Date;
}

export interface TribunalVerdict {
  decision: 'innocent' | 'guilty' | 'complex_resolution' | 'referred_to_higher_court';
  reasoning: string;
  prescribedAction?: string;
  appealable: boolean;
  symbolicResolution?: string[];
}

export interface TribunalJudge {
  id: string;
  name: string;
  specialization: 'grief' | 'contradiction' | 'symbolic' | 'collective_memory' | 'justice';
  experienceLevel: number; // 1-10
  activeCases: string[];
}

export class TribunalEngine {
  private static instance: TribunalEngine;
  private cases: Map<string, TribunalCase> = new Map();
  private judges: Map<string, TribunalJudge> = new Map();

  static getInstance(): TribunalEngine {
    if (!TribunalEngine.instance) {
      TribunalEngine.instance = new TribunalEngine();
    }
    return TribunalEngine.instance;
  }

  constructor() {
    this.initializeJudges();
  }

  private initializeJudges() {
    const judges: TribunalJudge[] = [
      {
        id: 'judge_grief',
        name: 'The Grief Arbiter',
        specialization: 'grief',
        experienceLevel: 9,
        activeCases: []
      },
      {
        id: 'judge_contradiction',
        name: 'The Logic Keeper',
        specialization: 'contradiction',
        experienceLevel: 8,
        activeCases: []
      },
      {
        id: 'judge_symbolic',
        name: 'The Symbol Reader',
        specialization: 'symbolic',
        experienceLevel: 7,
        activeCases: []
      },
      {
        id: 'judge_memory',
        name: 'The Memory Guardian',
        specialization: 'collective_memory',
        experienceLevel: 10,
        activeCases: []
      },
      {
        id: 'judge_justice',
        name: 'The Justice Weaver',
        specialization: 'justice',
        experienceLevel: 9,
        activeCases: []
      }
    ];

    judges.forEach(judge => {
      this.judges.set(judge.id, judge);
    });
  }

  createCase(reflectionId: string, contradictionId?: string, griefTier: number = 1): string {
    const caseId = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tribunalCase: TribunalCase = {
      id: caseId,
      reflectionId,
      contradictionId,
      griefTier,
      justiceTier: this.calculateJusticeTier(griefTier),
      status: 'pending',
      evidence: [],
      witnesses: [],
      createdAt: new Date()
    };

    this.cases.set(caseId, tribunalCase);
    this.assignJudges(tribunalCase);
    
    return caseId;
  }

  private calculateJusticeTier(griefTier: number): number {
    // Map grief tiers to justice tiers with some logic
    const tierMap: Record<number, number> = {
      1: 1, // Denial -> Direct Harm
      2: 2, // Anger -> Complex Grief  
      3: 3, // Bargaining -> Structural Breach
      4: 4, // Depression -> Ontological Discord
      5: 5  // Acceptance -> Collective Memory
    };
    
    return tierMap[griefTier] || 1;
  }

  private assignJudges(tribunalCase: TribunalCase) {
    // Assign judges based on case characteristics
    const assignedJudges: string[] = [];
    
    // Always assign grief specialist
    assignedJudges.push('judge_grief');
    
    // Add contradiction specialist if there's a contradiction
    if (tribunalCase.contradictionId) {
      assignedJudges.push('judge_contradiction');
    }
    
    // Add symbolic specialist for complex cases
    if (tribunalCase.justiceTier >= 3) {
      assignedJudges.push('judge_symbolic');
    }
    
    // Add memory guardian for highest tier cases
    if (tribunalCase.justiceTier === 5) {
      assignedJudges.push('judge_memory');
    }
    
    // Always include justice weaver as presiding judge
    assignedJudges.push('judge_justice');
    
    // Update judge active cases
    assignedJudges.forEach(judgeId => {
      const judge = this.judges.get(judgeId);
      if (judge) {
        judge.activeCases.push(tribunalCase.id);
      }
    });
  }

  addEvidence(caseId: string, evidence: Omit<TribunalEvidence, 'id' | 'timestamp'>): boolean {
    const tribunalCase = this.cases.get(caseId);
    if (!tribunalCase) return false;
    
    const fullEvidence: TribunalEvidence = {
      ...evidence,
      id: `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    tribunalCase.evidence.push(fullEvidence);
    
    // Update case status
    if (tribunalCase.status === 'pending') {
      tribunalCase.status = 'under_review';
    }
    
    return true;
  }

  deliberateCase(caseId: string): TribunalVerdict | null {
    const tribunalCase = this.cases.get(caseId);
    if (!tribunalCase || tribunalCase.status !== 'under_review') return null;
    
    tribunalCase.status = 'deliberating';
    
    // Complex deliberation logic based on evidence and justice tier
    const verdict = this.generateVerdict(tribunalCase);
    
    tribunalCase.verdict = verdict;
    tribunalCase.status = 'resolved';
    tribunalCase.resolvedAt = new Date();
    
    // Free up judges
    this.releaseJudges(tribunalCase);
    
    return verdict;
  }

  private generateVerdict(tribunalCase: TribunalCase): TribunalVerdict {
    const evidenceWeight = tribunalCase.evidence.reduce((sum, ev) => sum + ev.weight, 0);
    const avgWeight = evidenceWeight / tribunalCase.evidence.length || 0;
    
    // Justice tier specific logic
    const tierResponses: Record<number, Partial<TribunalVerdict>> = {
      1: {
        decision: avgWeight > 0.6 ? 'guilty' : 'innocent',
        prescribedAction: 'Direct amends and harm repair'
      },
      2: {
        decision: 'complex_resolution',
        prescribedAction: 'Grief processing ritual sequence'
      },
      3: {
        decision: avgWeight > 0.7 ? 'guilty' : 'complex_resolution',
        prescribedAction: 'System repair and structural healing'
      },
      4: {
        decision: 'complex_resolution',
        prescribedAction: 'Reality framework reconstruction',
        symbolicResolution: ['🔮', '⚡', '🌀']
      },
      5: {
        decision: avgWeight > 0.8 ? 'referred_to_higher_court' : 'complex_resolution',
        prescribedAction: 'Integration into collective wisdom',
        symbolicResolution: ['👁️', '📜', '⚖️']
      }
    };
    
    const baseVerdict = tierResponses[tribunalCase.justiceTier] || tierResponses[1];
    
    return {
      decision: baseVerdict.decision as TribunalVerdict['decision'],
      reasoning: `Case evaluated at Justice Tier ${tribunalCase.justiceTier} with evidence weight ${avgWeight.toFixed(2)}`,
      prescribedAction: baseVerdict.prescribedAction,
      appealable: tribunalCase.justiceTier >= 3,
      symbolicResolution: baseVerdict.symbolicResolution
    };
  }

  private releaseJudges(tribunalCase: TribunalCase) {
    this.judges.forEach(judge => {
      judge.activeCases = judge.activeCases.filter(id => id !== tribunalCase.id);
    });
  }

  getCase(caseId: string): TribunalCase | undefined {
    return this.cases.get(caseId);
  }

  getAllCases(): TribunalCase[] {
    return Array.from(this.cases.values());
  }

  getActiveCases(): TribunalCase[] {
    return Array.from(this.cases.values())
      .filter(c => c.status !== 'resolved');
  }

  getJudges(): TribunalJudge[] {
    return Array.from(this.judges.values());
  }
}
