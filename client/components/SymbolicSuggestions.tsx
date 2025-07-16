import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const ritualMap: Record<string, string[]> = {
  "low": ["📿 Light a candle for clarity", "📘 Read Book I: Meaningful Thought"],
  "moderate": ["🕯 Write a grief letter", "🌿 Visit a natural space"],
  "high": ["🔥 Conduct a symbolic burn ritual", "📖 Share lived truth in LYRA panel"]
};

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