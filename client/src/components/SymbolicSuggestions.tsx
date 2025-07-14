import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

type SymbolicRitual = {
  tier: string;
  color: string;
  symbol: string;
  ritual: string;
};

export default function SymbolicSuggestions({ griefTier }: { griefTier: string }) {
  const [suggestions, setSuggestions] = useState<SymbolicRitual | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const response = await apiRequest("GET", `/api/rituals?tier=${griefTier}`);
        setSuggestions(response);
      } catch (err) {
        console.error("Symbolic ritual fetch failed:", err);
      }
    }
    fetchSuggestions();
  }, [griefTier]);

  if (!suggestions) return <p className="text-sm text-gray-500">Loading rituals...</p>;

  return (
    <div className="p-4 rounded-md border border-yellow-300 bg-yellow-50">
      <h3 className="font-semibold text-yellow-700">Symbolic Suggestion for Tier: {griefTier}</h3>
      <p><strong>Color:</strong> {suggestions.color}</p>
      <p><strong>Symbol:</strong> {suggestions.symbol}</p>
      <p><strong>Ritual:</strong> {suggestions.ritual}</p>
    </div>
  );
}
