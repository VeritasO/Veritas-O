import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import { AgentManifest, sendMessage, type AgentName, type InterAgentMessage } from '../lib/agents'

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentName>('JUNO')
  const [messageType, setMessageType] = useState<InterAgentMessage['type']>('LOG')
  const [messagePayload, setMessagePayload] = useState('')

  const { data: agentStatuses } = useQuery({
    queryKey: queryKeys.agents,
    queryFn: async () => {
      const statuses = await Promise.all(
        Object.keys(AgentManifest).map(async (name) => ({
          name: name as AgentName,
          ...await AgentManifest[name as AgentName].status()
        }))
      )
      return statuses
    },
    refetchInterval: 10000,
  })

  const handleSendMessage = () => {
    const message: InterAgentMessage = {
      from: 'JUNO', // In a real app, this would be the current user's agent
      to: selectedAgent,
      type: messageType,
      payload: messagePayload,
      timestamp: Date.now(),
    }
    
    sendMessage(message)
    setMessagePayload('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Agent Management</h1>
        <p className="text-slate-400">Monitor and interact with Veritas Agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Agent Status</h2>
            <div className="space-y-4">
              {agentStatuses?.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-blue-200">{agent.name}</h3>
                    <p className="text-sm text-slate-400">
                      {agent.currentTaskCount} active tasks
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      Date.now() - agent.lastTaskTime < 60000 ? 'bg-green-400' :
                      Date.now() - agent.lastTaskTime < 300000 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-slate-400">
                      {new Date(agent.lastTaskTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">Send Message</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Agent
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value as AgentName)}
                className="input w-full"
              >
                {Object.keys(AgentManifest).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message Type
              </label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as InterAgentMessage['type'])}
                className="input w-full"
              >
                <option value="LOG">Log</option>
                <option value="REQUEST">Request</option>
                <option value="ALERT">Alert</option>
                <option value="RITUAL">Ritual</option>
                <option value="SYNC">Sync</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Payload
              </label>
              <textarea
                value={messagePayload}
                onChange={(e) => setMessagePayload(e.target.value)}
                placeholder="Enter message payload..."
                className="input w-full h-24 resize-none"
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messagePayload.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agents
