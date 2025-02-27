export interface Level {
  smallBlind: number
  bigBlind: number
  ante: number
  duration: number
  isBreak: boolean
}

export interface Settings {
  soundEnabled: boolean
  darkMode: boolean
  playerCount: number
  startingChips: number
}

