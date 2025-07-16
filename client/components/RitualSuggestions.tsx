import { useState } from "react";
import { useSymbolicSuggestions } from "@/hooks/useSymbolicSuggestions";
import { GriefTierBadge } from "./GriefTierBadge";

export default function RitualSuggestions() {
  const [tier, setTier] = useState("mild");
  const { data, isLoading } = useSymbolicSuggestions(tier);

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <h3 className="font-semibold text-lg">Ritual Suggestions <GriefTierBadge tier={tier} /></h3>
      <select value={tier} onChange={e => setTier(e.target.value)} className="border rounded px-2 py-1">
        <option value="mild">Mild</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="severe">Severe</option>
      </select>
      {isLoading ? <p>Loading...</p> : (
        <ul className="space-y-1">
          {data?.rituals?.map((r: string) => (
            <li key={r} className="bg-yellow-50 p-2 rounded">{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}