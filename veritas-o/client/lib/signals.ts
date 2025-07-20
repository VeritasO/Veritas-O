export interface AgentSignal {
  id: string;
  agentId: string;
  timestamp: Date;
  signalType: 'alert' | 'coordination' | 'status' | 'ritual_request' | 'doctrine_update';
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
  acknowledged: boolean;
  responses: AgentResponse[];
}

export interface AgentResponse {
  id: string;
  respondingAgentId: string;
  timestamp: Date;
  responseType: 'acknowledgment' | 'question' | 'coordination' | 'conflict';
  content: string;
}

export interface SignalCoordination {
  signalId: string;
  coordinatingAgents: string[];
  status: 'pending' | 'active' | 'resolved' | 'escalated';
  resolutionPath?: string;
}

export class SignalProcessor {
  private static instance: SignalProcessor;
  private signals: Map<string, AgentSignal> = new Map();
  private coordination: Map<string, SignalCoordination> = new Map();

  static getInstance(): SignalProcessor {
    if (!SignalProcessor.instance) {
      SignalProcessor.instance = new SignalProcessor();
    }
    return SignalProcessor.instance;
  }

  emitSignal(signal: Omit<AgentSignal, 'id' | 'timestamp' | 'acknowledged' | 'responses'>): string {
    const id = `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullSignal: AgentSignal = {
      ...signal,
      id,
      timestamp: new Date(),
      acknowledged: false,
      responses: []
    };
    
    this.signals.set(id, fullSignal);
    this.processSignalCoordination(fullSignal);
    return id;
  }

  private processSignalCoordination(signal: AgentSignal) {
    // Determine which agents should coordinate on this signal
    const coordinatingAgents = this.determineCoordinatingAgents(signal);
    
    if (coordinatingAgents.length > 1) {
      const coordination: SignalCoordination = {
        signalId: signal.id,
        coordinatingAgents,
        status: 'pending'
      };
      this.coordination.set(signal.id, coordination);
    }
  }

  private determineCoordinatingAgents(signal: AgentSignal): string[] {
    // Logic to determine which agents should coordinate
    const agents: string[] = [];
    
    if (signal.signalType === 'ritual_request') {
      agents.push('ritual_coordinator', 'grief_processor');
    }
    
    if (signal.signalType === 'doctrine_update') {
      agents.push('doctrine_guardian', 'contradiction_tracker');
    }
    
    if (signal.priority === 'critical') {
      agents.push('tribunal_overseer');
    }
    
    return agents;
  }

  getActiveSignals(): AgentSignal[] {
    return Array.from(this.signals.values())
      .filter(signal => !signal.acknowledged)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getSignalCoordination(signalId: string): SignalCoordination | undefined {
    return this.coordination.get(signalId);
  }

  acknowledgeSignal(signalId: string, agentId: string): boolean {
    const signal = this.signals.get(signalId);
    if (!signal) return false;
    
    signal.acknowledged = true;
    signal.metadata.acknowledgedBy = agentId;
    signal.metadata.acknowledgedAt = new Date().toISOString();
    return true;
  }

  respondToSignal(signalId: string, response: Omit<AgentResponse, 'id' | 'timestamp'>): boolean {
    const signal = this.signals.get(signalId);
    if (!signal) return false;
    
    const fullResponse: AgentResponse = {
      ...response,
      id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    signal.responses.push(fullResponse);
    return true;
  }
}
