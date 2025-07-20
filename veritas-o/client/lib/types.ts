import { AgentName } from './validators'

export interface AgentMessage {
  id?: string
  agent: AgentName | string
  content: string
  timestamp?: number
  type?: 'proposal' | 'comment' | 'contradiction' | 'ritual' | 'reflection'
}

export interface Contradiction {
  id: string
  summary: string
  statement1: string
  statement2: string
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  detectedBy: AgentName
  resolved: boolean
  resolution?: string
  createdAt: Date
}

export interface CollaborationState {
  messages: AgentMessage[]
  contradictions: Contradiction[]
  activeRituals: string[]
}

export interface AgentCapabilities {
  [key: string]: string[]
}

export interface RitualParticipant {
  agent: AgentName
  role: string
  status: 'invited' | 'joined' | 'active' | 'completed'
}

export interface Ritual {
  id: string
  name: string
  purpose: string
  phase: 'preparation' | 'invocation' | 'working' | 'manifestation' | 'banishing'
  participants: RitualParticipant[]
  startTime: Date
  endTime?: Date
  result?: string
}
