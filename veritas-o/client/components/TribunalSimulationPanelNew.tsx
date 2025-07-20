import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SymbolicMemoryTrace } from "./SymbolicMemoryTrace";
import { useReflections } from "@/hooks/useReflections";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TribunalSimulationPanel() {
  const { reflections } = useReflections();
  const [activeCase, setActiveCase] = useState<number | null>(null);

  const justiceTiers = [
    "Tier I: Direct Harm", 
    "Tier II: Complex Grief", 
    "Tier III: Structural Breach", 
    "Tier IV: Ontological Discord", 
    "Tier V: Collective Memory"
  ];

  const activeReflection = reflections.find((r) => r.id === activeCase?.toString());

  const getJusticeTierForGrief = (griefTier?: number) => {
    if (!griefTier) return "Tier I: Direct Harm";
    return justiceTiers[Math.min(griefTier - 1, 4)] || "Tier I: Direct Harm";
  };

  return (
    <div className="grid gap-4 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">⚖️ Tribunal Simulation Interface</h2>
        <p className="text-slate-400 text-sm">
          Process reflections through the justice tier framework for resolution
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reflections.map((r) => (
          <Card
            key={r.id}
            className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
              activeCase?.toString() === r.id ? "border-blue-500 bg-blue-950/20" : "border-slate-600 hover:border-slate-500"
            }`}
            onClick={() => setActiveCase(activeCase?.toString() === r.id ? null : parseInt(r.id!))}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{r.title || 'Untitled Reflection'}</h3>
                <div className="text-2xl opacity-60">⚖️</div>
              </div>
              
              <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                {r.description || r.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {r.griefTier && (
                  <Badge variant="outline" className="text-xs border-blue-400 text-blue-300">
                    Grief Tier: {r.griefTier}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {r.category || 'general'}
                </Badge>
                {r.contradictionId && (
                  <Badge variant="destructive" className="text-xs">
                    ⚠️ Contradiction
                  </Badge>
                )}
              </div>

              <div className="text-xs text-slate-400">
                Justice: {getJusticeTierForGrief(r.griefTier)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {activeReflection && (
          <motion.div
            className="mt-4 p-6 border rounded-xl bg-slate-800/50 border-slate-600 shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📜 Active Reflection Details
              <Badge className="bg-blue-600 text-white">Case #{activeReflection.id}</Badge>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <strong className="text-blue-300">Title:</strong>
                  <p className="text-slate-200">{activeReflection.title || 'Untitled'}</p>
                </div>
                
                <div>
                  <strong className="text-blue-300">Description:</strong>
                  <p className="text-slate-200">{activeReflection.description || 'No description'}</p>
                </div>
                
                <div>
                  <strong className="text-blue-300">Author:</strong>
                  <p className="text-slate-200">{activeReflection.author}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <strong className="text-purple-300">Grief Tier:</strong>
                  <p className="text-slate-200">{activeReflection.griefTier || 'Unassigned'}</p>
                </div>
                
                <div>
                  <strong className="text-purple-300">Justice Tier:</strong>
                  <p className="text-slate-200">{getJusticeTierForGrief(activeReflection.griefTier)}</p>
                </div>
                
                {activeReflection.contradictionId && (
                  <div>
                    <strong className="text-red-300">⚠️ Contradiction Status:</strong>
                    <p className="text-red-400 font-semibold">Linked Contradiction Detected</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <strong className="text-green-300">Content:</strong>
              <p className="text-slate-200 italic mt-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                "{activeReflection.content}"
              </p>
            </div>

            <div className="mb-6">
              <SymbolicMemoryTrace 
                traceSource="tribunal" 
                griefTier={activeReflection.griefTier || 1} 
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                ⚖️ Enact Justice Tier Response
              </Button>
              
              <Button variant="outline">
                📜 Generate Tribunal Report
              </Button>
              
              {activeReflection.contradictionId && (
                <Button variant="destructive">
                  ⚡ Resolve Contradiction
                </Button>
              )}
              
              <Button 
                variant="ghost"
                onClick={() => setActiveCase(null)}
                className="ml-auto"
              >
                Close Case
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {reflections.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-xl font-semibold mb-2">No Cases Available</h3>
          <p className="text-sm">No reflections available for tribunal processing</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-600/50">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">📋 Tribunal Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          {justiceTiers.map((tier) => (
            <div key={tier} className="text-center">
              <div className="font-medium text-slate-300">{tier.split(':')[0]}</div>
              <div className="text-slate-400">{tier.split(':')[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
