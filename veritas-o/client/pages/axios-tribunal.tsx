import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { API_CONFIG } from "@/lib/constants";

interface Contradiction {
  id: string;
  summary?: string;
  content?: string;
  type: string;
  source?: string;
  severity?: string;
  statement1?: string;
  statement2?: string;
  detectedBy?: string;
  resolved?: boolean;
}

export default function AxiosTribunalPage() {
  const [contradictionId, setContradictionId] = useState("");
  const [rulingText, setRulingText] = useState("");
  const queryClient = useQueryClient();

  const { data: contradictions } = useQuery({
    queryKey: ["contradictions"],
    queryFn: async (): Promise<Contradiction[]> => {
      try {
        const res = await axios.get(`${API_CONFIG.BASE_URL}/api/contradictions`);
        return res.data;
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
      const res = await axios.post(`${API_CONFIG.BASE_URL}/api/tribunal/rulings`, {
        contradictionId,
        ruling: rulingText, // Map to the expected API format
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ruling submitted successfully! ⚖️");
      setContradictionId("");
      setRulingText("");
      // Refresh contradictions to show updated status
      queryClient.invalidateQueries({ queryKey: ["contradictions"] });
    },
    onError: (error) => {
      console.error('Submission error:', error);
      toast.error("Submission failed. Please try again.");
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10'
      case 'high': return 'border-orange-500 bg-orange-500/10'
      case 'moderate': return 'border-yellow-500 bg-yellow-500/10'
      case 'minor': return 'border-blue-500 bg-blue-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ⚖️ Tribunal System
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="space-y-3 mt-6">
            <h2 className="text-xl font-bold text-purple-300">📜 Outstanding Contradictions</h2>
            
            {contradictions && contradictions.length > 0 ? (
              contradictions.map((c: Contradiction) => (
                <div
                  key={c.id}
                  className={`border p-3 rounded-lg cursor-pointer transition-all ${
                    c.id === contradictionId 
                      ? "border-purple-500 bg-purple-500/20" 
                      : `${getSeverityColor(c.severity || 'moderate')} hover:border-purple-400`
                  }`}
                  onClick={() => setContradictionId(c.id)}
                >
                  <p className="text-sm font-medium text-white mb-1">
                    {c.summary || c.content || `${c.statement1} vs ${c.statement2}` || 'Unknown contradiction'}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">{c.type}</span>
                    {c.severity && (
                      <span className={`px-2 py-0.5 rounded ${
                        c.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                        c.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                        c.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {c.severity}
                      </span>
                    )}
                  </div>
                  {c.source && (
                    <p className="text-xs text-purple-300 mt-1">Source: {c.source}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">✅</div>
                <p>No outstanding contradictions found.</p>
                <p className="text-sm">System harmony maintained.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="space-y-4 mt-6">
            <h2 className="text-xl font-bold text-purple-300">⚖️ Tribunal Ruling Panel</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Contradiction ID
              </label>
              <Input
                placeholder="Select a contradiction from the left panel"
                value={contradictionId}
                disabled
                className="bg-gray-800/50 text-gray-300"
              />
            </div>

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

            <Button 
              onClick={() => submitRuling()} 
              disabled={isLoading || !rulingText.trim() || !contradictionId}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Submitting..." : "Submit Ruling"}
            </Button>

            {contradictionId && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                <div className="text-sm font-medium text-purple-300 mb-2">Selected Contradiction:</div>
                <div className="text-sm text-gray-300">
                  {contradictions?.find(c => c.id === contradictionId)?.summary || 
                   contradictions?.find(c => c.id === contradictionId)?.content ||
                   'Loading contradiction details...'}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-purple-300 text-sm p-3 bg-purple-500/10 rounded border border-purple-500/20">
                <div className="animate-spin w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full"></div>
                Processing tribunal ruling through the collective...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
