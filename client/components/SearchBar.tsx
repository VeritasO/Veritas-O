import React, { ChangeEvent } from "react";

type SearchBarProps = {
  query: string;
  onQueryChange: (newQuery: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  query,
  onQueryChange,
  placeholder = "Search doctrines, books, agents...",
}: SearchBarProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onQueryChange(e.target.value);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-veritas-500"
        aria-label="Search"
        autoComplete="off"
      />
    </div>
  );
}
