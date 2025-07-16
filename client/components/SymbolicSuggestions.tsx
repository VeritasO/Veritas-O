import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useSymbolicSuggestions } from "@/hooks/useSymbolicSuggestions";

const ritualMap: Record<string, string[]> = {
  "low": ["📿 Light a candle for clarity", "📘 Read Book I: Meaningful Thought"],
  "moderate": ["🕯 Write a grief letter", "🌿 Visit a natural space"],
  "high": ["🔥 Conduct a symbolic burn ritual", "📖 Share lived truth in LYRA panel"]
};

export default function SymbolicSuggestions() {
  const { data: rituals, isLoading } = useSymbolicSuggestions();

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">🕯️ Symbolic Suggestions (VESTA)</h2>
      {isLoading ? (
        <p>Loading rituals...</p>
      ) : (
        <ul className="space-y-2">
          {rituals?.map((r) => (
            <li key={r.tier} className="border p-3 rounded">
              <span className="font-bold capitalize">{r.tier} grief:</span> {r.prompt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SymbolicSuggestions({ griefTier }: { griefTier: "low" | "moderate" | "high" }) {
  const [rituals, setRituals] = useState<string[]>([]);

  useEffect(() => {
    setRituals(ritualMap[griefTier] || []);
  }, [griefTier]);

  return (
    <Card className="bg-yellow-50 border-l-4 border-yellow-400 shadow-md">
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-600" />
          <h2 className="text-lg font-bold">Ritual Prompts (VESTA)</h2>
        </div>
        <ul className="list-disc list-inside text-sm text-yellow-900">
          {rituals.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}