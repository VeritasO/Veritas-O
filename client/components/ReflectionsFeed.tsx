import React from "react";
import { useReflections } from "@/hooks/useReflections";
import { formatCVT } from "@/lib/cvt";

export default function ReflectionsFeed() {
  const { data, isLoading } = useReflections();

  if (isLoading) return <div className="text-sm text-gray-500">Loading reflections...</div>;

  if (!data || data.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-yellow-100 text-yellow-800 shadow-md">
        No reflections yet. Invite LYRA with a story.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 max-h-[600px] overflow-y-auto">
      {data.map((r) => {
        const isGrief = /(hopeless|irreversible|lost|stuck|no way)/i.test(r.content);
        return (
          <div
            key={r.id}
            className={`rounded-xl p-4 shadow transition-all duration-200 border ${
              isGrief
                ? "bg-red-100 border-red-300 text-red-700"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {formatCVT(r.createdAt)} · Agent: {r.agentId || "UNKNOWN"}
            </div>
            <div className="whitespace-pre-wrap text-sm">{r.content}</div>
            {isGrief && (
              <div className="mt-2 text-xs text-red-500 font-semibold animate-pulse">
                ⚠️ Grief loop detected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}