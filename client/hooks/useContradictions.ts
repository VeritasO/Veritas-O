import { useEffect, useState } from "react";

export type Contradiction = {
  id: string;
  sourceAgent: string;
  type: "logical" | "narrative" | "temporal" | "symbolic" | "grief";
  message: string;
  detail?: string;
  timestamp: string; // ISO format for CVT integration
  resolved: boolean;
  flaggedBy: "MIRRA" | "SORIN" | "user" | "system";
};

export function useContradictions() {
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContradictions() {
      try {
        const response = await fetch("/api/contradictions");
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
        const data = await response.json();
        setContradictions(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchContradictions();
  }, []);

  return { contradictions, loading, error };
}
