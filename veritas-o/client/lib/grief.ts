// /lib/grief.ts

// Grief Tiers by Time (Minutes mod 5 for CVT simulation)
export type GriefTier = 1 | 2 | 3 | 4 | 5;

export function getCurrentGriefTier(): GriefTier {
  const minute = new Date().getMinutes();
  const mod = minute % 5;

  switch (mod) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 4;
    case 4:
    default:
      return 5;
  }
}

// Symbolic Descriptions
export const griefTierDescriptions: Record<GriefTier, string> = {
  1: "Initial wave of grief — destabilization and sensing",
  2: "Depth of mourning — echo chambers of memory",
  3: "Insight emerges — naming and witnessing",
  4: "Transmutation — active reconstruction and voice",
  5: "Liberation — grief as wisdom and myth",
};

// Color mappings (used in components like CVTClock)
export const griefTierColors: Record<GriefTier, string> = {
  1: "#ff69b4", // Pink
  2: "#9370db", // Purple
  3: "#fada5e", // Yellow
  4: "#ffa500", // Orange
  5: "#00ffff", // Cyan
};
