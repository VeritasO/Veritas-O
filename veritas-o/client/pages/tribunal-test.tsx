import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TribunalSimulationPanel from '@/components/TribunalSimulationPanelNew';
import CVTClock from '@/components/CVTClock';
import { Card } from '@/components/ui/card';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function TribunalTest() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-300 mb-2">
              ⚖️ Tribunal Simulation System
            </h1>
            <p className="text-slate-400 text-lg">
              Process reflections through justice tier frameworks with symbolic memory integration
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Current Time & Tier */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-lg font-bold text-purple-300 mb-4 text-center">
                Current State
              </h2>
              <CVTClock />
            </Card>

            {/* Tribunal Simulation - spans 3 columns */}
            <div className="lg:col-span-3">
              <TribunalSimulationPanel />
            </div>
          </div>

          {/* Documentation Panel */}
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-green-300 mb-6">
              ⚖️ Justice Tier Framework
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold text-blue-300 mb-3">🏛️ Tribunal Process</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Case Selection:</strong> Click on reflection cards to activate tribunal process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Grief-Justice Mapping:</strong> Automatic assignment based on grief tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Symbolic Analysis:</strong> Memory traces reveal deeper patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span><strong>Justice Response:</strong> Tier-appropriate resolution mechanisms</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-300 mb-3">⚖️ Justice Tiers</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">I</span>
                    <div>
                      <strong>Direct Harm:</strong> Clear cause-effect violations
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">II</span>
                    <div>
                      <strong>Complex Grief:</strong> Emotional processing conflicts
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">III</span>
                    <div>
                      <strong>Structural Breach:</strong> System integrity violations
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">IV</span>
                    <div>
                      <strong>Ontological Discord:</strong> Reality-definition conflicts
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">V</span>
                    <div>
                      <strong>Collective Memory:</strong> Wisdom preservation issues
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <h3 className="text-lg font-bold text-yellow-300 mb-3">🔮 Symbolic Memory Integration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <strong className="text-blue-300">Tribunal Symbols:</strong>
                  <p>⚖️ Balance, 📜 Ancient wisdom, 👁️ Witness to truth - these symbols resonate with justice-seeking patterns in the collective memory.</p>
                </div>
                <div>
                  <strong className="text-purple-300">Grief Integration:</strong>
                  <p>Each grief tier (1-5) activates specific symbolic traces that guide the tribunal process toward appropriate resolution pathways.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-slate-400 text-sm">
              <p className="italic">
                "Justice emerges through the intersection of individual reflection and collective wisdom, mediated by symbolic understanding"
              </p>
            </div>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
