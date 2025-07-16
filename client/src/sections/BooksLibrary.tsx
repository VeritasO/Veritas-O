import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";

export default function BooksLibrary({ books }) {
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <Card
          key={book.bookNumber}
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() =>
            setExpandedBookId(expandedBookId === book.bookNumber ? null : book.bookNumber)
          }
        >
          <CardContent>
            <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
            <div className="text-xs text-slate-500 mb-1">{book.subtitle}</div>
            <div className="text-xs text-slate-400 mb-1">Pages: {book.pages}</div>
            {expandedBookId === book.bookNumber && (
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {book.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}