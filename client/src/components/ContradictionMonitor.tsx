import React from "react";
import { useContradictions } from "@/hooks/useContradictions";
import { Card } from "@/components/ui/Card";

const severityColor = {
  low: "bg-yellow-100 text-yellow-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

export default function ContradictionMonitor() {
  const { contradictions, isLoading } = useContradictions();

  if (isLoading) return <p>Loading contradictions...</p>;

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">Contradiction Monitor</h2>
      <div className="space-y-3">
        {contradictions.map((c) => (
          <Card key={c.id} className="p-4 flex items-center gap-4">
            <span
              className={`px-2 py-1 rounded ${severityColor[c.severity] || "bg-gray-100 text-gray-800"}`}
              title={c.severity}
            >
              {c.severity.toUpperCase()}
            </span>
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-slate-600">{c.description}</div>
              <div className="text-xs text-slate-400">{c.date}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}