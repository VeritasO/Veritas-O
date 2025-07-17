import { db } from "../db";

export async function checkNightlyRecalculation() {
  const lastRun = await db.select({ timestamp: "timestamp" }).from("drift_recalculation_log").orderBy("timestamp", "desc").limit(1);
  const now = Date.now();
  const last = new Date(lastRun[0]?.timestamp || 0).getTime();
  const hoursSince = (now - last) / (1000 * 60 * 60);
  if (hoursSince > 24) {
    console.warn("TEMPUS: Nightly drift recalculation has not run in the last 24 hours.");
    return false;
  }
  return true;
}