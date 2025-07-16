export const RITUAL_SYMBOLS = {
  mirror: "🪞",
  flame: "🔥",
  circle: "⭕",
  spiral: "🌀",
  // ...add more as needed
};

export const THEME_MAPPINGS = {
  justice: "#6B7280",
  restoration: "#10B981",
  grief: "#EF4444",
  transformation: "#8B5CF6",
  renewal: "#34D399",
  // ...add more as needed
};

export function getSymbolForRitual(ritual: string): string {
  return RITUAL_SYMBOLS[ritual] || "❓";
}