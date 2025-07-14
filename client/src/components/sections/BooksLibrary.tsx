import React from "react";
// import { CanonicalBook } from "@shared/schema";

interface BooksLibraryProps {
  books?: any[];
  onInteraction?: (action: string, details?: string) => void;
}

const BooksLibrary: React.FC<BooksLibraryProps> = ({ books = [], onInteraction }) => {
  const handleClick = (bookNumber: number, title: string) => {
    onInteraction?.("view_book", `Book Number ${bookNumber}: ${title}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">📚 Canonical Books (I–XV)</h2>
      {books.length === 0 ? (
        <p className="text-gray-600 italic">No canonical books available in the library.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => handleClick(book.bookNumber, book.title)}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-[1.02] border-t-4"
              style={{ borderColor: book.colorTheme || '#e2e8f0' }}
              title={book.description}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Book {book.bookNumber}: {book.title} – {book.subtitle}
              </h3>
              <p className="text-gray-700 text-sm line-clamp-3">{book.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.tags?.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              {book.symbolicMeaning && (
                <p className="text-xs text-gray-500 mt-2">Symbolic Meaning: {book.symbolicMeaning}</p>
              )}
              {book.ritualAnchor && (
                <p className="text-xs text-gray-500 mt-1">Ritual Anchor: {book.ritualAnchor}</p>
              )}
              <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">Read More</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksLibrary;
