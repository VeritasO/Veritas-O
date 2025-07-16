// /client/src/lib/useAgentInteraction.ts
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

export interface Interaction {
  id: number;
  agent: string;
  user: string;
  type: "message" | "ritual" | "narrative" | "system";
  content: string;
  timestamp: string;
}

export function useAgentInteraction(userId: string, agentName: string) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch interactions for this user-agent pair
  const fetchInteractions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Filter server-side by user and agent if supported, else fetch all and filter client-side
      const allInteractions: Interaction[] = await apiRequest("GET", "/api/interactions");
      const filtered = allInteractions.filter(
        (i) => i.user === userId && i.agent === agentName
      );
      setInteractions(filtered);
    } catch (err: any) {
      setError(err.message || "Failed to fetch interactions");
    } finally {
      setLoading(false);
    }
  }, [userId, agentName]);

  // Send a new interaction message
  const sendInteraction = useCallback(
    async (type: Interaction["type"], content: string, griefTier?: number) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          user: userId,
          agent: agentName,
          type,
          content,
          ...(griefTier !== undefined ? { griefTier } : {}),
        };
        const created = await apiRequest("POST", "/api/interactions", payload);
        setInteractions((prev) => [...prev, created]);
        return created;
      } catch (err: any) {
        setError(err.message || "Failed to send interaction");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, agentName]
  );

  // Refresh on mount or user-agent change
  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  return {
    interactions,
    loading,
    error,
    fetchInteractions,
    sendInteraction,
  };
}
