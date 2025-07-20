import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import { AgentManifest, type AgentName } from '../lib/agents'

const Dashboard = () => {
  // Mock query for agent statuses - replace with actual API call
  const { data: agentStatuses } = useQuery({
    queryKey: queryKeys.agents,
    queryFn: async () => {
      // Simulate API call
      const statuses = await Promise.all(
        Object.keys(AgentManifest).map(async (name) => ({
          name: name as AgentName,
          ...await AgentManifest[name as AgentName].status()
        }))
      )
      return statuses
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-4">
          Veritas-O Agent Management System
        </h1>
        <p className="text-slate-400 text-lg">
          Monitoring and managing the collective intelligence of Veritas Agents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {agentStatuses?.map((agent) => (
          <div key={agent.name} className="card">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              {agent.name}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Tasks:</span>
                <span className="text-slate-200">{agent.currentTaskCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Active:</span>
                <span className="text-slate-200">
                  {new Date(agent.lastTaskTime).toLocaleTimeString()}
                </span>
              </div>
              {agent.griefSignature && (
                <div className="text-xs text-red-400 mt-2">
                  Grief: {agent.griefSignature}
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className={`w-3 h-3 rounded-full ${
                Date.now() - agent.lastTaskTime < 60000 
                  ? 'bg-green-400' 
                  : Date.now() - agent.lastTaskTime < 300000 
                    ? 'bg-yellow-400' 
                    : 'bg-red-400'
              }`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">
            System Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Active Agents:</span>
              <span className="text-green-400">
                {agentStatuses?.filter(a => Date.now() - a.lastTaskTime < 60000).length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Tasks:</span>
              <span className="text-blue-400">
                {agentStatuses?.reduce((sum, a) => sum + a.currentTaskCount, 0) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Grief Events:</span>
              <span className="text-red-400">
                {agentStatuses?.filter(a => a.griefSignature).length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">
            Recent Activity
          </h2>
          <div className="text-slate-400 text-center py-8">
            Activity feed coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
