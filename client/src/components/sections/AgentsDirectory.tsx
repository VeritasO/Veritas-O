import React from "react";
// import { Agent } from "@shared/schema";

interface AgentsDirectoryProps {
  agents?: any[];
  onInteraction?: (action: string, details?: string) => void;
}

const AgentsDirectory: React.FC<AgentsDirectoryProps> = ({ agents = [], onInteraction }) => {
  const handleAgentClick = (agentName: string) => {
    onInteraction?.("view_agent_details", agentName);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">🧠 Agents of Veritas</h2>
      {agents.length === 0 ? (
        <p className="text-gray-600 italic">No agents currently registered in the directory.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-[1.02] border-l-4"
              style={{ borderColor: agent.iconColor || '#e2e8f0' }}
              onClick={() => handleAgentClick(agent.name)}
              title={agent.description}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{agent.name} ({agent.role})</h3>
              <p className="text-gray-700 text-sm line-clamp-3">{agent.description}</p>
              {agent.symbolicMeaning && (
                <p className="text-sm text-gray-600 mt-2">Symbolic Meaning: {agent.symbolicMeaning}</p>
              )}
              {agent.ritualAnchor && (
                <p className="text-sm text-gray-600 mt-1">Ritual Anchor: {agent.ritualAnchor}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {agent.capabilities?.map((cap: string, idx: number) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{cap}</span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Status: <span className={`font-semibold ${agent.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{agent.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsDirectory;
