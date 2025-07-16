import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContradictionMonitor({ contradictions }: { contradictions: string[] }) {
  if (!contradictions.length) return null;

  return (
    <Card className="bg-red-50 border-l-4 border-red-500">
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-600" />
          <h2 className="text-lg font-bold">Contradictions Detected (MIRRA)</h2>
        </div>
        <ul className="list-disc list-inside text-sm text-red-900">
          {contradictions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}