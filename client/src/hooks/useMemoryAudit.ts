import { useMemo } from "react";

export function useMemoryAudit(reflections: Array<{ createdAt: string; agentId: string; content: string }>) {
  return useMemo(() => {
    // Example: Find gaps > 1 day between reflections
    const sorted = [...reflections].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].createdAt).getTime();
      const curr = new Date(sorted[i].createdAt).getTime();
      const diff = curr - prev;
      if (diff > 86400000) { // 1 day in ms
        gaps.push({ from: sorted[i - 1], to: sorted[i], gapMs: diff });
      }
    }
    return { gaps, count: reflections.length };
  }, [reflections]);
}