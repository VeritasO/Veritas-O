import React, { useState } from "react";
import { useSubmitReflection } from "@/hooks/useReflections";
import ReactMarkdown from "react-markdown";
import { reflectionSchema } from "../lib/validators";

export default function ReflectionSubmission() {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const submitReflection = useSubmitReflection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) return;
    try {
      const parse = reflectionSchema.safeParse({ content });
      if (!parse.success) {
        return setError("Invalid reflection content.");
      }
      await submitReflection.mutateAsync({ content });
      setContent("");
    } catch (err) {
      setError("Failed to submit reflection.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        name="reflection"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your reflection..."
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={submitReflection.isLoading}>
        {submitReflection.isLoading ? "Submitting..." : "Submit"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      <ReactMarkdown>{content}</ReactMarkdown>
    </form>
  );
}