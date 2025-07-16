import { useEffect, useState } from "react";

export type AuditLog = {
  id: string;
  agent: string;
  timestamp: string; // ISO 8601 format
  category: "reflection" | "contradiction" | "ritual" | "system";
  severity: "info" | "notice" | "warning" | "critical";
  message: string;
  details?: string;
  linkedCaseId?: string;
  resolved?: boolean;
};

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        const res = await fetch("/api/reflection-audit");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setLogs(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchAuditLogs();
  }, []);

  return { logs, loading, error };
}
