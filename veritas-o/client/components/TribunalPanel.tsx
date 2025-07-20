import { useState } from "react"
import { useContradictions } from "@/hooks/useContradictions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sendTribunalRuling } from "@/lib/api"
import type { Contradiction } from "@/hooks/useContradictions"

export default function TribunalPanel() {
  const { unresolvedContradictions } = useContradictions()
  const [selectedContradiction, setSelectedContradiction] = useState<Contradiction | null>(null)
  const [ruling, setRuling] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedContradiction || !ruling.trim()) return
    
    setIsSubmitting(true)
    try {
      await sendTribunalRuling({
        contradictionId: selectedContradiction.id!,
        ruling: ruling.trim(),
      })
      
      // Reset form after successful submission
      setRuling("")
      setSelectedContradiction(null)
      
      console.log(`⚖️ Tribunal ruling submitted for contradiction: ${selectedContradiction.id}`)
    } catch (error) {
      console.error('Failed to submit tribunal ruling:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSeverityColor = (severity: Contradiction['severity']) => {
    switch (severity) {
      case 'minor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'moderate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'major': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            ⚠️ Open Contradictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unresolvedContradictions.length > 0 ? (
            <ul className="space-y-3">
              {unresolvedContradictions.map((contradiction) => (
                <li
                  key={contradiction.id}
                  onClick={() => setSelectedContradiction(contradiction)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedContradiction?.id === contradiction.id
                      ? "bg-purple-600/30 border-purple-400 text-white"
                      : "bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-purple-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-gray-700 text-gray-200 text-xs">
                          {contradiction.type}
                        </Badge>
                        <Badge className={`${getSeverityColor(contradiction.severity)} text-xs`}>
                          {contradiction.severity || 'moderate'}
                        </Badge>
                      </div>
                      <div className="font-medium text-sm mb-1">{contradiction.source}</div>
                      <div className="text-sm opacity-90">
                        {contradiction.content.length > 80 
                          ? `${contradiction.content.slice(0, 80)}...` 
                          : contradiction.content
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(contradiction.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    ⚖️
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              ⚠️
              <p>No open contradictions found.</p>
              <p className="text-sm">System harmony maintained.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🔨 Ruling Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedContradiction ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-purple-300">Selected Contradiction:</span>
                  <Badge className={`${getSeverityColor(selectedContradiction.severity)} text-xs`}>
                    {selectedContradiction.severity || 'moderate'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  <strong>Source:</strong> {selectedContradiction.source}
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  <strong>Type:</strong> {selectedContradiction.type}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Description:</strong> {selectedContradiction.content}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tribunal Ruling
                </label>
                <Textarea
                  value={ruling}
                  onChange={(e) => setRuling(e.target.value)}
                  placeholder="Enter your tribunal ruling and resolution strategy..."
                  className="min-h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !ruling.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ruling'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedContradiction(null)
                    setRuling("")
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">⚖️</div>
              <p className="text-lg font-medium mb-2">Ready for Tribunal</p>
              <p className="text-sm">Select a contradiction from the left panel to begin ruling.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
