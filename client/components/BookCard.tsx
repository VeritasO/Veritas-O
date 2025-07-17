export function BookCard({ book }) {
  return (
    <div className="rounded-xl border p-4 shadow-md space-y-2">
      <h2 className="text-xl font-bold">{book.title}</h2>
      <p className="text-sm text-gray-500">v{book.version}</p>
      <p className="text-base">{book.summary}</p>
    </div>
  );
}
