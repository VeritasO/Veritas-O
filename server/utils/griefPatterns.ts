export function evaluateGriefLoop(content: string): boolean {
  const griefWords = ["stuck", "hopeless", "irreversible", "no way out", "lost", "despair"];
  return griefWords.some(word => content.toLowerCase().includes(word));
}

export function suggestRituals(tier: number) {
  if (tier === 1) return ["🌾 Gentle breath ritual"];
  if (tier === 2) return ["🕯️ Letter of recognition"];
  if (tier === 3) return ["🌑 Ritual silence"];
  return [];
}