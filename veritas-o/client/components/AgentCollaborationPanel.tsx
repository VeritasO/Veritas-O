import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useSymbolicSuggestions } from "@/hooks/useSymbolicSuggestions";
import { AgentMessage } from "@/lib/types";
import { SACRED_SYMBOLS } from "@/lib/symbols";

const agentColors: Record<string, string> = {
  JUNO: "bg-blue-500 text-white",
  AEGIS: "bg-green-500 text-white", 
  LYRA: "bg-purple-500 text-white",
  THALEA: "bg-emerald-500 text-white",
  KAIROS: "bg-amber-500 text-white",
  VESTA: "bg-red-500 text-white",
  ORION: "bg-cyan-500 text-white",
  POLYMNIA: "bg-pink-500 text-white",
  TEMPUS: "bg-lime-500 text-white",
  MIRRA: "bg-indigo-500 text-white",
};

const messageTypeIcons: Record<string, string> = {
  proposal: "💡",
  comment: "💬", 
  contradiction: "⚡",
  ritual: "🕯️",
  reflection: "🔮"
};

export default function AgentCollaborationPanel() {
  const { messages, sendMessage, unresolvedContradictions, isLoading } = useCollaboration();
  const { 
    suggestions, 
    fetchSuggestions, 
    applySuggestion, 
    activeSuggestions, 
    urgentSuggestions,
    isFetching,
    isApplying
  } = useSymbolicSuggestions();
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("JUNO");
  const [messageType, setMessageType] = useState<"proposal" | "comment" | "contradiction" | "ritual" | "reflection">("comment");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ 
      agent: selectedAgent, 
      content: input,
      type: messageType 
    });
    setInput("");
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'ritual': return '🕯️';
      case 'coordination': return '⚡';
      case 'restoration': return '🔮';
      case 'insight': return '💎';
      default: return '✨';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* Collaboration Feed */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-blue-300">Agent Collaboration Feed</h2>
            <span className="text-2xl">{SACRED_SYMBOLS.AGENTS.JUNO}</span>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No messages yet. Start the collaboration!</p>
              </div>
            ) : (
              messages.map((msg: AgentMessage, idx: number) => (
                <div key={msg.id || idx} className="flex gap-3 items-start p-3 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors">
                  <div className="flex flex-col items-center gap-1">
                    <Badge className={agentColors[msg.agent] || "bg-slate-500 text-white"}>
                      {msg.agent}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {msg.type && (
                        <span className="text-lg" title={msg.type}>
                          {messageTypeIcons[msg.type]}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 uppercase font-medium">
                        {msg.type || 'comment'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Message Composer */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-blue-300">Compose Message</h2>
            <span className="text-2xl">📝</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Agent
              </label>
              <select
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                {Object.keys(agentColors).map((agent) => (
                  <option key={agent} value={agent}>
                    {SACRED_SYMBOLS.AGENTS[agent as keyof typeof SACRED_SYMBOLS.AGENTS]} {agent}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message Type
              </label>
              <select
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as any)}
              >
                <option value="comment">💬 Comment</option>
                <option value="proposal">💡 Proposal</option>
                <option value="contradiction">⚡ Contradiction</option>
                <option value="ritual">🕯️ Ritual</option>
                <option value="reflection">🔮 Reflection</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message Content
            </label>
            <textarea
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share your insights, proposals, or observations with the collective..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSend} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? "Sending..." : "Send to Collective"}
          </Button>
        </div>
      </Card>

      {/* Unresolved Contradictions */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-red-400">Unresolved Contradictions</h2>
            <span className="text-2xl">⚡</span>
            <Badge variant="outline" className="ml-auto text-red-400 border-red-400">
              {unresolvedContradictions.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {unresolvedContradictions.length > 0 ? (
              unresolvedContradictions.map((contradiction, idx) => (
                <div key={contradiction.id || idx} className="p-4 bg-red-950 border border-red-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-red-200">{contradiction.summary}</h3>
                    <Badge 
                      className={
                        contradiction.severity === 'critical' ? 'bg-red-600' :
                        contradiction.severity === 'major' ? 'bg-orange-600' :
                        contradiction.severity === 'moderate' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }
                    >
                      {contradiction.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-red-300 mb-1">
                    <strong>Statement 1:</strong> {contradiction.statement1}
                  </p>
                  <p className="text-sm text-red-300 mb-2">
                    <strong>Statement 2:</strong> {contradiction.statement2}
                  </p>
                  <div className="flex items-center justify-between text-xs text-red-400">
                    <span>Detected by {SACRED_SYMBOLS.AGENTS[contradiction.detectedBy]} {contradiction.detectedBy}</span>
                    <span>{contradiction.createdAt?.toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✨</div>
                <p className="text-slate-400">No contradictions detected</p>
                <p className="text-sm text-slate-500 mt-1">The collective wisdom flows harmoniously</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Symbolic Suggestions */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-purple-300">Symbolic Suggestions</h2>
            <span className="text-2xl">🔮</span>
            <div className="ml-auto flex gap-2">
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Active: {activeSuggestions.length}
              </Badge>
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                Urgent: {urgentSuggestions.length}
              </Badge>
            </div>
          </div>

          <div className="mb-4">
            <Button 
              onClick={() => fetchSuggestions('MIRRA', 'ritual', 'Agent collaboration panel')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isFetching}
            >
              {isFetching ? "Channeling..." : "Channel New Suggestions"}
            </Button>
          </div>
          
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3 pr-2">
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <div className="text-4xl mb-2">🌟</div>
                  <p>No symbolic suggestions available</p>
                  <p className="text-sm text-slate-500 mt-1">Channel divine guidance for the collective</p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div key={suggestion.id} className={`p-4 rounded-lg border transition-all ${
                    suggestion.applied 
                      ? 'bg-green-950 border-green-800' 
                      : suggestion.priority === 'urgent'
                      ? 'bg-red-950 border-red-800'
                      : 'bg-slate-700 border-slate-600'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSuggestionIcon(suggestion.suggestionType)}</span>
                        <h3 className="font-medium text-slate-200">{suggestion.agentName} Ritual</h3>
                        <div className="flex gap-1">
                          {suggestion.symbols.map((symbol, idx) => (
                            <span key={idx} className="text-sm">{symbol}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {suggestion.suggestionType}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3">
                      {suggestion.content}
                    </p>
                    
                    {suggestion.context && (
                      <p className="text-xs text-slate-400 mb-3 italic">
                        Context: {suggestion.context}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>By {SACRED_SYMBOLS.AGENTS[suggestion.agentName as keyof typeof SACRED_SYMBOLS.AGENTS]} {suggestion.agentName}</span>
                        <span>•</span>
                        <span>{new Date(suggestion.timestamp).toLocaleTimeString()}</span>
                      </div>
                      
                      {!suggestion.applied && (
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion.id!)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isApplying}
                        >
                          {isApplying ? "Applying..." : "Apply Suggestion"}
                        </Button>
                      )}
                      
                      {suggestion.applied && (
                        <Badge className="bg-green-600 text-white">
                          ✓ Applied
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
