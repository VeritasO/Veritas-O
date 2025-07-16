import { useState } from "react";
import { useDoctrineHistory } from "@/hooks/useDoctrineHistory";
import { useContradictions } from "@/hooks/useContradictions";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function DoctrineHistory() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCVT, setShowCVT] = useState(false);

  const { data: doctrines = [], isLoading, isError } = useDoctrineHistory();
  const { contradictions } = useContradictions();
  const { logAudit } = useAuditLogs();

  const selectedDoctrine = doctrines.find((d) => d.id === selectedId);

  // Contradiction cross-check
  const hasContradiction = (doctrineId: number) =>
    contradictions?.some((c) => c.doctrineId === doctrineId);

  // Audit trigger on view
  const handleView = (id: number) => {
    setSelectedId(id);
    logAudit?.({ type: "doctrine_view", doctrineId: id, timestamp: new Date().toISOString() });
  };

  if (isLoading) return <p className="text-slate-500">Loading doctrines...</p>;
  if (isError) return <p className="text-red-500">Error loading doctrines.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📜 Doctrine History</h1>
      <Button className="mb-4" onClick={() => setShowCVT((v) => !v)}>
        {showCVT ? "Hide CVT Time" : "Show CVT Time"}
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctrines.map((d) => (
          <Card key={d.id} className={`p-4 ${hasContradiction(d.id) ? "border-red-500 border-2" : ""}`}>
            <div className="text-sm text-slate-600">{d.version} – {d.date}</div>
            <div className="text-lg font-semibold">{d.title}</div>
            {showCVT && d.cvtTime && (
              <div className="text-xs text-indigo-600">CVT: {d.cvtTime}</div>
            )}
            {hasContradiction(d.id) && (
              <div className="text-xs text-red-600 font-bold">Contradiction flagged</div>
            )}
            <Button className="mt-2" onClick={() => handleView(d.id)}>
              View Principle
            </Button>
          </Card>
        ))}
      </div>

      {selectedDoctrine && (
        <DoctrineDetail
          doctrine={selectedDoctrine}
          agent="AEGIS"
        />
      )}
    </div>
  );
}

// Agent Commentary Component
function DoctrineDetail({ doctrine, agent }: { doctrine: any; agent: "AEGIS" | "LYRA" }) {
  // Example: agent commentary logic
  const commentary =
    agent === "AEGIS"
      ? "AEGIS: This principle is foundational for fairness audits."
      : "LYRA: Consider the narrative context for this doctrine.";

  return (
    <div className="bg-slate-100 p-4 rounded-md mt-6">
      <h2 className="text-xl font-bold text-slate-700">{doctrine.title}</h2>
      <p className="text-slate-600 whitespace-pre-wrap mt-2">{doctrine.principle}</p>
      <div className="mt-4 text-sm italic text-indigo-700">{commentary}</div>
    </div>
  );
}