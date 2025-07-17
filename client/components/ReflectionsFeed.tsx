import React from "react";
import { useReflections } from "../hooks/useReflections";
import { useCVTClock } from "@/hooks/useCVTClock";

function flagReflection(reflection: { content: string }) {
  const griefWords = ["stuck", "hopeless", "irreversible", "no way out", "lost", "despair"];
  const contradictionPatterns = [
    /\bbut\b/i, /\bhowever\b/i, /\bcontradicts\b/i, /\bconflict\b/i, /\bparadox\b/i,
  ];
  const grief = griefWords.some(word => reflection.content.toLowerCase().includes(word));
  const contradiction = contradictionPatterns.some(pattern => pattern.test(reflection.content));
  return { grief, contradiction };
}

export default function ReflectionsFeed() {
  const { data: reflections = [], isLoading } = useReflections({ refetchInterval: 5000 });
  const cvtTime = useCVTClock();

  if (isLoading) return <div className="text-slate-500">Loading reflections...</div>;

  return (
    <section className="bg-slate-50 p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Reflections Feed</h2>
        <span className="text-xs text-indigo-600">CVT: {cvtTime}</span>
      </div>
      <ul className="space-y-3">
        {reflections.map(ref => {
          const flags = flagReflection(ref);
          return (
            <li
              key={ref.id}
              className={`p-3 rounded border ${
                flags.grief
                  ? "border-yellow-500 bg-yellow-50"
                  : flags.contradiction
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-sm text-slate-600">{ref.timestamp}</div>
              <div className="font-medium">{ref.content}</div>
              {flags.grief && (
                <span className="text-yellow-700 text-xs font-bold ml-2">Grief Event</span>
              )}
              {flags.contradiction && (
                <span className="text-red-700 text-xs font-bold ml-2">Contradiction</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}