import { Level, Settings, Preset } from "@/types/poker-timer"

export const fastPaceLevels: Level[] = [
  { smallBlind: 20, bigBlind: 40, ante: 0, duration: 5, isBreak: false },
  { smallBlind: 50, bigBlind: 100, ante: 0, duration: 5, isBreak: false },
  { smallBlind: 100, bigBlind: 200, ante: 0, duration: 5, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
  { smallBlind: 200, bigBlind: 400, ante: 50, duration: 5, isBreak: false },
  { smallBlind: 300, bigBlind: 600, ante: 70, duration: 5, isBreak: false },
  { smallBlind: 500, bigBlind: 1000, ante: 100, duration: 5, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
  { smallBlind: 700, bigBlind: 1400, ante: 150, duration: 5, isBreak: false },
  { smallBlind: 1000, bigBlind: 2000, ante: 200, duration: 5, isBreak: false },
]

export const mediumPaceLevels: Level[] = [
  { smallBlind: 10, bigBlind: 20, ante: 0, duration: 10, isBreak: false },
  { smallBlind: 20, bigBlind: 40, ante: 0, duration: 10, isBreak: false },
  { smallBlind: 30, bigBlind: 60, ante: 0, duration: 10, isBreak: false },
  { smallBlind: 40, bigBlind: 80, ante: 0, duration: 10, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 10, isBreak: true },
  { smallBlind: 50, bigBlind: 100, ante: 10, duration: 10, isBreak: false },
  { smallBlind: 70, bigBlind: 140, ante: 10, duration: 10, isBreak: false },
  { smallBlind: 100, bigBlind: 200, ante: 20, duration: 10, isBreak: false },
  { smallBlind: 150, bigBlind: 300, ante: 30, duration: 10, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 10, isBreak: true },
  { smallBlind: 200, bigBlind: 400, ante: 40, duration: 10, isBreak: false },
  { smallBlind: 300, bigBlind: 600, ante: 60, duration: 10, isBreak: false },
  { smallBlind: 400, bigBlind: 800, ante: 80, duration: 10, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 10, isBreak: true },
  { smallBlind: 500, bigBlind: 1000, ante: 100, duration: 10, isBreak: false },
  { smallBlind: 700, bigBlind: 1400, ante: 140, duration: 10, isBreak: false },
  { smallBlind: 1000, bigBlind: 2000, ante: 200, duration: 10, isBreak: false },
]

export const longPaceLevels: Level[] = [
  { smallBlind: 10, bigBlind: 20, ante: 0, duration: 20, isBreak: false },
  { smallBlind: 20, bigBlind: 40, ante: 0, duration: 20, isBreak: false },
  { smallBlind: 30, bigBlind: 60, ante: 0, duration: 20, isBreak: false },
  { smallBlind: 40, bigBlind: 80, ante: 0, duration: 20, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 20, isBreak: true },
  { smallBlind: 50, bigBlind: 100, ante: 10, duration: 20, isBreak: false },
  { smallBlind: 70, bigBlind: 140, ante: 10, duration: 20, isBreak: false },
  { smallBlind: 100, bigBlind: 200, ante: 20, duration: 20, isBreak: false },
  { smallBlind: 150, bigBlind: 300, ante: 30, duration: 20, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 20, isBreak: true },
  { smallBlind: 200, bigBlind: 400, ante: 40, duration: 20, isBreak: false },
  { smallBlind: 300, bigBlind: 600, ante: 60, duration: 20, isBreak: false },
  { smallBlind: 400, bigBlind: 800, ante: 80, duration: 20, isBreak: false },
  { smallBlind: 0, bigBlind: 0, ante: 0, duration: 20, isBreak: true },
  { smallBlind: 500, bigBlind: 1000, ante: 100, duration: 20, isBreak: false },
  { smallBlind: 700, bigBlind: 1400, ante: 140, duration: 20, isBreak: false },
  { smallBlind: 1000, bigBlind: 2000, ante: 200, duration: 20, isBreak: false },
]
export const defaultPresets: Preset[] = [
  {
    id: "fast-pace",
    name: "Fast Pace (5 min/round)",
    levels: fastPaceLevels,
    isDefault: true,
  },
  {
    id: "medium-pace",
    name: "Medium Pace (10 min/round)",
    levels: mediumPaceLevels,
    isDefault: true,
  },
  {
    id: "long-pace",
    name: "Long Pace (20 min/round)",
    levels: longPaceLevels,
    isDefault: true,
  },
]

export const defaultSettings: Settings = {
  soundEnabled: true,
  darkMode: false,
  chipDenominations: [
    { value: 25, color: "bg-green-600 border-green-800 text-white" },
    { value: 100, color: "bg-gray-400 border-gray-600 text-black" },
    { value: 500, color: "bg-purple-500 border-purple-700 text-white" },
    { value: 1000, color: "bg-yellow-400 border-yellow-600 text-black" },
    { value: 5000, color: "bg-yellow-900 border-yellow-800 text-white" },
    { value: 25000, color: "bg-orange-500 border-orange-700 text-white" },
  ],
  players: [],
  dealerSeat: null,
  smallBlindSeat: null,
  bigBlindSeat: null,
}

export const defaultLevels = mediumPaceLevels
