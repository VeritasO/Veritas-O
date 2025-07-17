import { db } from "../db";
import { books } from "../schema/models/books";
import { computeDriftScore } from "../utils/computeDriftScore";

async function recomputeAllDriftScores() {
  const allBooks = await db.select().from(books);
  for (const book of allBooks) {
    try {
      const driftScore = await computeDriftScore({
        title: book.title,
        version: book.version,
        summary: book.summary,
      });
      await db
        .update(books)
        .set({ driftScore })
        .where(books.id.eq(book.id));
      console.log(`Updated driftScore for "${book.title}": ${driftScore.toFixed(3)}`);
    } catch (err) {
      console.error(`Error updating "${book.title}":`, err);
    }
  }
  console.log("Drift score recomputation complete.");
}

recomputeAllDriftScores().then(() => process.exit());