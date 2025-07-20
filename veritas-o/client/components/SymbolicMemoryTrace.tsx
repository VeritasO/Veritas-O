import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { griefTierColors, type GriefTier } from "@/lib/grief";

interface SymbolicTrace {
  id: string;
  symbol: string;
  meaning: string;
  resonance: number;
  timestamp: string;
}

interface SymbolicMemoryTraceProps {
  traceSource: 'tribunal' | 'reflection' | 'ritual' | 'contradiction';
  griefTier: GriefTier;
  className?: string;
}

const getTraceSymbols = (source: string, griefTier: GriefTier): SymbolicTrace[] => {
  const baseSymbols: Record<string, SymbolicTrace[]> = {
    tribunal: [
      {
        id: 'justice-scales',
        symbol: '⚖️',
        meaning: 'Balance of justice seeking truth',
        resonance: 0.9,
        timestamp: new Date().toISOString()
      },
      {
        id: 'memory-scroll',
        symbol: '📜',
        meaning: 'Ancient wisdom preserved in testimony',
        resonance: 0.8,
        timestamp: new Date().toISOString()
      },
      {
        id: 'truth-eye',
        symbol: '👁️',
        meaning: 'Witness to veiled realities',
        resonance: 0.85,
        timestamp: new Date().toISOString()
      }
    ],
    reflection: [
      {
        id: 'mirror-depth',
        symbol: '🪞',
        meaning: 'Self-examination reveals hidden patterns',
        resonance: 0.9,
        timestamp: new Date().toISOString()
      },
      {
        id: 'thought-spiral',
        symbol: '🌀',
        meaning: 'Contemplative spiral into understanding',
        resonance: 0.75,
        timestamp: new Date().toISOString()
      }
    ],
    ritual: [
      {
        id: 'sacred-flame',
        symbol: '🕯️',
        meaning: 'Sacred practice illuminates path',
        resonance: 0.95,
        timestamp: new Date().toISOString()
      },
      {
        id: 'transformation-phoenix',
        symbol: '🔥',
        meaning: 'Ritual fire transforms suffering',
        resonance: 0.8,
        timestamp: new Date().toISOString()
      }
    ],
    contradiction: [
      {
        id: 'paradox-knot',
        symbol: '⚡',
        meaning: 'Tension creates opportunities for growth',
        resonance: 0.7,
        timestamp: new Date().toISOString()
      },
      {
        id: 'broken-chain',
        symbol: '⛓️‍💥',
        meaning: 'Breaking old patterns through conflict',
        resonance: 0.65,
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Add grief-tier specific symbols
  const tierSymbols: Record<GriefTier, SymbolicTrace> = {
    1: {
      id: 'wave-recognition',
      symbol: '🌊',
      meaning: 'Initial wave of recognition and sensing',
      resonance: 0.9,
      timestamp: new Date().toISOString()
    },
    2: {
      id: 'depth-mourning',
      symbol: '🕳️',
      meaning: 'Descent into mourning\'s echo chambers',
      resonance: 0.85,
      timestamp: new Date().toISOString()
    },
    3: {
      id: 'insight-light',
      symbol: '💡',
      meaning: 'Insight emerges from darkness',
      resonance: 0.95,
      timestamp: new Date().toISOString()
    },
    4: {
      id: 'transmutation-power',
      symbol: '⚡',
      meaning: 'Active reconstruction and voice reclamation',
      resonance: 0.9,
      timestamp: new Date().toISOString()
    },
    5: {
      id: 'liberation-flight',
      symbol: '🕊️',
      meaning: 'Liberation through wisdom and myth',
      resonance: 1.0,
      timestamp: new Date().toISOString()
    }
  };

  return [...(baseSymbols[source] || []), tierSymbols[griefTier]];
};

export function SymbolicMemoryTrace({ 
  traceSource, 
  griefTier, 
  className = "" 
}: SymbolicMemoryTraceProps) {
  const [traces, setTraces] = useState<SymbolicTrace[]>([]);
  const [activeTrace, setActiveTrace] = useState<string | null>(null);

  useEffect(() => {
    const traceData = getTraceSymbols(traceSource, griefTier);
    setTraces(traceData);
    
    // Auto-cycle through traces
    const interval = setInterval(() => {
      const randomTrace = traceData[Math.floor(Math.random() * traceData.length)];
      setActiveTrace(randomTrace.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [traceSource, griefTier]);

  return (
    <Card className={`bg-slate-700/50 border-slate-600 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: griefTierColors[griefTier] }}
        />
        <h4 className="text-sm font-medium text-slate-200">
          Symbolic Memory Trace • {traceSource} • Tier {griefTier}
        </h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {traces.map((trace) => (
          <motion.div
            key={trace.id}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              activeTrace === trace.id 
                ? 'border-white/50 bg-slate-600/50 scale-105' 
                : 'border-slate-600/30 bg-slate-800/30 hover:border-slate-500/50'
            }`}
            onClick={() => setActiveTrace(activeTrace === trace.id ? null : trace.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{trace.symbol}</div>
              <div className="text-xs text-slate-400 truncate">{trace.meaning}</div>
              <div className="mt-1">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: griefTierColors[griefTier],
                    color: griefTierColors[griefTier]
                  }}
                >
                  {Math.round(trace.resonance * 100)}%
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {activeTrace && (
        <motion.div
          className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {(() => {
            const trace = traces.find(t => t.id === activeTrace);
            return trace ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{trace.symbol}</span>
                  <span className="text-sm font-medium text-slate-200">{trace.meaning}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Resonance: {Math.round(trace.resonance * 100)}%</span>
                  <span>•</span>
                  <span>Traced: {new Date(trace.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : null;
          })()}
        </motion.div>
      )}

      <div className="mt-3 text-xs text-slate-500 text-center">
        🔮 Symbolic traces resonate with collective memory patterns
      </div>
    </Card>
  );
}
