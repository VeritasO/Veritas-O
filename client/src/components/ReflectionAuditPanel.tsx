import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Reflection, ReflectionStatus } from "@/types";

const statusOptions: ReflectionStatus[] = [
  "pending",
  "approved",
  "rejected",
  "under_review",
];

export default function ReflectionAuditPanel() {
  const [auditLogs, setAuditLogs] = useState<Reflection[]>([]);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await apiRequest("GET", "/api/reflection-audit");
      setAuditLogs(response);
    } catch (err) {
      alert("Failed to load reflection audit logs.");
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: ReflectionStatus) => {
    try {
      await apiRequest("POST", "/api/reflection-audit/update", { id, status: newStatus });
      fetchAuditLogs(); // Refresh UI
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🧾 Reflection Audit Trail</h2>
      {auditLogs.map((log) => (
        <Card key={log.id}>
          <CardContent>
            <div className="text-sm">
              <p><strong>ID:</strong> {log.id}</p>
              <p><strong>Status:</strong> {log.status}</p>
              <select
                value={log.status}
                onChange={(e) => handleStatusUpdate(log.id, e.target.value as ReflectionStatus)}
                className="border rounded px-2 py-1 mt-2"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <p><strong>Reviewed By:</strong> {log.reviewedBy || "–"}</p>
              <p><strong>Timestamp:</strong> {new Date(log.timestamp || log.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
