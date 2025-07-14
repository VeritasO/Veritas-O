// System analytics panel
import React from "react";

const SystemAnalytics: React.FC<{ analytics?: any; onInteraction?: (action: string, details?: string) => void }> = ({ analytics, onInteraction }) => {
  React.useEffect(() => {
    onInteraction?.("view_system_analytics");
  }, [onInteraction]);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Analytics</h2>
      {analytics ? (
        <ul>
          <li>Active Sessions: {analytics.activeSessions}</li>
          <li>Reflections Submitted: {analytics.reflectionsSubmitted}</li>
          <li>Agents Online: {analytics.agentsOnline}</li>
        </ul>
      ) : (
        <div className="text-gray-500">Loading analytics...</div>
      )}
    </div>
  );
};

export default SystemAnalytics;
