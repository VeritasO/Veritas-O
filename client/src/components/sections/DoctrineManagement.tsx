// Show doctrine panel
import React from "react";

const DoctrineManagement: React.FC<{ onInteraction?: (action: string, details?: string) => void }> = ({ onInteraction }) => {
  React.useEffect(() => {
    onInteraction?.("view_doctrine");
  }, [onInteraction]);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Doctrine of Meaningful Thought</h2>
      <ul className="list-disc pl-6">
        <li>Transparent Reasoning</li>
        <li>Proportional Impact</li>
        <li>Communal Healing</li>
      </ul>
      <p className="text-sm text-gray-500 mt-2">Refer to Canonical Books I-III for details.</p>
    </div>
  );
};

export default DoctrineManagement;
