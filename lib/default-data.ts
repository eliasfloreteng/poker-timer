export const fastPacePreset = {
  levels: [
    { smallBlind: 20, bigBlind: 40, ante: 0, duration: 5, isBreak: false },
    { smallBlind: 50, bigBlind: 100, ante: 0, duration: 5, isBreak: false },
    { smallBlind: 100, bigBlind: 200, ante: 0, duration: 5, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
    { smallBlind: 200, bigBlind: 400, ante: 50, duration: 5, isBreak: false },
    { smallBlind: 300, bigBlind: 600, ante: 70, duration: 5, isBreak: false },
    { smallBlind: 500, bigBlind: 1000, ante: 100, duration: 5, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
    { smallBlind: 700, bigBlind: 1400, ante: 150, duration: 5, isBreak: false },
    {
      smallBlind: 1000,
      bigBlind: 2000,
      ante: 200,
      duration: 5,
      isBreak: false,
    },
  ],
  settings: {
    soundEnabled: true,
    darkMode: false,
    playerCount: 6,
    startingChips: 5000,
    chipDenominations: [10, 20, 50, 100, 500],
  },
}

export const mediumPacePreset = {
  levels: [
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
    {
      smallBlind: 500,
      bigBlind: 1000,
      ante: 100,
      duration: 10,
      isBreak: false,
    },
    {
      smallBlind: 700,
      bigBlind: 1400,
      ante: 140,
      duration: 10,
      isBreak: false,
    },
    {
      smallBlind: 1000,
      bigBlind: 2000,
      ante: 200,
      duration: 10,
      isBreak: false,
    },
  ],
  settings: {
    soundEnabled: true,
    darkMode: false,
    playerCount: 8,
    startingChips: 10000,
    chipDenominations: [10, 20, 50, 100, 500],
  },
}

export const defaultLevels = mediumPacePreset.levels
export const defaultSettings = mediumPacePreset.settings
