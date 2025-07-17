import cron from 'node-cron';
import { db } from '../db';
import { books } from '../schema/models/books';
import { computeDriftScore } from '../utils/computeDriftScore';

cron.schedule('0 2 * * *', async () => {  // runs at 2 AM daily
  console.log('Starting nightly drift recalculation...');
  const allBooks = await db.select().from(books);

  for (const book of allBooks) {
    try {
      const driftScore = await computeDriftScore(book);
      await db.update(books).set({ driftScore }).where(books.id.eq(book.id));
      console.log(`Updated driftScore for book ${book.id} to ${driftScore}`);
      await checkAndNotifyDrift({ ...book, driftScore });
    } catch (e) {
      console.error(`Failed to update drift for book ${book.id}:`, e);
    }
  }
  console.log('Nightly drift recalculation complete.');
});

// --- Drift Threshold Alerting ---
const DRIFT_ALERT_THRESHOLD = 0.3;

async function checkAndNotifyDrift(book) {
  if (book.driftScore >= DRIFT_ALERT_THRESHOLD) {
    // Push notification to UI message center (implement as needed)
    // sendSystemNotification(`Semantic drift alert for book "${book.title}" (drift: ${book.driftScore.toFixed(2)})`);

    // Optionally, send email to admins (implement as needed)
    // await sendEmailToAdmins(`Book ${book.title} exceeds semantic drift threshold: ${book.driftScore}`);

    // Log event
    await db.insert('alerts').values({
      bookId: book.id,
      alertType: 'DriftThresholdExceeded',
      message: `Drift score ${book.driftScore} exceeds threshold`,
      timestamp: new Date(),
    });
  }
}