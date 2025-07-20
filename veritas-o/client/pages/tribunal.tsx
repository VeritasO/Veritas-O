import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TribunalSimulationPanel } from "@/components/TribunalSimulationPanel";
import { useContradictions } from "@/hooks/useContradictions";
import { sendTribunalRuling } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contradiction } from "@/hooks/useContradictions";

export default function TribunalPage() {
  const [selectedContradiction, setSelectedContradiction] = useState<Contradiction | null>(null);
  const [rulingText, setRulingText] = useState("");
  
  const { unresolvedContradictions, isLoading: contradictionsLoading } = useContradictions();
  const queryClient = useQueryClient();

  const { mutate: submitRuling, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!selectedContradiction) throw new Error("No contradiction selected");
      return await sendTribunalRuling({
        contradictionId: selectedContradiction.id!,
        ruling: rulingText.trim(),
      });
    },
    onSuccess: () => {
      console.log("✅ Ruling submitted successfully");
      setSelectedContradiction(null);
      setRulingText("");
      queryClient.invalidateQueries({ queryKey: ["contradictions"] });
    },
    onError: (error) => {
      console.error("❌ Submission failed:", error);
    },
  });

  const getSeverityColor = (severity: Contradiction['severity']) => {
    switch (severity) {
      case 'minor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'moderate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'major': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ⚖️ Tribunal Interface
        </h1>
      </div>

      {/* Main Tribunal Simulation Panel */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardContent className="p-6">
          <TribunalSimulationPanel />
        </CardContent>
      </Card>

      <div className="h-px bg-gray-700 my-6" />

      {/* Simple Ruling Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Contradictions */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300">📜 Outstanding Contradictions</CardTitle>
          </CardHeader>
          <CardContent>
            {contradictionsLoading && (
              <div className="text-center py-4 text-gray-400">Loading contradictions...</div>
            )}
            
            {!contradictionsLoading && unresolvedContradictions.length > 0 ? (
              <div className="space-y-2">
                {unresolvedContradictions.map((contradiction) => (
                  <div
                    key={contradiction.id}
                    className={`border p-3 rounded cursor-pointer transition-all ${
                      selectedContradiction?.id === contradiction.id 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-gray-600 hover:border-purple-400/50"
                    }`}
                    onClick={() => setSelectedContradiction(contradiction)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Badge className="bg-gray-700 text-gray-200 text-xs">
                        {contradiction.type}
                      </Badge>
                      <Badge className={`${getSeverityColor(contradiction.severity)} text-xs`}>
                        {contradiction.severity || 'moderate'}
                      </Badge>
                    </div>
                    <p className="text-sm text-white font-medium">{contradiction.source}</p>
                    <p className="text-sm text-gray-300 mt-1">
                      {contradiction.content.length > 100 
                        ? `${contradiction.content.slice(0, 100)}...` 
                        : contradiction.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{contradiction.type}</p>
                  </div>
                ))}
              </div>
            ) : !contradictionsLoading ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">✅</div>
                <p>No outstanding contradictions found.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Tribunal Ruling Panel */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300">⚖️ Tribunal Ruling Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Selected Contradiction ID"
              value={selectedContradiction?.id || ""}
              disabled
              className="bg-gray-800/50 text-gray-400"
            />
            <Textarea
              placeholder="Enter your ruling..."
              value={rulingText}
              onChange={(e) => setRulingText(e.target.value)}
              className="min-h-32"
            />
            <Button 
              onClick={() => submitRuling()} 
              disabled={isSubmitting || !rulingText.trim() || !selectedContradiction}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Ruling"}
            </Button>
            
            {selectedContradiction && (
              <div className="p-3 bg-gray-800/50 rounded border border-gray-600/50">
                <div className="text-sm font-medium text-purple-300 mb-1">Selected:</div>
                <div className="text-sm text-gray-300">{selectedContradiction.content}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
