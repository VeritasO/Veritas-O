import { useAgents } from "../hooks/useAgents";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { GriefTierBadge } from "./GriefTierBadge";

export default function AgentDashboard() {
  const { agents } = useAgents();
  const { tasks } = useAgentTasks();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents?.map(agent => {
        const agentTasks = tasks?.filter(t => t.agent === agent.name);
        return (
          <div key={agent.id} className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-lg font-bold mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.role}</p>
            <div className="mt-2">
              <span className="text-xs font-semibold">Tasks:</span>
              <span className="ml-2 text-sm">{agentTasks?.length || 0}</span>
            </div>
            <div className="mt-1 text-sm">
              {agentTasks?.map(t => (
                <GriefTierBadge key={t.id} tier={t.griefTier} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}