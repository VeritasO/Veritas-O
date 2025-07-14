import { db } from "../db";
import { reflections } from "../schema";
import { eq } from "drizzle-orm";

export async function scanContradictions() {
  const all = await db.select().from(reflections);

  const contradictions = all.filter((entry) => {
    // Example: status is 'pending' but reviewedBy is not null
    return entry.status === "pending" && entry.reviewedBy !== null;
  });

  return contradictions;
}
