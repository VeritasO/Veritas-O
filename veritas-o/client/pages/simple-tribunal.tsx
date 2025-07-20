import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useContradictions } from "@/hooks/useContradictions";
import { sendTribunalRuling } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contradiction } from "@/hooks/useContradictions";

export default function SimpleTribunalPage() {
  const [selectedContradiction, setSelectedContradiction] = useState<Contradiction | null>(null);
  const [rulingText, setRulingText] = useState("");
  
  const { unresolvedContradictions, isLoading: contradictionsLoading } = useContradictions();
  const queryClient = useQueryClient();

  const { mutate: submitRuling, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: { contradictionId: string; ruling: string }) => {
      return await sendTribunalRuling(data);
    },
    onSuccess: () => {
      console.log("✅ Tribunal ruling submitted successfully");
      setSelectedContradiction(null);
      setRulingText("");
      // Refresh contradictions to see the resolved status
      queryClient.invalidateQueries({ queryKey: ["contradictions"] });
    },
    onError: (error) => {
      console.error("❌ Failed to submit tribunal ruling:", error);
    },
  });

  const handleContradictionSelect = (contradiction: Contradiction) => {
    setSelectedContradiction(contradiction);
  };

  const handleSubmitRuling = () => {
    if (!selectedContradiction || !rulingText.trim()) return;
    
    submitRuling({
      contradictionId: selectedContradiction.id!,
      ruling: rulingText.trim(),
    });
  };

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
          ⚖️ Tribunal System
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Contradictions */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              📜 Outstanding Contradictions
              {contradictionsLoading && <span className="text-sm text-gray-400">(Loading...)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unresolvedContradictions.length > 0 ? (
              <div className="space-y-3">
                {unresolvedContradictions.map((contradiction) => (
                  <div
                    key={contradiction.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedContradiction?.id === contradiction.id
                        ? "border-purple-400 bg-purple-600/20"
                        : "border-gray-600/50 bg-gray-800/30 hover:border-purple-500/50 hover:bg-gray-700/50"
                    }`}
                    onClick={() => handleContradictionSelect(contradiction)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className="bg-gray-700 text-gray-200 text-xs">
                        {contradiction.type}
                      </Badge>
                      <Badge className={`${getSeverityColor(contradiction.severity)} text-xs`}>
                        {contradiction.severity || 'moderate'}
                      </Badge>
                    </div>
                    
                    <div className="font-medium text-sm text-white mb-1">
                      {contradiction.source}
                    </div>
                    
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {contradiction.content}
                    </p>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(contradiction.timestamp).toLocaleDateString()} • ID: {contradiction.id?.slice(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-medium">No Outstanding Contradictions</p>
                <p className="text-sm">All system conflicts have been resolved.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tribunal Ruling Panel */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              ⚖️ Tribunal Ruling Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedContradiction ? (
              <>
                {/* Selected Contradiction Info */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                  <div className="text-sm font-medium text-purple-300 mb-2">Selected Contradiction:</div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">Source:</span> 
                      <span className="text-white ml-2">{selectedContradiction.source}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Type:</span> 
                      <span className="text-white ml-2">{selectedContradiction.type}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Content:</span> 
                      <span className="text-white ml-2">{selectedContradiction.content}</span>
                    </div>
                  </div>
                </div>

                {/* Contradiction ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contradiction ID
                  </label>
                  <Input
                    placeholder="Selected Contradiction ID"
                    value={selectedContradiction.id || ""}
                    disabled
                    className="bg-gray-800/70 text-gray-400"
                  />
                </div>

                {/* Ruling Text Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tribunal Ruling
                  </label>
                  <Textarea
                    placeholder="Enter your ruling and resolution strategy..."
                    value={rulingText}
                    onChange={(e) => setRulingText(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitRuling}
                    disabled={isSubmitting || !rulingText.trim()}
                    className="bg-purple-600 hover:bg-purple-700 flex-1"
                  >
                    {isSubmitting ? "Submitting Ruling..." : "Submit Tribunal Ruling"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedContradiction(null);
                      setRulingText("");
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Clear
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">⚖️</div>
                <p className="text-lg font-medium mb-2">Select a Contradiction</p>
                <p className="text-sm">Choose a contradiction from the left panel to begin ruling.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {isSubmitting && (
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-300">
              <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full"></div>
              <span>Submitting tribunal ruling to the collective...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
