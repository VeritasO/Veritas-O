import { Router } from "express";

const router = Router();

// Example ritual suggestions by grief tier
const ritualMap: Record<string, { color: string; symbol: string; ritual: string }> = {
  low: { color: "#A7F3D0", symbol: "🌿", ritual: "Gentle Pause: Take a mindful breath and light a candle." },
  moderate: { color: "#FDE68A", symbol: "🪶", ritual: "Circle Log: Write a letter to your future self." },
  severe: { color: "#FCA5A5", symbol: "🌀", ritual: "Silent Council: Gather in circle and share a moment of silence." },
  "ritual-critical": { color: "#818CF8", symbol: "🕯️", ritual: "Ritual Pause: Initiate a restorative group ritual." },
};

router.get("/", (req, res) => {
  const { tier } = req.query;
  const suggestion = ritualMap[tier as string] || null;
  res.json(suggestion);
});

export default router;
