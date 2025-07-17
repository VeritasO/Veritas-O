// Express route scaffold for books
import express from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { books } from '../schema/models/books';
import canonicalBooks from '../data/canonical_books.json';
import { computeDriftScore } from '../utils/computeDriftScore';
import { updateDriftScoreForBook } from '../utils/updateDriftScoreForBook';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await db.select().from(canonicalBooks);
    // Compute driftScore for each book (async)
    const booksWithDrift = await Promise.all(
      books.map(async (book) => ({
        ...book,
        driftScore: book.driftScore ?? await computeDriftScore(book.title, book.summary, book.version),
      }))
    );
    res.json(booksWithDrift);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch canonical books' });
  }
});

router.get('/verify', async (req, res) => {
  const allBooks = await db.select().from(books);
  const mismatches = allBooks.map(book => {
    const canonical = canonicalBooks.find(c => c.title === book.title);
    if (!canonical) return { title: book.title, status: 'missing' };
    const drift = canonical.version !== book.version;
    return drift ? { title: book.title, status: 'version drift' } : null;
  }).filter(Boolean);
  res.json({ mismatches });
});

router.get('/:id', async (req, res) => {
  try {
    const book = await db.select().from(canonicalBooks).where(eq(canonicalBooks.id, req.params.id)).first();
    const ritualSuggestions = suggestRituals(book.symbolic_class);
    res.json({ ...book, ritualSuggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book or rituals' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    // ...your book update logic here...

    // After update, compute drift
    await updateDriftScoreForBook(bookId);

    res.status(200).json({ message: 'Book updated and drift score computed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/flag-drift/:id', async (req, res) => {
  const { userId, comment } = req.body;
  const bookId = req.params.id;

  await db.insert('drift_flags').values({
    bookId,
    userId,
    comment,
    timestamp: new Date(),
  });

  res.status(201).json({ message: 'Drift flag submitted successfully' });
});

router.get('/sanity', async (req, res) => {
  const result = await db.select().from(books);
  const missing = result.filter((b) => b.drift_score === null);
  res.json({ driftAvailable: missing.length === 0, countMissing: missing.length });
});

// Utility
function suggestRituals(symbolicClass) {
  // Return array of ritual candidates based on symbolic class
  return ['🌾 Gentle breath', '🕯️ Letter of recognition'];
}

export default router;

// Utility (server/utils/verifyBookAgainstIndex.ts)
export function verifyBookAgainstIndex(book) {
  // Implement your canonical value check logic here
  return true; // or false
}
