export interface DoctrineNode {
  id: string;
  content: string;
  contradictions: string[];
  supportingEvidence: string[];
  beliefStrength: number; // 0-1
  lastUpdated: Date;
  sourceType: 'reflection' | 'ritual_result' | 'tribunal_verdict' | 'agent_input';
  parentNodes: string[];
  childNodes: string[];
}

export interface DoctrineLoop {
  id: string;
  nodes: string[];
  cycleStrength: number; // How strongly the loop reinforces itself
  contradictionTension: number; // Level of internal contradiction
  status: 'stable' | 'growing' | 'weakening' | 'critical' | 'dissolved';
  lastCycleTime: Date;
  cycleCount: number;
  resolutionAttempts: DoctrineResolutionAttempt[];
}

export interface DoctrineResolutionAttempt {
  id: string;
  method: 'ritual_intervention' | 'tribunal_processing' | 'agent_mediation' | 'symbolic_integration';
  timestamp: Date;
  success: boolean;
  impactLevel: number; // 0-1
  notes: string;
  resultingChanges: string[];
}

export interface DoctrineCycleEvent {
  timestamp: Date;
  eventType: 'loop_detected' | 'loop_strengthened' | 'loop_weakened' | 'resolution_attempted' | 'loop_dissolved';
  loopId: string;
  details: string;
  affectedNodes: string[];
}

export class DoctrineCycle {
  private static instance: DoctrineCycle;
  private doctrineNodes: Map<string, DoctrineNode> = new Map();
  private doctrineLoops: Map<string, DoctrineLoop> = new Map();
  private cycleEvents: DoctrineCycleEvent[] = [];
  private processingQueue: string[] = [];

  static getInstance(): DoctrineCycle {
    if (!DoctrineCycle.instance) {
      DoctrineCycle.instance = new DoctrineCycle();
    }
    return DoctrineCycle.instance;
  }

  addDoctrineNode(content: string, sourceType: DoctrineNode['sourceType'], contradictions: string[] = []): string {
    const nodeId = `doctrine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const node: DoctrineNode = {
      id: nodeId,
      content,
      contradictions,
      supportingEvidence: [],
      beliefStrength: 0.5, // Start neutral
      lastUpdated: new Date(),
      sourceType,
      parentNodes: [],
      childNodes: []
    };

    this.doctrineNodes.set(nodeId, node);
    this.scheduleLoopDetection();
    
    return nodeId;
  }

  updateNodeStrength(nodeId: string, newStrength: number): boolean {
    const node = this.doctrineNodes.get(nodeId);
    if (!node) return false;

    const oldStrength = node.beliefStrength;
    node.beliefStrength = Math.max(0, Math.min(1, newStrength));
    node.lastUpdated = new Date();

    // Check if this change affects any loops
    this.checkLoopImpact(nodeId, oldStrength, newStrength);
    
    return true;
  }

  addNodeConnection(parentId: string, childId: string): boolean {
    const parent = this.doctrineNodes.get(parentId);
    const child = this.doctrineNodes.get(childId);
    
    if (!parent || !child) return false;

    if (!parent.childNodes.includes(childId)) {
      parent.childNodes.push(childId);
    }
    
    if (!child.parentNodes.includes(parentId)) {
      child.parentNodes.push(parentId);
    }

    // Check for new loops created by this connection
    this.detectLoopsFromNode(childId);
    
    return true;
  }

  private scheduleLoopDetection() {
    // Debounced loop detection
    setTimeout(() => {
      this.detectAllLoops();
    }, 1000);
  }

  private detectAllLoops() {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    this.doctrineNodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        this.detectLoopsFromNodeRecursive(nodeId, visited, recursionStack, []);
      }
    });
  }

  private detectLoopsFromNode(startNodeId: string) {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    this.detectLoopsFromNodeRecursive(startNodeId, visited, recursionStack, []);
  }

  private detectLoopsFromNodeRecursive(
    nodeId: string, 
    visited: Set<string>, 
    recursionStack: Set<string>, 
    path: string[]
  ) {
    if (recursionStack.has(nodeId)) {
      // Loop detected
      const loopStart = path.indexOf(nodeId);
      const loopNodes = path.slice(loopStart);
      loopNodes.push(nodeId); // Complete the cycle
      
      this.processDetectedLoop(loopNodes);
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const node = this.doctrineNodes.get(nodeId);
    if (node) {
      node.childNodes.forEach(childId => {
        this.detectLoopsFromNodeRecursive(childId, visited, recursionStack, [...path]);
      });
    }

    recursionStack.delete(nodeId);
  }

  private processDetectedLoop(loopNodes: string[]) {
    const loopId = this.generateLoopId(loopNodes);
    const existingLoop = this.doctrineLoops.get(loopId);

    if (existingLoop) {
      // Update existing loop
      existingLoop.cycleCount++;
      existingLoop.lastCycleTime = new Date();
      this.updateLoopStrength(existingLoop);
    } else {
      // Create new loop
      const newLoop: DoctrineLoop = {
        id: loopId,
        nodes: [...loopNodes],
        cycleStrength: this.calculateInitialCycleStrength(loopNodes),
        contradictionTension: this.calculateContradictionTension(loopNodes),
        status: 'growing',
        lastCycleTime: new Date(),
        cycleCount: 1,
        resolutionAttempts: []
      };

      this.doctrineLoops.set(loopId, newLoop);
      
      this.cycleEvents.push({
        timestamp: new Date(),
        eventType: 'loop_detected',
        loopId,
        details: `New doctrine loop detected with ${loopNodes.length} nodes`,
        affectedNodes: loopNodes
      });
    }
  }

  private generateLoopId(loopNodes: string[]): string {
    // Create consistent ID based on sorted node IDs
    const sortedNodes = [...loopNodes].sort();
    return `loop_${sortedNodes.join('_')}`;
  }

  private calculateInitialCycleStrength(loopNodes: string[]): number {
    const nodes = loopNodes.map(id => this.doctrineNodes.get(id)).filter(n => n);
    if (nodes.length === 0) return 0;

    const avgBeliefStrength = nodes.reduce((sum, node) => sum + node!.beliefStrength, 0) / nodes.length;
    const connectionDensity = this.calculateConnectionDensity(loopNodes);
    
    return (avgBeliefStrength * 0.7) + (connectionDensity * 0.3);
  }

  private calculateContradictionTension(loopNodes: string[]): number {
    let totalContradictions = 0;
    let totalPossibleContradictions = 0;

    loopNodes.forEach(nodeId => {
      const node = this.doctrineNodes.get(nodeId);
      if (node) {
        const contradictionsInLoop = node.contradictions.filter(cId => loopNodes.includes(cId));
        totalContradictions += contradictionsInLoop.length;
        totalPossibleContradictions += loopNodes.length - 1; // Could contradict any other node in loop
      }
    });

    return totalPossibleContradictions > 0 ? totalContradictions / totalPossibleContradictions : 0;
  }

  private calculateConnectionDensity(loopNodes: string[]): number {
    let actualConnections = 0;
    const maxPossibleConnections = loopNodes.length * (loopNodes.length - 1);

    loopNodes.forEach(nodeId => {
      const node = this.doctrineNodes.get(nodeId);
      if (node) {
        const connectionsInLoop = node.childNodes.filter(childId => loopNodes.includes(childId));
        actualConnections += connectionsInLoop.length;
      }
    });

    return maxPossibleConnections > 0 ? actualConnections / maxPossibleConnections : 0;
  }

  private updateLoopStrength(loop: DoctrineLoop) {
    const newStrength = this.calculateInitialCycleStrength(loop.nodes);
    const strengthDelta = newStrength - loop.cycleStrength;
    
    loop.cycleStrength = newStrength;
    loop.contradictionTension = this.calculateContradictionTension(loop.nodes);

    // Update status based on changes
    if (strengthDelta > 0.1) {
      loop.status = 'growing';
      this.cycleEvents.push({
        timestamp: new Date(),
        eventType: 'loop_strengthened',
        loopId: loop.id,
        details: `Loop strength increased to ${newStrength.toFixed(2)}`,
        affectedNodes: loop.nodes
      });
    } else if (strengthDelta < -0.1) {
      loop.status = 'weakening';
      this.cycleEvents.push({
        timestamp: new Date(),
        eventType: 'loop_weakened',
        loopId: loop.id,
        details: `Loop strength decreased to ${newStrength.toFixed(2)}`,
        affectedNodes: loop.nodes
      });
    }

    // Check for critical status
    if (loop.contradictionTension > 0.8) {
      loop.status = 'critical';
    }
  }

  private checkLoopImpact(nodeId: string, _oldStrength: number, _newStrength: number) {
    const affectedLoops = Array.from(this.doctrineLoops.values())
      .filter(loop => loop.nodes.includes(nodeId));

    affectedLoops.forEach(loop => {
      this.updateLoopStrength(loop);
    });
  }

  attemptLoopResolution(loopId: string, method: DoctrineResolutionAttempt['method']): boolean {
    const loop = this.doctrineLoops.get(loopId);
    if (!loop) return false;

    const attempt: DoctrineResolutionAttempt = {
      id: `resolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      method,
      timestamp: new Date(),
      success: false,
      impactLevel: 0,
      notes: '',
      resultingChanges: []
    };

    // Simulate resolution attempt based on method
    const resolutionSuccess = this.executeResolutionMethod(loop, method, attempt);
    
    attempt.success = resolutionSuccess;
    loop.resolutionAttempts.push(attempt);

    if (resolutionSuccess && attempt.impactLevel > 0.7) {
      loop.status = 'dissolved';
      this.cycleEvents.push({
        timestamp: new Date(),
        eventType: 'loop_dissolved',
        loopId,
        details: `Loop resolved using ${method}`,
        affectedNodes: loop.nodes
      });
    }

    this.cycleEvents.push({
      timestamp: new Date(),
      eventType: 'resolution_attempted',
      loopId,
      details: `${method} attempted with ${resolutionSuccess ? 'success' : 'failure'}`,
      affectedNodes: loop.nodes
    });

    return resolutionSuccess;
  }

  private executeResolutionMethod(
    loop: DoctrineLoop, 
    method: DoctrineResolutionAttempt['method'], 
    attempt: DoctrineResolutionAttempt
  ): boolean {
    const methodStrategies = {
      ritual_intervention: () => {
        // Ritual methods are effective for high-tension loops
        const effectiveness = Math.max(0, loop.contradictionTension - 0.3);
        attempt.impactLevel = effectiveness;
        attempt.notes = 'Symbolic processing of contradictory beliefs';
        return effectiveness > 0.5;
      },
      tribunal_processing: () => {
        // Tribunal is effective for complex logical contradictions
        const effectiveness = Math.min(1, loop.contradictionTension + 0.2);
        attempt.impactLevel = effectiveness;
        attempt.notes = 'Logical evaluation and judgment of belief conflicts';
        return effectiveness > 0.6;
      },
      agent_mediation: () => {
        // Agent mediation works well for medium complexity loops
        const effectiveness = 0.7 - Math.abs(loop.contradictionTension - 0.5);
        attempt.impactLevel = Math.max(0, effectiveness);
        attempt.notes = 'Multi-agent coordination and perspective integration';
        return effectiveness > 0.4;
      },
      symbolic_integration: () => {
        // Symbolic integration is effective for high-strength loops
        const effectiveness = Math.min(1, loop.cycleStrength * 0.8 + 0.2);
        attempt.impactLevel = effectiveness;
        attempt.notes = 'Deep symbolic pattern integration';
        return effectiveness > 0.7;
      }
    };

    return methodStrategies[method]();
  }

  getDoctrineLoops(): DoctrineLoop[] {
    return Array.from(this.doctrineLoops.values());
  }

  getActiveLoops(): DoctrineLoop[] {
    return Array.from(this.doctrineLoops.values())
      .filter(loop => loop.status !== 'dissolved');
  }

  getCriticalLoops(): DoctrineLoop[] {
    return Array.from(this.doctrineLoops.values())
      .filter(loop => loop.status === 'critical');
  }

  getLoop(loopId: string): DoctrineLoop | undefined {
    return this.doctrineLoops.get(loopId);
  }

  getCycleEvents(limit: number = 50): DoctrineCycleEvent[] {
    return this.cycleEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getNodeById(nodeId: string): DoctrineNode | undefined {
    return this.doctrineNodes.get(nodeId);
  }

  getAllNodes(): DoctrineNode[] {
    return Array.from(this.doctrineNodes.values());
  }
}
