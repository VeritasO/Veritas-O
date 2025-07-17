import { db } from '../db';
import { books } from '../schema/models/books';
import { computeDriftScore } from './computeDriftScore';

export async function updateDriftScoreForBook(bookId: string) {
  const book = await db.select({ title: books.title, version: books.version, summary: books.summary })
    .from(books)
    .where(eq(books.id, bookId))
    .first();
  if (!book) throw new Error('Book not found');

  const driftScore = await computeDriftScore(book);
  await db.update(books).set({ driftScore }).where(eq(books.id, bookId));
}