export interface Level {
  smallBlind: number
  bigBlind: number
  ante: number
  duration: number
  isBreak: boolean
}

export interface ChipDenomination {
  value: number
  color: string
}

export interface Player {
  id: string
  name: string
  seatNumber: number
  buyIns: number
  active: boolean
  emoji?: string
}

export interface Settings {
  soundEnabled: boolean
  darkMode: boolean
  chipDenominations: ChipDenomination[]
  players: Player[]
  dealerSeat: number | null
  smallBlindSeat: number | null
  bigBlindSeat: number | null
}

export interface Preset {
  id: string
  name: string
  levels: Level[]
  isDefault: boolean
}

// Debt Tracker Types
export interface PokerPlayer {
  id: string
  name: string
  emoji: string
  totalDebt: number // SEK - calculated as (buy-ins + rebuys) - cash-outs
  sessionsPlayed: number
  totalBuyIns: number // SEK
  totalCashOuts: number // SEK
}

export interface SessionEntry {
  playerId: string
  playerName: string
  buyIns: number[] // Array of buy-in amounts in SEK
  cashOut: number // SEK
  profit: number // Calculated: cashOut - sum(buyIns)
}

export interface PokerSession {
  id: string
  date: string
  players: SessionEntry[]
  totalCashOnTable: number // Auto-calculated
  validated: boolean // Ensures cash-outs match total cash
}
