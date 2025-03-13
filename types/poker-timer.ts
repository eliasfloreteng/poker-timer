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
