// Build a form to submit a new reflection with type, content, priority, and related areas
import React, { useState } from "react";
import { useReflections } from "@/hooks/useReflections";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type ReflectionSubmissionProps = {
  agentId: string;
};

const ReflectionSubmission: React.FC<ReflectionSubmissionProps> = ({ agentId }) => {
  const { createReflection, refresh } = useReflections();
  const [content, setContent] = useState("");
  const [griefTier, setGriefTier] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    await createReflection({ agentId, content, griefTier });
    setContent("");
    setGriefTier(1);
    setSubmitting(false);
    refresh();
  };

  return (
    <Card className="p-4 shadow-md bg-white">
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">Submit Reflection</h2>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is surfacing now?"
          className="mb-3"
        />
        <label className="block text-sm font-medium mb-1">Grief Tier</label>
        <select
          value={griefTier}
          onChange={(e) => setGriefTier(Number(e.target.value))}
          className="mb-3 p-2 border rounded"
        >
          {[1, 2, 3, 4, 5].map(tier => (
            <option key={tier} value={tier}>Tier {tier}</option>
          ))}
        </select>
        <Button onClick={handleSubmit} disabled={submitting || !content.trim()}>
          {submitting ? "Submitting..." : "Submit Reflection"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReflectionSubmission;
