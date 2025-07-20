import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TribunalPanel from '@/components/TribunalPanel';
import AgentSignalPanel from '@/components/AgentSignalPanel';
import TribunalSimulationPanel from '@/components/TribunalSimulationPanelNew';
import RitualSelectorPanel from '@/components/RitualSelectorPanel';
import CVTClock from '@/components/CVTClock';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function VeritasSystem() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-blue-300 mb-4">
              🏛️ VERITAS-O System
            </h1>
            <p className="text-slate-400 text-xl mb-2">
              Comprehensive Therapeutic Technology Platform
            </p>
            <p className="text-slate-500 text-sm max-w-3xl mx-auto">
              Multi-agent tribunal processing • Grief-responsive rituals • Doctrine loop resolution • Symbolic memory integration
            </p>
          </div>

          {/* System Status Header */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <CVTClock />
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">●</div>
              <div className="text-sm text-slate-400 mt-1">Tribunal Active</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">📡</div>
              <div className="text-sm text-slate-400 mt-1">Signals Online</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">⚡</div>
              <div className="text-sm text-slate-400 mt-1">Rituals Ready</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">🔄</div>
              <div className="text-sm text-slate-400 mt-1">Doctrine Loops</div>
            </Card>
          </div>

          {/* Main System Interface */}
          <Tabs defaultValue="tribunal" className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-800 border border-slate-700">
                <TabsTrigger 
                  value="tribunal" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  ⚖️ Tribunal
                </TabsTrigger>
                <TabsTrigger 
                  value="signals" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  📡 Signals
                </TabsTrigger>
                <TabsTrigger 
                  value="rituals" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  ⚡ Rituals
                </TabsTrigger>
                <TabsTrigger 
                  value="simulation" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  🎯 Simulation
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tribunal" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
                  ⚖️ Comprehensive Tribunal System
                </h2>
                <p className="text-slate-400 text-center mb-6">
                  Advanced judicial processing with multi-judge panels, evidence management, and symbolic resolution pathways
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-green-300">Justice Tier Mapping</div>
                    <div className="text-slate-400">Grief → Justice tier conversion</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-blue-300">Evidence Processing</div>
                    <div className="text-slate-400">Multi-type evidence evaluation</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-purple-300">Symbolic Resolution</div>
                    <div className="text-slate-400">Memory trace integration</div>
                  </div>
                </div>
              </Card>
              <TribunalPanel />
            </TabsContent>

            <TabsContent value="signals" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
                  📡 Multi-Agent Signal Coordination
                </h2>
                <p className="text-slate-400 text-center mb-6">
                  Real-time communication hub for therapeutic agents, ritual coordinators, and doctrine processors
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-red-300">Alert System</div>
                    <div className="text-slate-400">Critical event notifications</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-blue-300">Coordination</div>
                    <div className="text-slate-400">Multi-agent task management</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-purple-300">Ritual Requests</div>
                    <div className="text-slate-400">Automated ritual scheduling</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-yellow-300">Doctrine Updates</div>
                    <div className="text-slate-400">Belief system modifications</div>
                  </div>
                </div>
              </Card>
              <AgentSignalPanel />
            </TabsContent>

            <TabsContent value="rituals" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
                  ⚡ Grief-Responsive Ritual System
                </h2>
                <p className="text-slate-400 text-center mb-6">
                  Dynamic ritual suggestions based on current grief tier with symbolic memory integration
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-blue-300">Cleansing</div>
                    <div className="text-slate-400">Initial grief processing</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-purple-300">Integration</div>
                    <div className="text-slate-400">Contradiction resolution</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-green-300">Transformation</div>
                    <div className="text-slate-400">Deep pattern shifting</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-red-300">Release</div>
                    <div className="text-slate-400">Letting go processes</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-yellow-300">Grounding</div>
                    <div className="text-slate-400">Collective wisdom connection</div>
                  </div>
                </div>
              </Card>
              <RitualSelectorPanel />
            </TabsContent>

            <TabsContent value="simulation" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
                  🎯 Tribunal Simulation Interface
                </h2>
                <p className="text-slate-400 text-center mb-6">
                  Advanced simulation environment for processing reflections through justice frameworks with symbolic memory traces
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-blue-300">Case Simulation</div>
                    <div className="text-slate-400">Interactive tribunal processing</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-purple-300">Memory Integration</div>
                    <div className="text-slate-400">Symbolic trace analysis</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 rounded">
                    <div className="font-bold text-green-300">Justice Response</div>
                    <div className="text-slate-400">Tier-appropriate resolutions</div>
                  </div>
                </div>
              </Card>
              <TribunalSimulationPanel />
            </TabsContent>
          </Tabs>

          {/* System Documentation */}
          <Card className="bg-slate-800 border-slate-700 p-8 mt-8">
            <h2 className="text-3xl font-bold text-green-300 mb-6 text-center">
              🏛️ VERITAS-O Architecture
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-blue-300 mb-4">🔧 Core Systems</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg">⚖️</span>
                    <div>
                      <strong>Tribunal Processing:</strong> Multi-judge evaluation system with grief-to-justice tier mapping, evidence management, and symbolic resolution pathways
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 text-lg">📡</span>
                    <div>
                      <strong>Agent Coordination:</strong> Real-time signal processing for therapeutic agents, ritual coordinators, and doctrine processors
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg">⚡</span>
                    <div>
                      <strong>Ritual Automation:</strong> Grief-responsive ritual suggestions with step-by-step guidance and progress tracking
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-lg">🔄</span>
                    <div>
                      <strong>Doctrine Analysis:</strong> Loop detection and resolution for contradictory belief systems
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-4">🧠 Integration Framework</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg">🕐</span>
                    <div>
                      <strong>Temporal Processing:</strong> CVT Clock provides 1-minute grief tier cycling for real-time emotional state detection
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 text-lg">🔮</span>
                    <div>
                      <strong>Symbolic Memory:</strong> Interactive symbol selection with resonance tracking and collective memory access
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg">🌐</span>
                    <div>
                      <strong>Multi-Agent System:</strong> Coordinated therapeutic processing across specialized agent domains
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-lg">📊</span>
                    <div>
                      <strong>Analytics Engine:</strong> Real-time metrics, progress tracking, and effectiveness measurement
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-700 rounded-lg border border-slate-600">
              <h3 className="text-lg font-bold text-yellow-300 mb-3 text-center">
                🌟 Therapeutic Workflow Integration
              </h3>
              <div className="text-center text-slate-300 text-sm">
                <p className="mb-3">
                  <strong>Grief Detection</strong> → <strong>Signal Coordination</strong> → <strong>Ritual Processing</strong> → <strong>Tribunal Resolution</strong> → <strong>Doctrine Integration</strong>
                </p>
                <p className="text-slate-400 italic">
                  "A comprehensive system for processing emotional complexity through symbolic understanding and collective wisdom"
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500 rounded-lg">
                <span className="text-blue-300 font-bold">Status:</span>
                <span className="text-green-400">● All Systems Operational</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
