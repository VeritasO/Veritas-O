import React from "react";
import { useContradictions } from "@/hooks/useContradictions";

export default function MirraAuditBadge() {
  const { contradictions, isLoading } = useContradictions();
  const count = contradictions?.length ?? 0;

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">MIRRA</span>
      <span className="inline-block bg-red-600 text-white text-xs rounded-full px-2 py-1" title="Contradictions">
        {isLoading ? "…" : count}
      </span>
    </div>
  );
}