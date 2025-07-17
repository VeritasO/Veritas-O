import { useState, useEffect } from "react";

export interface Book {
  id: string;
  title: string;
  version: string;
  summary: string;
  driftScore: number;
  tier: number;
  // other props
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error(`Error fetching books: ${res.statusText}`);
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return { books, loading, error };
}