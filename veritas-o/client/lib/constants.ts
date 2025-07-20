/**
 * System-wide constants for Veritas-O
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Agent System Constants
export const AGENT_CONFIG = {
  MAX_TASK_QUEUE_SIZE: 100,
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  GRIEF_THRESHOLD: 0.75,
  MAX_RETRY_ATTEMPTS: 5,
  RITUAL_TIMEOUT: 300000, // 5 minutes
} as const

// Time Constants
export const TIME_CONSTANTS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const

// UI Constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  MODAL_Z_INDEX: 1000,
} as const

// Data Refresh Intervals
export const REFRESH_INTERVALS = {
  AGENT_STATUS: 10000, // 10 seconds
  DASHBOARD: 30000, // 30 seconds
  AUDIT_LOGS: 60000, // 1 minute
  DOCTRINE_CHANGES: 120000, // 2 minutes
} as const

// Validation Constants
export const VALIDATION_LIMITS = {
  AGENT_NAME_MAX_LENGTH: 50,
  MESSAGE_MAX_LENGTH: 5000,
  REFLECTION_MAX_LENGTH: 10000,
  BOOK_TITLE_MAX_LENGTH: 200,
  DOCTRINE_VERSION_MAX_LENGTH: 100,
} as const

// Error Codes
export const ERROR_CODES = {
  AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
  AGENT_BUSY: 'AGENT_BUSY',
  RITUAL_IN_PROGRESS: 'RITUAL_IN_PROGRESS',
  DOCTRINE_CONFLICT: 'DOCTRINE_CONFLICT',
  GRIEF_THRESHOLD_EXCEEDED: 'GRIEF_THRESHOLD_EXCEEDED',
  CONTRADICTION_DETECTED: 'CONTRADICTION_DETECTED',
} as const

// Status Codes
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const

// Color Palette (for consistency across components)
export const COLORS = {
  PRIMARY: '#3B82F6',
  PRIMARY_DARK: '#1E40AF',
  SECONDARY: '#64748B',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  
  // Agent-specific colors
  AGENT_COLORS: {
    JUNO: '#3B82F6',
    AEGIS: '#10B981',
    LYRA: '#8B5CF6',
    THALEA: '#22C55E',
    KAIROS: '#F59E0B',
    VESTA: '#EF4444',
    ORION: '#06B6D4',
    POLYMNIA: '#EC4899',
    TEMPUS: '#84CC16',
    MIRRA: '#6366F1',
  }
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_AGENT_ANALYTICS: true,
  ENABLE_ADVANCED_RITUALS: false,
  ENABLE_DOCTRINE_VERSIONING: false,
  ENABLE_CONTRADICTION_DETECTION: false,
} as const
