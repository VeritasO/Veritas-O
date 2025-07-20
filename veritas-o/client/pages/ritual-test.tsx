import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RitualSelectorPanel from '@/components/RitualSelectorPanel';
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

export default function RitualTest() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-300 mb-2">
              🌊 Grief-Responsive Ritual System
            </h1>
            <p className="text-slate-400 text-lg">
              Dynamic rituals that adapt to your current grief processing tier
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Time & Tier */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-purple-300 mb-4 text-center">
                Current State
              </h2>
              <CVTClock />
            </Card>

            {/* Ritual Selector - spans 2 columns */}
            <div className="lg:col-span-2">
              <RitualSelectorPanel />
            </div>
          </div>

          {/* Information Panel */}
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-green-300 mb-6">
              ✨ How Grief-Responsive Rituals Work
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold text-blue-300 mb-3">🌊 Tier-Based Adaptation</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span><strong>Tier 1:</strong> Grounding rituals for initial wave recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong>Tier 2:</strong> Integration rituals for deep mourning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span><strong>Tier 3:</strong> Insight rituals for clarity emergence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span><strong>Tier 4:</strong> Transformation rituals for reconstruction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span><strong>Tier 5:</strong> Release rituals for liberation</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-300 mb-3">⚡ Ritual Categories</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🌊</span>
                    <div>
                      <strong>Cleansing:</strong> Clear emotional blockages
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">💎</span>
                    <div>
                      <strong>Integration:</strong> Weave insights into being
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <strong>Transformation:</strong> Active reconstruction
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🕊️</span>
                    <div>
                      <strong>Release:</strong> Let go and liberate
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <strong>Grounding:</strong> Root in present moment
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <h3 className="text-lg font-bold text-yellow-300 mb-3">🕯️ Usage Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div>
                  <strong className="text-green-400">Beginner:</strong>
                  <p>Simple 60-90 second practices perfect for starting your grief work journey.</p>
                </div>
                <div>
                  <strong className="text-yellow-400">Intermediate:</strong>
                  <p>More involved practices that require some experience with emotional processing.</p>
                </div>
                <div>
                  <strong className="text-red-400">Advanced:</strong>
                  <p>Deep transformative work for those comfortable with intensive grief processing.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-slate-400 text-sm">
              <p className="italic">
                "Rituals update automatically as you move through grief tiers - each minute brings new possibilities for healing"
              </p>
            </div>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
