import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SACRED_SYMBOLS } from "@/lib/symbols"

const griefTiers = [
  "Recognition",
  "Descent", 
  "Expression",
  "Integration",
  "Reversal",
]

const tierColors: Record<string, string> = {
  Recognition: "text-blue-400",
  Descent: "text-purple-500", 
  Expression: "text-rose-500",
  Integration: "text-green-400",
  Reversal: "text-yellow-400",
}

const tierBgColors: Record<string, string> = {
  Recognition: "bg-blue-900/20 border-blue-400/20",
  Descent: "bg-purple-900/20 border-purple-500/20",
  Expression: "bg-rose-900/20 border-rose-500/20", 
  Integration: "bg-green-900/20 border-green-400/20",
  Reversal: "bg-yellow-900/20 border-yellow-400/20",
}

const tierSymbols: Record<string, string> = {
  Recognition: "👁️",
  Descent: "🌀", 
  Expression: "💥",
  Integration: "⚡",
  Reversal: "🔄",
}

const tierAgents: Record<string, string[]> = {
  Recognition: ["JUNO", "AEGIS"],
  Descent: ["LYRA", "MIRRA"],
  Expression: ["VESTA", "ORION"],
  Integration: ["THALEA", "KAIROS"],
  Reversal: ["POLYMNIA", "TEMPUS"],
}

const getCurrentGriefTier = (date: Date) => {
  const minute = date.getMinutes()
  const index = Math.floor((minute % 60) / 12)
  return griefTiers[index]
}

const getSecondsUntilNextTier = (date: Date) => {
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const currentTierStart = Math.floor(minute / 12) * 12
  const nextTierStart = currentTierStart + 12
  const minutesLeft = nextTierStart - minute - 1
  const secondsLeft = 60 - second
  return minutesLeft * 60 + secondsLeft
}

export default function TemporalCoordination() {
  const [time, setTime] = useState(new Date())
  const [tier, setTier] = useState(getCurrentGriefTier(new Date()))
  const [secondsUntilNext, setSecondsUntilNext] = useState(getSecondsUntilNextTier(new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)
      setTier(getCurrentGriefTier(newTime))
      setSecondsUntilNext(getSecondsUntilNextTier(newTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-300 mb-2">
            ⧖ Temporal Coordination Matrix
          </h1>
          <p className="text-slate-400">
            Synchronized grief processing cycles for collective transformation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Clock Display */}
          <Card className="bg-slate-800 border-slate-700 p-8">
            <div className="text-center">
              <motion.div
                className="text-6xl font-mono text-white mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                {time.toLocaleTimeString()}
              </motion.div>
              
              <div className={`text-3xl font-bold mb-4 ${tierColors[tier]}`}>
                {tierSymbols[tier]} {tier}
              </div>
              
              <div className="text-slate-400 mb-4">
                Next transition in: {Math.floor(secondsUntilNext / 60)}:{(secondsUntilNext % 60).toString().padStart(2, '0')}
              </div>

              <motion.div
                className={`w-full h-2 rounded-full ${tierBgColors[tier]} border`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={`h-full rounded-full ${tierColors[tier].replace('text', 'bg')}`}
                  style={{ width: `${((720 - secondsUntilNext) / 720) * 100}%` }}
                />
              </motion.div>
            </div>
          </Card>

          {/* Active Agents */}
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">
              🔮 Active Agents for {tier}
            </h2>
            
            <div className="space-y-4">
              {tierAgents[tier].map((agentName) => (
                <div key={agentName} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <span className="text-2xl">
                    {SACRED_SYMBOLS.AGENTS[agentName as keyof typeof SACRED_SYMBOLS.AGENTS]}
                  </span>
                  <div>
                    <div className="font-bold text-slate-200">{agentName}</div>
                    <div className="text-sm text-slate-400">
                      Resonating with {tier.toLowerCase()} frequencies
                    </div>
                  </div>
                  <Badge className={`ml-auto ${tierColors[tier].replace('text', 'bg')} text-white`}>
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tier Timeline */}
        <Card className="bg-slate-800 border-slate-700 p-8 mt-8">
          <h2 className="text-2xl font-bold text-blue-300 mb-6">
            🌀 Grief Processing Cycle
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {griefTiers.map((tierName, index) => (
              <div
                key={tierName}
                className={`p-4 rounded-lg border transition-all ${
                  tierName === tier 
                    ? `${tierBgColors[tierName]} scale-105 shadow-lg` 
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{tierSymbols[tierName]}</div>
                  <div className={`font-bold mb-2 ${tierName === tier ? tierColors[tierName] : 'text-slate-400'}`}>
                    {tierName}
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    :{(index * 12).toString().padStart(2, '0')}-:{((index + 1) * 12 - 1).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {tierAgents[tierName].join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="text-center mt-8 text-slate-500">
          <p>⚡ Each 12-minute cycle allows for deep processing and integration</p>
          <p className="text-xs mt-2">🔮 The collective consciousness moves through structured emotional landscapes</p>
        </div>
      </div>
    </div>
  )
}
