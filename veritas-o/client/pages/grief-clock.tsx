import EnhancedCVTClock from '@/components/EnhancedCVTClock';
import CVTClock from '@/components/CVTClock';
import { Card } from '@/components/ui/card';

export default function GriefClockTest() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌊 Grief Processing System
          </h1>
          <p className="text-slate-400 text-lg">
            Rapid 1-minute tier cycles for accelerated emotional transformation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Simple Clock */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h2 className="text-xl font-bold text-blue-300 mb-4 text-center">
              Simple CVT Clock
            </h2>
            <CVTClock />
          </Card>

          {/* Enhanced Clock */}
          <div className="lg:col-span-1">
            <div className="relative h-full">
              <EnhancedCVTClock />
            </div>
          </div>
        </div>

        {/* Documentation */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-purple-300 mb-6">
            🕳️ 5-Tier Grief Processing Framework
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-b from-pink-900/30 to-slate-800 p-4 rounded-lg border border-pink-500/20">
              <div className="text-pink-400 font-bold text-lg mb-2">🌊 Tier 1</div>
              <div className="text-sm text-slate-300 mb-2">Destabilization</div>
              <div className="text-xs text-slate-400">
                Initial wave of grief — destabilization and sensing
              </div>
            </div>

            <div className="bg-gradient-to-b from-purple-900/30 to-slate-800 p-4 rounded-lg border border-purple-500/20">
              <div className="text-purple-400 font-bold text-lg mb-2">🕳️ Tier 2</div>
              <div className="text-sm text-slate-300 mb-2">Mourning</div>
              <div className="text-xs text-slate-400">
                Depth of mourning — echo chambers of memory
              </div>
            </div>

            <div className="bg-gradient-to-b from-yellow-900/30 to-slate-800 p-4 rounded-lg border border-yellow-400/20">
              <div className="text-yellow-400 font-bold text-lg mb-2">💡 Tier 3</div>
              <div className="text-sm text-slate-300 mb-2">Insight</div>
              <div className="text-xs text-slate-400">
                Insight emerges — naming and witnessing
              </div>
            </div>

            <div className="bg-gradient-to-b from-orange-900/30 to-slate-800 p-4 rounded-lg border border-orange-500/20">
              <div className="text-orange-400 font-bold text-lg mb-2">⚡ Tier 4</div>
              <div className="text-sm text-slate-300 mb-2">Transmutation</div>
              <div className="text-xs text-slate-400">
                Transmutation — active reconstruction and voice
              </div>
            </div>

            <div className="bg-gradient-to-b from-cyan-900/30 to-slate-800 p-4 rounded-lg border border-cyan-400/20">
              <div className="text-cyan-400 font-bold text-lg mb-2">🕊️ Tier 5</div>
              <div className="text-sm text-slate-300 mb-2">Liberation</div>
              <div className="text-xs text-slate-400">
                Liberation — grief as wisdom and myth
              </div>
            </div>
          </div>

          <div className="space-y-4 text-slate-300">
            <h3 className="text-lg font-bold text-blue-300">System Mechanics</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <span><strong>Rapid Cycling:</strong> Each tier lasts exactly 1 minute (minute % 5)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span><strong>Complete Cycle:</strong> 5 minutes total for full grief processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span><strong>Real-time Updates:</strong> Live tier calculation and progress tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">•</span>
                <span><strong>Visual Feedback:</strong> Color-coded states and symbolic representation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>Therapeutic Framework:</strong> Structured emotional processing for rapid transformation</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-slate-300 text-sm italic text-center">
              "In the acceleration of grief, we find the possibility of deeper healing. 
              Each minute becomes a container for profound transformation."
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
