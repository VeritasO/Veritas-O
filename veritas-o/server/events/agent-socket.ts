import { Server as SocketIOServer } from 'socket.io'
import { Server } from 'http'
import type { 
  AgentName, 
  InterAgentMessage, 
  AgentTask, 
  AgentStatus 
} from '../../client/lib/validators'

export class AgentSocketManager {
  private io: SocketIOServer
  private connectedClients: Map<string, any> = new Map()
  private agentSubscriptions: Map<AgentName, Set<string>> = new Map()

  constructor(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`)
      this.connectedClients.set(socket.id, socket)

      // Handle agent subscription
      socket.on('subscribe:agent', (agentName: AgentName) => {
        console.log(`📡 Client ${socket.id} subscribed to agent: ${agentName}`)
        
        if (!this.agentSubscriptions.has(agentName)) {
          this.agentSubscriptions.set(agentName, new Set())
        }
        this.agentSubscriptions.get(agentName)!.add(socket.id)
        
        socket.join(`agent:${agentName}`)
      })

      // Handle agent unsubscription
      socket.on('unsubscribe:agent', (agentName: AgentName) => {
        console.log(`📡 Client ${socket.id} unsubscribed from agent: ${agentName}`)
        
        const subscribers = this.agentSubscriptions.get(agentName)
        if (subscribers) {
          subscribers.delete(socket.id)
          if (subscribers.size === 0) {
            this.agentSubscriptions.delete(agentName)
          }
        }
        
        socket.leave(`agent:${agentName}`)
      })

      // Handle sending messages to agents
      socket.on('agent:message', (data: { 
        agentName: AgentName, 
        message: InterAgentMessage 
      }) => {
        console.log(`💬 Message sent to ${data.agentName}:`, data.message)
        this.broadcastToAgent(data.agentName, 'agent:message:received', data.message)
        
        // Also broadcast to system-wide listeners
        this.io.emit('system:message', {
          agentName: data.agentName,
          message: data.message,
          timestamp: Date.now()
        })
      })

      // Handle agent task updates
      socket.on('agent:task:update', (data: {
        agentName: AgentName,
        task: AgentTask
      }) => {
        console.log(`📋 Task update for ${data.agentName}:`, data.task.id)
        this.broadcastToAgent(data.agentName, 'agent:task:updated', data.task)
      })

      // Handle agent status updates
      socket.on('agent:status:update', (data: {
        agentName: AgentName,
        status: AgentStatus
      }) => {
        console.log(`🔄 Status update for ${data.agentName}`)
        this.broadcastToAgent(data.agentName, 'agent:status:updated', data.status)
        
        // Broadcast to dashboard subscribers
        this.io.to('dashboard').emit('dashboard:agent:status', {
          agentName: data.agentName,
          status: data.status
        })
      })

      // Handle ritual events
      socket.on('ritual:start', (data: {
        ritualId: string,
        participants: AgentName[],
        name: string
      }) => {
        console.log(`🕯️ Ritual started: ${data.name}`)
        
        // Notify all participants
        data.participants.forEach(agentName => {
          this.broadcastToAgent(agentName, 'ritual:started', data)
        })
        
        // Broadcast to system
        this.io.emit('system:ritual:started', data)
      })

      socket.on('ritual:end', (data: {
        ritualId: string,
        result: string
      }) => {
        console.log(`🕯️ Ritual ended: ${data.ritualId}`)
        this.io.emit('system:ritual:ended', data)
      })

      // Handle contradiction alerts
      socket.on('contradiction:detected', (data: {
        contradiction: any,
        severity: 'minor' | 'moderate' | 'major' | 'critical'
      }) => {
        console.log(`⚡ Contradiction detected: ${data.severity}`)
        
        // Broadcast critical contradictions immediately
        if (data.severity === 'critical') {
          this.io.emit('system:alert:critical', {
            type: 'contradiction',
            data: data.contradiction,
            timestamp: Date.now()
          })
        }
        
        this.io.to('contradictions').emit('contradiction:new', data)
      })

      // Handle dashboard subscription
      socket.on('subscribe:dashboard', () => {
        socket.join('dashboard')
        console.log(`📊 Client ${socket.id} subscribed to dashboard`)
      })

      socket.on('subscribe:contradictions', () => {
        socket.join('contradictions')
        console.log(`⚡ Client ${socket.id} subscribed to contradictions`)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`)
        this.connectedClients.delete(socket.id)
        
        // Remove from all agent subscriptions
        this.agentSubscriptions.forEach((subscribers, agentName) => {
          if (subscribers.has(socket.id)) {
            subscribers.delete(socket.id)
            if (subscribers.size === 0) {
              this.agentSubscriptions.delete(agentName)
            }
          }
        })
      })
    })
  }

  // Broadcast message to specific agent subscribers
  private broadcastToAgent(agentName: AgentName, event: string, data: any) {
    this.io.to(`agent:${agentName}`).emit(event, data)
  }

  // Public methods for server-side events
  public notifyAgentStatusChange(agentName: AgentName, status: AgentStatus) {
    this.broadcastToAgent(agentName, 'agent:status:changed', status)
    this.io.to('dashboard').emit('dashboard:agent:status', { agentName, status })
  }

  public notifyGriefEvent(agentName: AgentName, griefData: any) {
    console.log(`😢 Grief event for ${agentName}`)
    this.broadcastToAgent(agentName, 'agent:grief:detected', griefData)
    
    // If grief is critical, broadcast system-wide
    if (griefData.severity === 'critical') {
      this.io.emit('system:alert:critical', {
        type: 'grief',
        agentName,
        data: griefData,
        timestamp: Date.now()
      })
    }
  }

  public notifySystemEvent(event: string, data: any) {
    this.io.emit(`system:${event}`, data)
  }

  public getConnectedClientsCount(): number {
    return this.connectedClients.size
  }

  public getAgentSubscribers(agentName: AgentName): number {
    return this.agentSubscriptions.get(agentName)?.size || 0
  }
}

// Export singleton instance
let agentSocketManager: AgentSocketManager | null = null

export const initializeAgentSockets = (server: Server): AgentSocketManager => {
  if (!agentSocketManager) {
    agentSocketManager = new AgentSocketManager(server)
  }
  return agentSocketManager
}

export const getAgentSocketManager = (): AgentSocketManager => {
  if (!agentSocketManager) {
    throw new Error('AgentSocketManager not initialized. Call initializeAgentSockets first.')
  }
  return agentSocketManager
}
