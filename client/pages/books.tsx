import { useCanonicalBooks } from "@/hooks/useCanonicalBooks";
import { BookCard } from "@/components/BookCard";

export default function BooksPage() {
  const { data: books, isLoading } = useCanonicalBooks();

  if (isLoading) return <div>Loading books...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {books?.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}