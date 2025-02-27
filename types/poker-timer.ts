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

export interface Settings {
  soundEnabled: boolean
  darkMode: boolean
  playerCount: number
  startingChips: number
  chipDenominations: ChipDenomination[]
}

export interface Preset {
  id: string
  name: string
  levels: Level[]
  isDefault: boolean
}
