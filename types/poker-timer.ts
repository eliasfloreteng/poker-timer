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
}

export interface Settings {
  soundEnabled: boolean
  darkMode: boolean
  playerCount: number
  startingChips: number
  chipDenominations: ChipDenomination[]
  players: Player[]
  maxSeats: number
}

export interface Preset {
  id: string
  name: string
  levels: Level[]
  isDefault: boolean
}
