export async function booksModelExists() {
  try {
    await db.select({ id: books.id }).limit(1);
    return true;
  } catch {
    return false;
  }
}