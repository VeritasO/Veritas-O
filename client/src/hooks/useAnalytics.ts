// Fetch system analytics from /api/analytics
import { useQuery } from "react-query";

export function useAnalytics() {
  return useQuery("analytics", async () => {
    const res = await fetch("/api/analytics");
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  });
}
