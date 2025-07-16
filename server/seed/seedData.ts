import { db } from "../db";
import { sql } from "drizzle-orm";

export async function seedData() {
  await db.execute(sql`DELETE FROM reflection_audits`);

  await db.execute(sql`
    INSERT INTO reflection_audits (reflection_id, status_before, status_after, changed_by, reason, timestamp)
    VALUES
    (1, 'pending', 'reviewed', 'JUNO', 'Initial triage complete', NOW()),
    (1, 'reviewed', 'resolved', 'LYRA', 'Narrative reconciliation observed', NOW())
  `);

  console.log("✅ Reflection audit logs seeded");
}
