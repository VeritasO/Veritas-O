import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { getCurrentGriefTier, griefTierDescriptions, griefTierColors, type GriefTier } from "@/lib/grief"

const getSecondsUntilNextTier = () => {
  const now = new Date()
  const minute = now.getMinutes()
  const second = now.getSeconds()
  const currentTierMinute = minute % 5
  const secondsInCurrentTier = currentTierMinute * 60 + second
  const secondsUntilNext = 300 - secondsInCurrentTier // 5 minutes = 300 seconds
  return secondsUntilNext === 300 ? 0 : secondsUntilNext
}

const getTierSymbol = (tier: GriefTier): string => {
  switch (tier) {
    case 1: return "🌊" // Wave
    case 2: return "🕳️" // Depth
    case 3: return "💡" // Insight
    case 4: return "⚡" // Transmutation
    case 5: return "🕊️" // Liberation
    default: return "✨"
  }
}

export default function EnhancedCVTClock() {
  const [time, setTime] = useState(new Date())
  const [tier, setTier] = useState<GriefTier>(getCurrentGriefTier())
  const [secondsUntilNext, setSecondsUntilNext] = useState(getSecondsUntilNextTier())

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)
      setTier(getCurrentGriefTier())
      setSecondsUntilNext(getSecondsUntilNextTier())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = ((300 - secondsUntilNext) / 300) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
      <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 p-8 max-w-2xl w-full">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Chrono-Visceral Transformation
          </h1>
          <p className="text-slate-400 text-sm">5-minute grief processing cycles</p>

          {/* Main Clock */}
          <motion.div
            className="text-6xl font-mono text-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {time.toLocaleTimeString()}
          </motion.div>

          {/* Current Tier */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{getTierSymbol(tier)}</span>
              <div>
                <div 
                  className="text-2xl font-bold"
                  style={{ color: griefTierColors[tier] }}
                >
                  Tier {tier}
                </div>
                <div className="text-slate-400 text-sm">
                  Next transition: {formatTime(secondsUntilNext)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div 
              className="text-lg text-center italic px-4"
              style={{ color: griefTierColors[tier] }}
            >
              {griefTierDescriptions[tier]}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: griefTierColors[tier],
                  width: `${progressPercentage}%`
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Tier Overview */}
          <div className="grid grid-cols-5 gap-2 mt-8">
            {[1, 2, 3, 4, 5].map((tierNum) => (
              <div
                key={tierNum}
                className={`p-3 rounded-lg border transition-all ${
                  tierNum === tier 
                    ? 'border-white/30 scale-105 shadow-lg' 
                    : 'border-slate-600/30'
                }`}
                style={{
                  backgroundColor: tierNum === tier 
                    ? `${griefTierColors[tierNum as GriefTier]}20`
                    : 'rgba(71, 85, 105, 0.1)'
                }}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{getTierSymbol(tierNum as GriefTier)}</div>
                  <div 
                    className="text-xs font-bold"
                    style={{ 
                      color: tierNum === tier 
                        ? griefTierColors[tierNum as GriefTier]
                        : '#94a3b8'
                    }}
                  >
                    {tierNum}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 mt-6 space-y-1">
            <p>Each tier lasts exactly 1 minute • 5-minute complete cycles</p>
            <p>🌊 Destabilization → 🕳️ Mourning → 💡 Insight → ⚡ Reconstruction → 🕊️ Liberation</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
