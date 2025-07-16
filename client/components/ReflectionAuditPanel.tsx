import { useState } from "react";
import TempusClock from "./TempusClock";
import { GriefTierBadge } from "./GriefTierBadge";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { useSymbolicSuggestions } from "@/hooks/useSymbolicSuggestions";
import { useContradictions } from "@/hooks/useContradictions";

export default function ReflectionAuditPanel({ reflectionId = 1, setReflectionId }: { reflectionId?: number; setReflectionId?: (id: number) => void }) {
  const [status, setStatus] = useState<string>("pending");
  const auditLogs = useAuditLogs(reflectionId);
  const rituals = useSymbolicSuggestions("high");
  const contradictions = useContradictions();

  // Export handlers
  const exportJSON = () => {
    const data = auditLogs.data || [];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reflection_${reflectionId}_audit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const data = auditLogs.data || [];
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const rows = data.map((row: any) => headers.map(h => row[h]).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reflection_${reflectionId}_audit.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      {/* 1. CVT Time Widget */}
      <TempusClock />

      {/* 2. Reflection Status UI */}
      <div>
        <label className="font-semibold mr-2">Reflection Status:</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="audited">Audited</option>
        </select>
        {setReflectionId && (
          <input
            type="number"
            min={1}
            value={reflectionId}
            onChange={e => setReflectionId(Number(e.target.value))}
            className="ml-4 border rounded px-2 py-1 w-20"
            placeholder="Reflection ID"
          />
        )}
      </div>

      {/* 3. Audit Log View & Export */}
      <div>
        <h3 className="font-semibold mb-2">Audit Log</h3>
        {auditLogs.isLoading ? (
          <p>Loading audit logs...</p>
        ) : (
          <ul className="space-y-2">
            {auditLogs.data?.map((log: any) => (
              <li key={log.id} className="border p-2 rounded bg-gray-50">
                <span className="font-bold">#{log.reflectionId}</span> | {log.statusBefore} → {log.statusAfter} by {log.changedBy} ({log.reason})
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2 flex gap-2">
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={exportJSON}>Export JSON</button>
          <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {/* 4. Ritual Suggestion Engine (VESTA) */}
      <div>
        <h3 className="font-semibold mb-2">Ritual Suggestions <GriefTierBadge tier="high" /></h3>
        {rituals.isLoading ? (
          <p>Loading rituals...</p>
        ) : (
          <ul className="space-y-1">
            {rituals.data?.rituals?.map((r: string) => (
              <li key={r} className="bg-yellow-50 p-2 rounded">{r}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 5. Bias Scan (AEGIS) */}
      <div>
        <h3 className="font-semibold mb-2">Bias Scan (AEGIS)</h3>
        {contradictions.isLoading ? (
          <p>Scanning for bias...</p>
        ) : (
          <ul className="space-y-1">
            {contradictions.data?.length
              ? contradictions.data.map((c: any) => (
                  <li key={c.id} className="bg-red-50 p-2 rounded">
                    <span className="font-bold">Issue:</span> {c.issue || c.contradiction || "No details"}
                  </li>
                ))
              : <li className="text-green-600">No bias detected.</li>
            }
          </ul>
        )}
      </div>
    </div>
  );
}