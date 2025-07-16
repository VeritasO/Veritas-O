import { useEffect, useState } from "react";
import { Reflection } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";

export default function ReflectionAuditPanel() {
  const [auditLogs, setAuditLogs] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuditLogs = async () => {
    try {
      const response = await apiRequest("GET", "/api/reflection-audit");
      setAuditLogs(response);
    } catch (err) {
      setError("Failed to load reflection audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading audit logs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleStatusUpdate = async (id: number, newStatus: string) => {
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
                onChange={(e) => handleStatusUpdate(log.id, e.target.value)}
                className="border rounded px-2 py-1 mt-2"
              >
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
              <p><strong>Priority:</strong> {log.priority}</p>
              <p><strong>Type:</strong> {log.type}</p>
              <p><strong>Reviewed By:</strong> {log.reviewedBy || "–"}</p>
              <p><strong>Timestamp:</strong> {new Date(log.timestamp).toUTCString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
