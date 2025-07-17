export async function checkLastDriftRecalculation() {
  const lastRun = await db.query.auditLogs.findFirst({
    where: eq(auditLogs.event, "drift_recalculation"),
    orderBy: desc(auditLogs.timestamp),
  });

  const now = Date.now();
  const timeSince = now - new Date(lastRun?.timestamp || 0).getTime();
  const over24h = timeSince > 1000 * 60 * 60 * 24;

  return { over24h, lastRun: lastRun?.timestamp };
}