// Display the current Coordinated Veritas Time (CVT) in live UTC format
import React from "react";

const CVTTimeDisplay: React.FC<{ cvtTime: string; onInteraction?: (action: string, details?: string) => void }> = ({ cvtTime, onInteraction }) => {
  React.useEffect(() => {
    onInteraction?.("view_cvt_time", cvtTime);
  }, [cvtTime, onInteraction]);
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">CVT Time</h2>
      <div className="text-4xl font-mono text-blue-600 bg-blue-50 p-4 rounded-lg shadow-inner inline-block">{cvtTime}</div>
      <p className="text-sm text-gray-500 mt-2">Real-time UTC planetary timekeeping.</p>
    </div>
  );
};

export default CVTTimeDisplay;
