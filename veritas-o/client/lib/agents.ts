// /client/lib/agents.ts

/**
 * AgentManifest: core registry for all Veritas Agents
 */

export type AgentName =
  | "JUNO"
  | "AEGIS"
  | "LYRA"
  | "THALEA"
  | "KAIROS"
  | "VESTA"
  | "ORION"
  | "POLYMNIA"
  | "TEMPUS"
  | "MIRRA";

export type AgentTask = {
  id: string;
  agent: AgentName;
  input: Record<string, any>;
  timestamp: number;
  priority?: number;
  griefTier?: number;
  originatingAgent?: AgentName;
};

export interface Agent {
  name: AgentName;
  receive: (task: AgentTask) => Promise<void>;
  status: () => Promise<AgentStatus>;
  onMessage?: (msg: InterAgentMessage) => void;
}

export type AgentStatus = {
  lastTaskTime: number;
  currentTaskCount: number;
  griefSignature?: string;
};

export type InterAgentMessage = {
  from: AgentName;
  to: AgentName | "ALL";
  type: "LOG" | "REQUEST" | "ALERT" | "RITUAL" | "SYNC";
  payload: any;
  timestamp: number;
};

export const AgentManifest: Record<AgentName, Agent> = {
  JUNO:    { name: "JUNO", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  AEGIS:   { name: "AEGIS", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  LYRA:    { name: "LYRA", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  THALEA:  { name: "THALEA", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  KAIROS:  { name: "KAIROS", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  VESTA:   { name: "VESTA", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  ORION:   { name: "ORION", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  POLYMNIA:{ name: "POLYMNIA", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  TEMPUS:  { name: "TEMPUS", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
  MIRRA:   { name: "MIRRA", receive: async () => {}, status: async () => ({ lastTaskTime: Date.now(), currentTaskCount: 0 }) },
};

export function sendMessage(message: InterAgentMessage) {
  if (message.to === "ALL") {
    Object.values(AgentManifest).forEach((agent) => agent.onMessage?.(message));
  } else {
    AgentManifest[message.to]?.onMessage?.(message);
  }
}

// Agent Task Queue Management
export class AgentTaskQueue {
  private queue: AgentTask[] = [];
  
  addTask(task: AgentTask) {
    this.queue.push(task);
    this.queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }
  
  getNextTask(): AgentTask | undefined {
    return this.queue.shift();
  }
  
  getQueueLength(): number {
    return this.queue.length;
  }
}
