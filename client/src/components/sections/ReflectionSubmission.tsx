// Build a form to submit a new reflection with type, content, priority, and related areas
import React, { useState } from "react";

const ReflectionSubmission: React.FC<{ onInteraction?: (action: string, details?: string) => void }> = ({ onInteraction }) => {
  const [type, setType] = useState("insight");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [relatedAreas, setRelatedAreas] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/reflections
    onInteraction?.("reflection_submitted", content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Submit Reflection</h2>
      <select value={type} onChange={e => setType(e.target.value)} className="block w-full">
        <option value="insight">Insight</option>
        <option value="harm">Harm</option>
        <option value="grief">Grief</option>
        <option value="vision">Vision</option>
      </select>
      <textarea value={content} onChange={e => setContent(e.target.value)} className="block w-full" placeholder="Your reflection..." />
      <select value={priority} onChange={e => setPriority(e.target.value)} className="block w-full">
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
        <option value="symbolic">Symbolic</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
};

export default ReflectionSubmission;
