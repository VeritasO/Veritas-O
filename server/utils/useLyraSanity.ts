import { canonicalBooks } from "../schema/models/canonicalBooks";

export async function useLyraSanity(db) {
  const sample = await db.select().from(canonicalBooks).limit(1);
  return typeof sample[0]?.driftScore !== "undefined";
}