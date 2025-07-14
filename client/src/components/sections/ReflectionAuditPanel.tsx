import React from "react";

// Example audit trail data (replace with API data as needed)
const auditTrail = [
  { status: 'Submitted', timestamp: '2025-07-13T10:45Z' },
  { status: 'Reviewed', timestamp: '2025-07-13T11:30Z' },
  { status: 'Assigned', timestamp: '2025-07-13T12:00Z' }
];

const ReflectionAuditPanel: React.FC = () => {
  return (
    <section className="panel space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">📊 Reflection Audit Trail</h2>
      <p className="text-gray-700">Track status changes and key moments of a reflection's lifecycle. Ensures transparency and time-reversible justice tracking.</p>
      <div>
        {auditTrail.map((entry, idx) => (
          <div key={idx} className="growth-log text-sm bg-gray-100 rounded p-2 mb-2">
            <span className="font-semibold">{entry.timestamp}:</span> {entry.status}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReflectionAuditPanel;
