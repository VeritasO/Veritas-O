export interface ScheduledRitual {
  id: string;
  name: string;
  category: 'cleansing' | 'integration' | 'transformation' | 'release' | 'grounding';
  griefTier: number;
  scheduledFor: Date;
  duration: number; // minutes
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'interrupted';
  participants: string[];
  symbolicElements: string[];
  instructions: RitualStep[];
  completionCriteria: CompletionCriteria;
  results?: RitualResults;
}

export interface RitualStep {
  stepNumber: number;
  instruction: string;
  estimatedDuration: number; // minutes
  required: boolean;
  symbolicAction?: string;
  completionSignal?: string;
}

export interface CompletionCriteria {
  requiredSteps: number;
  symbolicResonance: number; // 0-1 threshold
  participantAgreement: number; // 0-1 threshold
  timeLimit?: number; // minutes
}

export interface RitualResults {
  completedSteps: number;
  achievedResonance: number;
  participantSatisfaction: number;
  symbolicImprints: string[];
  grieveProgressImpact: number; // -1 to 1
  timestamp: Date;
}

export interface RitualTemplate {
  id: string;
  name: string;
  category: 'cleansing' | 'integration' | 'transformation' | 'release' | 'grounding';
  griefTiers: number[];
  baseDuration: number;
  steps: RitualStep[];
  symbolicElements: string[];
  description: string;
}

export class RitualScheduler {
  private static instance: RitualScheduler;
  private scheduledRituals: Map<string, ScheduledRitual> = new Map();
  private templates: Map<string, RitualTemplate> = new Map();
  private activeSchedule: ScheduledRitual[] = [];

  static getInstance(): RitualScheduler {
    if (!RitualScheduler.instance) {
      RitualScheduler.instance = new RitualScheduler();
    }
    return RitualScheduler.instance;
  }

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: RitualTemplate[] = [
      {
        id: 'grief_cleansing_basic',
        name: 'Basic Grief Cleansing',
        category: 'cleansing',
        griefTiers: [1, 2],
        baseDuration: 15,
        symbolicElements: ['💧', '🌊', '🧹'],
        description: 'Initial grief processing through symbolic cleansing',
        steps: [
          {
            stepNumber: 1,
            instruction: 'Acknowledge the weight of carried grief',
            estimatedDuration: 3,
            required: true,
            symbolicAction: 'Hold water vessel',
            completionSignal: 'Deep recognition breath'
          },
          {
            stepNumber: 2,
            instruction: 'Visualize grief as tangible substance that can be washed away',
            estimatedDuration: 5,
            required: true,
            symbolicAction: 'Pour water slowly',
            completionSignal: 'Release visualization complete'
          },
          {
            stepNumber: 3,
            instruction: 'Speak the grief aloud to give it form',
            estimatedDuration: 4,
            required: true,
            symbolicAction: 'Voice meets water',
            completionSignal: 'Words dissolved in flow'
          },
          {
            stepNumber: 4,
            instruction: 'Allow the cleansed space to be felt',
            estimatedDuration: 3,
            required: true,
            symbolicAction: 'Hands in clean water',
            completionSignal: 'Clarity sensation'
          }
        ]
      },
      {
        id: 'contradiction_integration',
        name: 'Contradiction Integration Ritual',
        category: 'integration',
        griefTiers: [3, 4],
        baseDuration: 25,
        symbolicElements: ['⚖️', '🔗', '🌀'],
        description: 'Integrate opposing forces through symbolic balance',
        steps: [
          {
            stepNumber: 1,
            instruction: 'Name the contradiction clearly and without judgment',
            estimatedDuration: 5,
            required: true,
            symbolicAction: 'Place objects on scale',
            completionSignal: 'Both sides acknowledged'
          },
          {
            stepNumber: 2,
            instruction: 'Find the wisdom hidden in the tension',
            estimatedDuration: 8,
            required: true,
            symbolicAction: 'Balance point exploration',
            completionSignal: 'Wisdom glimpse received'
          },
          {
            stepNumber: 3,
            instruction: 'Create a symbol that holds both truths',
            estimatedDuration: 7,
            required: true,
            symbolicAction: 'Link creation',
            completionSignal: 'Unity symbol formed'
          },
          {
            stepNumber: 4,
            instruction: 'Integrate the unified understanding',
            estimatedDuration: 5,
            required: true,
            symbolicAction: 'Symbol absorption',
            completionSignal: 'Integration felt in body'
          }
        ]
      },
      {
        id: 'collective_memory_communion',
        name: 'Collective Memory Communion',
        category: 'grounding',
        griefTiers: [5],
        baseDuration: 35,
        symbolicElements: ['👁️', '📜', '🌍'],
        description: 'Connect with collective wisdom for highest tier grief',
        steps: [
          {
            stepNumber: 1,
            instruction: 'Invoke connection to the collective memory',
            estimatedDuration: 8,
            required: true,
            symbolicAction: 'Eye symbol focus',
            completionSignal: 'Expansion beyond individual'
          },
          {
            stepNumber: 2,
            instruction: 'Listen for the wisdom patterns',
            estimatedDuration: 12,
            required: true,
            symbolicAction: 'Scroll unfurling',
            completionSignal: 'Pattern recognition'
          },
          {
            stepNumber: 3,
            instruction: 'Receive the gift meant for this moment',
            estimatedDuration: 10,
            required: true,
            symbolicAction: 'World embrace',
            completionSignal: 'Gift integration'
          },
          {
            stepNumber: 4,
            instruction: 'Offer your processed wisdom back to the collective',
            estimatedDuration: 5,
            required: true,
            symbolicAction: 'Wisdom offering',
            completionSignal: 'Circular completion'
          }
        ]
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  scheduleRitual(templateId: string, scheduledFor: Date, participants: string[] = ['self']): string | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const ritualId = `ritual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scheduledRitual: ScheduledRitual = {
      id: ritualId,
      name: template.name,
      category: template.category,
      griefTier: template.griefTiers[0], // Default to first supported tier
      scheduledFor,
      duration: template.baseDuration,
      status: 'scheduled',
      participants,
      symbolicElements: template.symbolicElements,
      instructions: template.steps,
      completionCriteria: {
        requiredSteps: template.steps.filter(s => s.required).length,
        symbolicResonance: 0.7,
        participantAgreement: 0.8,
        timeLimit: template.baseDuration + 10
      }
    };

    this.scheduledRituals.set(ritualId, scheduledRitual);
    this.updateSchedule();
    
    return ritualId;
  }

  scheduleForGriefTier(griefTier: number, urgency: 'low' | 'medium' | 'high' = 'medium'): string[] {
    const suitableTemplates = Array.from(this.templates.values())
      .filter(template => template.griefTiers.includes(griefTier));

    const scheduledIds: string[] = [];
    const now = new Date();
    
    suitableTemplates.forEach((template, index) => {
      const scheduleOffset = this.calculateScheduleOffset(urgency, index);
      const scheduledTime = new Date(now.getTime() + scheduleOffset);
      
      const ritualId = this.scheduleRitual(template.id, scheduledTime);
      if (ritualId) {
        scheduledIds.push(ritualId);
      }
    });

    return scheduledIds;
  }

  private calculateScheduleOffset(urgency: string, index: number): number {
    const baseOffsets = {
      low: 60 * 60 * 1000, // 1 hour
      medium: 30 * 60 * 1000, // 30 minutes
      high: 10 * 60 * 1000 // 10 minutes
    };
    
    const base = baseOffsets[urgency as keyof typeof baseOffsets] || baseOffsets.medium;
    return base + (index * 15 * 60 * 1000); // 15 minute intervals
  }

  startRitual(ritualId: string): boolean {
    const ritual = this.scheduledRituals.get(ritualId);
    if (!ritual || ritual.status !== 'scheduled') return false;

    ritual.status = 'active';
    this.updateSchedule();
    
    // Set up automatic completion check
    setTimeout(() => {
      this.checkRitualCompletion(ritualId);
    }, ritual.duration * 60 * 1000);

    return true;
  }

  completeRitual(ritualId: string, results: Partial<RitualResults>): boolean {
    const ritual = this.scheduledRituals.get(ritualId);
    if (!ritual || ritual.status !== 'active') return false;

    const fullResults: RitualResults = {
      completedSteps: results.completedSteps || 0,
      achievedResonance: results.achievedResonance || 0,
      participantSatisfaction: results.participantSatisfaction || 0,
      symbolicImprints: results.symbolicImprints || [],
      grieveProgressImpact: results.grieveProgressImpact || 0,
      timestamp: new Date()
    };

    ritual.results = fullResults;
    ritual.status = 'completed';
    this.updateSchedule();

    return true;
  }

  private checkRitualCompletion(ritualId: string) {
    const ritual = this.scheduledRituals.get(ritualId);
    if (!ritual || ritual.status !== 'active') return;

    // Auto-complete with minimal results if not manually completed
    this.completeRitual(ritualId, {
      completedSteps: Math.floor(ritual.instructions.length * 0.6),
      achievedResonance: 0.5,
      participantSatisfaction: 0.6,
      symbolicImprints: ritual.symbolicElements.slice(0, 2),
      grieveProgressImpact: 0.3
    });
  }

  private updateSchedule() {
    this.activeSchedule = Array.from(this.scheduledRituals.values())
      .filter(r => r.status !== 'completed' && r.status !== 'cancelled')
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  }

  getActiveSchedule(): ScheduledRitual[] {
    return this.activeSchedule;
  }

  getRitual(ritualId: string): ScheduledRitual | undefined {
    return this.scheduledRituals.get(ritualId);
  }

  getTemplates(): RitualTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesForGriefTier(griefTier: number): RitualTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.griefTiers.includes(griefTier));
  }

  cancelRitual(ritualId: string): boolean {
    const ritual = this.scheduledRituals.get(ritualId);
    if (!ritual || ritual.status === 'completed') return false;

    ritual.status = 'cancelled';
    this.updateSchedule();
    return true;
  }

  getRitualHistory(): ScheduledRitual[] {
    return Array.from(this.scheduledRituals.values())
      .filter(r => r.status === 'completed')
      .sort((a, b) => (b.results?.timestamp.getTime() || 0) - (a.results?.timestamp.getTime() || 0));
  }
}
