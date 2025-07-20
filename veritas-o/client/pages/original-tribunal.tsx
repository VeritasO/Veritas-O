import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "@/lib/constants";

interface Contradiction {
  id: string;
  summary?: string;
  content?: string;
  type: string;
  source?: string;
  severity?: string;
}

export default function OriginalTribunalPage() {
  const [contradictionId, setContradictionId] = useState("");
  const [rulingText, setRulingText] = useState("");
  const queryClient = useQueryClient();

  const { data: contradictions } = useQuery({
    queryKey: ["contradictions"],
    queryFn: async (): Promise<Contradiction[]> => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/contradictions`);
        if (!res.ok) throw new Error('Failed to fetch contradictions');
        return await res.json();
      } catch (error) {
        console.error('Error fetching contradictions:', error);
        // Return mock data for development
        return [
          {
            id: '1',
            summary: 'Security vs Efficiency Trade-off',
            content: 'AEGIS requires maximum security protocols while KAIROS demands optimization speed',
            type: 'system-conflict',
            source: 'AEGIS-KAIROS',
            severity: 'high'
          },
          {
            id: '2',
            summary: 'Knowledge Preservation vs Innovation',
            content: 'VESTA advocates for traditional approaches while POLYMNIA pushes creative solutions',
            type: 'doctrinal',
            source: 'VESTA-POLYMNIA',
            severity: 'moderate'
          },
          {
            id: '3',
            summary: 'Resource Allocation Dispute',
            content: 'Multiple agents competing for computational resources during analysis',
            type: 'logical',
            source: 'ORION-TEMPUS',
            severity: 'minor'
          }
        ];
      }
    },
  });

  const { mutate: submitRuling, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/tribunal/rulings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contradictionId,
          ruling: rulingText,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to submit ruling');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      console.log("✅ Ruling submitted successfully");
      setContradictionId("");
      setRulingText("");
      // Refresh contradictions list
      queryClient.invalidateQueries({ queryKey: ["contradictions"] });
    },
    onError: (error) => {
      console.error("❌ Submission failed:", error);
    },
  });

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardContent className="space-y-2 mt-4">
          <h2 className="text-xl font-bold text-purple-300">📜 Outstanding Contradictions</h2>
          {contradictions?.map((c: Contradiction) => (
            <div
              key={c.id}
              className={`border p-3 rounded cursor-pointer transition-all ${
                c.id === contradictionId 
                  ? "border-purple-500 bg-purple-500/20" 
                  : "border-gray-600 hover:border-purple-400 bg-gray-800/30"
              }`}
              onClick={() => setContradictionId(c.id)}
            >
              <p className="text-sm text-white font-medium">
                {c.summary || c.content || 'Unknown contradiction'}
              </p>
              <p className="text-xs text-gray-400 mt-1">{c.type}</p>
              {c.source && (
                <p className="text-xs text-purple-300 mt-1">Source: {c.source}</p>
              )}
              {c.severity && (
                <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                  c.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                  c.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {c.severity}
                </span>
              )}
            </div>
          ))}
          
          {(!contradictions || contradictions.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">✅</div>
              <p>No outstanding contradictions</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardContent className="space-y-4 mt-4">
          <h2 className="text-xl font-bold text-purple-300">⚖️ Tribunal Ruling Panel</h2>
          <Input
            placeholder="Selected Contradiction ID"
            value={contradictionId}
            disabled
            className="bg-gray-800/50 text-gray-300"
          />
          <Textarea
            placeholder="Enter your ruling..."
            value={rulingText}
            onChange={(e) => setRulingText(e.target.value)}
            className="min-h-32"
          />
          <Button 
            onClick={() => submitRuling()} 
            disabled={isLoading || !rulingText.trim() || !contradictionId}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Submitting..." : "Submit Ruling"}
          </Button>
          
          {contradictionId && (
            <div className="p-3 bg-gray-800/50 rounded border border-gray-600/50">
              <div className="text-sm text-purple-300 font-medium">Selected Contradiction:</div>
              <div className="text-sm text-gray-300 mt-1">
                {contradictions?.find(c => c.id === contradictionId)?.summary || 
                 contradictions?.find(c => c.id === contradictionId)?.content || 
                 'No description available'}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-purple-300 text-sm">
              <div className="animate-spin w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full"></div>
              Processing tribunal ruling...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
