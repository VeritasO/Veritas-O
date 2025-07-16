import React, { useState } from "react";
import DoctrineHistory from "../pages/doctrine-history";

type Doctrine = {
  id: number;
  version: string;
  title: string;
  principle: string;
  date: string;
};

export default function BooksLibrary() {
  const [showDoctrine, setShowDoctrine] = useState(false);

  return (
    <div>
      <section>
        <button
          className="font-bold text-indigo-700 mb-4"
          onClick={() => setShowDoctrine((v) => !v)}
        >
          {showDoctrine ? "Hide" : "Show"} Foundational Principles
        </button>
        {showDoctrine && (
          <div className="mb-8">
            <DoctrineHistory />
          </div>
        )}
      </section>
      {/* ...existing Books Library rendering... */}
    </div>
  );
}