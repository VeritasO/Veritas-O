import { useEffect, useState } from "react";
import { evaluateGriefLoop } from "../utils/griefPatterns";
import { detectContradiction } from "../utils/contradictionTriggers";

export function useCVTClock() {
  const [cvtTime, setCVTTime] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCVT() {
      try {
        const res = await fetch("/api/cvt-time");
        const data = await res.json();
        if (isMounted && data?.cvtTime) {
          setCVTTime(data.cvtTime);
        }
      } catch {
        if (isMounted) setCVTTime("Unavailable");
      }
    }

    fetchCVT();
    const interval = setInterval(fetchCVT, 10000); // refresh every 10s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return cvtTime;
}

export function evaluateGriefLoop(content: string): boolean {
  const griefWords = ["stuck", "hopeless", "irreversible", "no way out", "lost", "despair"];
  return griefWords.some(word => content.toLowerCase().includes(word));
}

export function suggestRituals(tier: number) {
  // Example: return rituals based on tier
  if (tier === 1) return ["🌾 Gentle breath ritual"];
  if (tier === 2) return ["🕯️ Letter of recognition"];
  if (tier === 3) return ["🌑 Ritual silence"];
  return [];
}

export function detectContradiction(content: string): boolean {
  const contradictionPatterns = [
    /\bbut\b/i, /\bhowever\b/i, /\bcontradicts\b/i, /\bconflict\b/i, /\bparadox\b/i,
  ];
  return contradictionPatterns.some(pattern => pattern.test(content));
}

router.post('/', async (req, res) => {
  const { content, agentId } = req.body;
  const grief = evaluateGriefLoop(content);
  const contradiction = detectContradiction(content);

  const inserted = await db.insert(reflections).values({
    content,
    agentId,
    createdAt: new Date(),
    grief,
    contradiction
  }).returning();

  // Optionally trigger ritual or log contradiction
  if (grief) {
    // trigger ritual logic here
  }
  if (contradiction) {
    // log contradiction logic here
  }

  res.json(inserted[0]);
});