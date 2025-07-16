import { AlertTriangle } from "lucide-react";
import { useContradictions } from "@/hooks/useContradictions";


// Removed duplicate ContradictionMonitor implementation

  export default function ContradictionMonitor() {
  const { data: contradictions, isLoading } = useContradictions();

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">🧩 MIRRA Contradiction Monitor</h2>
      {isLoading ? (
        <p>Scanning reflections for contradictions...</p>
      ) : contradictions?.length === 0 ? (
        <p className="text-green-600">✅ No contradictions found</p>
      ) : (
        <ul className="space-y-2">
          {contradictions.map((c) => (
            <li key={c.id} className="border p-3 rounded bg-red-50">
              <strong>Reflection #{c.reflectionId}:</strong> {c.issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}