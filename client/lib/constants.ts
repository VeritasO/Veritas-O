export enum AgentStatus {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}

export const CVT_TIME_RANGES = {
  min: 0,
  max: 86400, // seconds in a day
};

export const AGENT_COLOR_PALETTE = [
  "#6B7280", // Gray
  "#10B981", // Green
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#34D399", // Emerald
  // ...add more as needed
];