import cron from "node-cron";
import { checkLastDriftRecalculation } from "../services/tempusMonitor";
import { sendSlackAlert, sendEmailAlert } from "../utils/notify";
import { useDriftStatus } from "@/hooks/useDriftStatus";

cron.schedule("0 * * * *", async () => {
  // every hour
  const status = await checkLastDriftRecalculation();
  if (status.over24h) {
    await sendSlackAlert(`Drift recalculation overdue! Last run: ${status.lastRun}`);
    await sendEmailAlert("admin@yourdomain.com", "Drift recalculation overdue", `Last run: ${status.lastRun}`);
  }
});

export function DriftStatusBanner() {
  const { data } = useDriftStatus();
  if (!data?.over24h) return null;
  return (
    <div className="bg-red-100 text-red-800 p-2 rounded mb-2 font-bold">
      ⚠️ Drift recalculation overdue! Last run: {data.lastRun}
    </div>
  );
}