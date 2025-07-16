export function GriefTierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    mild: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
    severe: "bg-red-700"
  };
  return (
    <span className={`px-2 py-1 rounded text-white text-xs ${colors[tier] || "bg-gray-400"}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}