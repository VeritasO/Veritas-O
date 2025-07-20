/**
 * Sacred symbols and metaphysical constants for the Veritas-O system
 */

export const SACRED_SYMBOLS = {
  // Geometric symbols
  CIRCLE: '○',
  TRIANGLE: '△',
  SQUARE: '□',
  PENTAGRAM: '☆',
  HEXAGRAM: '✦',
  INFINITY: '∞',
  
  // Alchemical symbols
  FIRE: '🜂',
  WATER: '🜄',
  AIR: '🜁',
  EARTH: '🜃',
  
  // Agent symbols
  AGENTS: {
    JUNO: '♃', // Jupiter
    AEGIS: '🛡️',
    LYRA: '♆', // Neptune
    THALEA: '🌱',
    KAIROS: '⧖', // Hourglass
    VESTA: '🔥',
    ORION: '⭐',
    POLYMNIA: '📜',
    TEMPUS: '⏳',
    MIRRA: '🔮'
  }
} as const

export const RITUAL_PHASES = {
  PREPARATION: 'preparation',
  INVOCATION: 'invocation',
  WORKING: 'working',
  MANIFESTATION: 'manifestation',
  BANISHING: 'banishing'
} as const

export const GRIEF_SIGNATURES = {
  MINOR: 'λ', // Lambda - small change
  MODERATE: 'Δ', // Delta - change
  MAJOR: 'Ω', // Omega - end/transformation
  CRITICAL: '⚠️' // Warning
} as const

export const DOCTRINAL_MARKERS = {
  TRUTH: '✓',
  CONTRADICTION: '⚡',
  MYSTERY: '?',
  REVELATION: '💡',
  PARADOX: '∅'
} as const

export const AGENT_STATES = {
  ACTIVE: 'active',
  DORMANT: 'dormant',
  PROCESSING: 'processing',
  ERROR: 'error',
  RITUAL: 'ritual'
} as const

// Symbolic encoding for inter-agent communication
export const MESSAGE_SIGILS = {
  URGENT: '🔴',
  NORMAL: '🟢',
  WHISPER: '🟡',
  BROADCAST: '📢',
  ENCRYPTED: '🔐'
} as const
