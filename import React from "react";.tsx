import React from "react";
export function GriefTierBadge({ tier }: { tier: string }) {
  const colors = { mild: "green", moderate: "yellow", severe: "red" };
  return (
    <span className={`px-2 py-1 rounded text-white bg-${colors[tier] || "gray"}-600`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}