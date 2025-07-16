import { useState } from "react";
import { useSubmitReflection } from "@/hooks/useReflections";

export default function ReflectionSubmission() {
  const [content, setContent] = useState("");
  const submitReflection = useSubmitReflection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    submitReflection.mutate({ content });
    setContent("");
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
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}