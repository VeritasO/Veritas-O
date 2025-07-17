import { useDriftStatus } from "@/hooks/useDriftStatus";
import { useState } from "react";

export function DriftStatusWidget() {
  const { data, refetch, isFetching } = useDriftStatus();
  const [triggering, setTriggering] = useState(false);
  const overdue = data?.over24h;

  async function handleManualTrigger() {
    setTriggering(true);
    try {
      await fetch("/api/tempus/trigger-drift", { method: "POST" });
      await refetch();
      alert("Drift recalculation triggered.");
    } catch (e) {
      alert("Failed to trigger recalculation.");
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">Drift Recalculation Status</span>
        <button
          className="px-3 py-1 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
          onClick={handleManualTrigger}
          disabled={triggering}
        >
          {triggering ? "Triggering..." : "Manual Trigger"}
        </button>
      </div>
      <div className={`p-2 rounded font-bold ${overdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
        {overdue
          ? `⚠️ Drift recalculation overdue! Last run: ${data?.lastRun ?? "unknown"}`
          : `✅ Last drift recalculation: ${data?.lastRun ?? "unknown"}`}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Status auto-refreshes every minute. Manual trigger available for admins.
      </div>
      {isFetching && <div className="text-xs text-gray-400 mt-1">Refreshing...</div>}
    </div>
  );
}