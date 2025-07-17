import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export function DriftBadge({ driftScore }) {
  let color = "bg-green-200 text-green-800";
  if (driftScore > 0.45) color = "bg-yellow-200 text-yellow-800";
  if (driftScore > 0.7) color = "bg-red-200 text-red-800";
  return (
    <span
      className={`rounded px-2 py-1 text-xs font-bold ${color}`}
      title={`Semantic drift score: ${driftScore.toFixed(2)}`}
    >
      Drift: {driftScore.toFixed(2)}
    </span>
  );
}

function BookTaskToggle({ book }) {
  const { mutate: createTask } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Restore: ${book.title}`,
          griefStage: book.griefStage,
          symbolicClass: book.symbolicClass,
        }),
      });
      return res.json();
    },
  });

  return <button onClick={createTask}>Generate Restoration Task</button>;
}

function VerifyCanonButton({ bookId, onVerified }) {
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/books/verify/${bookId}`, { method: "POST" });
      return res.json();
    },
    onSuccess: (data) => {
      onVerified(data);
      // Show toast or badge
    },
  });

  return (
    <button onClick={() => mutate()} disabled={isLoading}>
      Verify Canon
    </button>
  );
}

function RitualBindingModal({ book, onClose }) {
  const [ritual, setRitual] = useState("");
  const { mutate } = useMutation({
    mutationFn: async () => {
      await fetch("/api/customRituals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          class: book.symbolicClass,
          ritualId: ritual,
          userId: "currentUserId", // replace with actual user
        }),
      });
    },
    onSuccess: onClose,
  });

  return (
    <div className="modal">
      <select value={ritual} onChange={(e) => setRitual(e.target.value)}>
        {/* Ritual options */}
      </select>
      <button onClick={() => mutate()}>Bind Ritual</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

function EarlyTaskPrompt({ book }) {
  const shouldPrompt = book.tier >= 2 || book.driftScore > 0.45;
  if (!shouldPrompt) return null;

  return (
    <div className="p-2 bg-indigo-50 rounded mb-2">
      <span>This book suggests action.</span>
      <BookTaskToggle book={book} />
    </div>
  );
}

// Usage in BookCard:
// <BookCard ...>
//   <h2>
//     {book.title} <DriftBadge driftScore={book.driftScore} />
//   </h2>
// </BookCard>

// Usage in BookView:
// <EarlyTaskPrompt book={book} />