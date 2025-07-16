import { useContradictions } from "@/hooks/useContradictions";

export default function ContradictionMonitor() {
  const { contradictions, isLoading, refetch } = useContradictions();

  if (isLoading) return <div>Loading contradictions...</div>;
  if (!contradictions || contradictions.length === 0)
    return (
      <div className="text-green-700 bg-green-50 border border-green-200 p-4 rounded">
        No contradictions detected in current session.
      </div>
    );

  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded shadow-sm">
      <h3 className="text-lg font-bold text-red-800 mb-2">
        ⚠ Detected Contradictions
      </h3>
      <ul className="list-disc list-inside text-red-700 text-sm">
        {contradictions.map((c: any, index: number) => (
          <li key={index}>
            <strong>{c.agent}</strong>: {c.description}
          </li>
        ))}
      </ul>
      <button
        onClick={refetch}
        className="mt-4 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}