import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getCurrentGriefTier, griefTierDescriptions, griefTierColors, type GriefTier } from "@/lib/grief"

export default function CVTClock() {
  const [time, setTime] = useState(new Date())
  const [tier, setTier] = useState<GriefTier>(getCurrentGriefTier())

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)
      setTier(getCurrentGriefTier())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <motion.div
        className="text-4xl font-mono text-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {time.toLocaleTimeString()}
      </motion.div>
      <div 
        className="text-xl font-bold"
        style={{ color: griefTierColors[tier] }}
      >
        Grief Tier: {tier}
      </div>
      <div 
        className="text-sm text-center max-w-md opacity-80"
        style={{ color: griefTierColors[tier] }}
      >
        {griefTierDescriptions[tier]}
      </div>
    </div>
  )
}
