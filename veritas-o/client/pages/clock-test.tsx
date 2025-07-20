import CVTClock from '@/components/CVTClock';

export default function ClockTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-white mb-8 tracking-wide">
          Chrono-Visceral Transformation Clock
        </h1>
        <p className="text-slate-300 mb-12 text-lg max-w-2xl mx-auto">
          A temporal-emotional mapping system that cycles through grief processing tiers 
          every 12 minutes, creating a rhythmic framework for emotional transformation.
        </p>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 shadow-2xl">
          <CVTClock />
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/20">
            <div className="text-blue-400 font-bold text-sm mb-2">RECOGNITION</div>
            <div className="text-xs text-slate-300">:00-:11 minutes</div>
            <div className="text-xs text-slate-400 mt-1">Awareness dawning</div>
          </div>
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
            <div className="text-purple-500 font-bold text-sm mb-2">DESCENT</div>
            <div className="text-xs text-slate-300">:12-:23 minutes</div>
            <div className="text-xs text-slate-400 mt-1">Diving deeper</div>
          </div>
          <div className="bg-rose-900/30 p-4 rounded-lg border border-rose-500/20">
            <div className="text-rose-500 font-bold text-sm mb-2">EXPRESSION</div>
            <div className="text-xs text-slate-300">:24-:35 minutes</div>
            <div className="text-xs text-slate-400 mt-1">Emotional release</div>
          </div>
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/20">
            <div className="text-green-400 font-bold text-sm mb-2">INTEGRATION</div>
            <div className="text-xs text-slate-300">:36-:47 minutes</div>
            <div className="text-xs text-slate-400 mt-1">Wisdom synthesis</div>
          </div>
          <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-400/20">
            <div className="text-yellow-400 font-bold text-sm mb-2">REVERSAL</div>
            <div className="text-xs text-slate-300">:48-:59 minutes</div>
            <div className="text-xs text-slate-400 mt-1">Transformative return</div>
          </div>
        </div>

        <div className="mt-8 text-sm text-slate-400">
          ⧖ Time flows through emotional landscapes, each moment a doorway to deeper understanding
        </div>
      </div>
    </div>
  );
}
