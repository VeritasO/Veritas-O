import React from "react";
// import { Agent } from "@shared/schema";

interface SystemOverviewProps {
  agents?: any[];
  analytics?: { activeSessions: number; reflectionsSubmitted: number; agentsOnline: number };
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ agents = [], analytics }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">🌱 Veritas.O Seed System</h2>
      <p className="text-lg leading-relaxed">
        <strong>Kernel:</strong> v5.5.0-CODIFIED
      </p>
      <p className="text-lg leading-relaxed">
        <strong>Purpose:</strong> Restoration-first, grief-integrated justice platform built for fairness across time and space.
      </p>
      <p className="text-lg leading-relaxed">
        <strong>Powered by:</strong> JUNO, TEMPUS, AEGIS, LYRA, VESTA, THALEA + OmniMemory & CVT
      </p>
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">🧠 Active Agents</h3>
        {agents.length === 0 ? (
          <p className="text-gray-600 italic">No active agents found.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <li key={agent.id} className="bg-white p-4 rounded-md shadow-sm border-l-4" style={{ borderColor: agent.iconColor }}>
                <h4 className="text-xl font-semibold text-gray-800">{agent.name} ({agent.role})</h4>
                <p className="text-gray-700">{agent.description}</p>
                {agent.symbolicMeaning && (
                  <p className="text-sm text-gray-600 mt-1">Symbolic Meaning: {agent.symbolicMeaning}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Status: <span className={`font-semibold ${agent.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{agent.status}</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {analytics && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">📊 System Analytics Snapshot</h3>
          <ul className="text-lg space-y-2">
            <li><strong>Active Sessions:</strong> {analytics.activeSessions ?? "N/A"}</li>
            <li><strong>Reflections Submitted:</strong> {analytics.reflectionsSubmitted ?? "N/A"}</li>
            <li><strong>Agents Online:</strong> {analytics.agentsOnline ?? "N/A"}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemOverview;
