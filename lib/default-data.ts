export const fastPacePreset = {
  levels: [
    { smallBlind: 10, bigBlind: 20, ante: 0, duration: 10, isBreak: false },
    { smallBlind: 20, bigBlind: 40, ante: 0, duration: 10, isBreak: false },
    { smallBlind: 25, bigBlind: 50, ante: 0, duration: 10, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
    { smallBlind: 50, bigBlind: 100, ante: 10, duration: 10, isBreak: false },
    { smallBlind: 75, bigBlind: 150, ante: 20, duration: 10, isBreak: false },
    { smallBlind: 100, bigBlind: 200, ante: 20, duration: 10, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
    { smallBlind: 150, bigBlind: 300, ante: 25, duration: 10, isBreak: false },
    { smallBlind: 200, bigBlind: 400, ante: 50, duration: 10, isBreak: false },
    { smallBlind: 250, bigBlind: 500, ante: 50, duration: 10, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 5, isBreak: true },
    {
      smallBlind: 500,
      bigBlind: 1000,
      ante: 100,
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
    playerCount: 6,
    startingChips: 5000,
  },
}

export const mediumPacePreset = {
  levels: [
    { smallBlind: 10, bigBlind: 20, ante: 0, duration: 20, isBreak: false },
    { smallBlind: 20, bigBlind: 40, ante: 0, duration: 20, isBreak: false },
    { smallBlind: 25, bigBlind: 50, ante: 0, duration: 20, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 10, isBreak: true },
    { smallBlind: 50, bigBlind: 100, ante: 10, duration: 20, isBreak: false },
    { smallBlind: 75, bigBlind: 150, ante: 20, duration: 20, isBreak: false },
    { smallBlind: 100, bigBlind: 200, ante: 20, duration: 20, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 10, isBreak: true },
    { smallBlind: 150, bigBlind: 300, ante: 25, duration: 20, isBreak: false },
    { smallBlind: 200, bigBlind: 400, ante: 50, duration: 20, isBreak: false },
    { smallBlind: 250, bigBlind: 500, ante: 50, duration: 20, isBreak: false },
    { smallBlind: 0, bigBlind: 0, ante: 0, duration: 10, isBreak: true },
    {
      smallBlind: 500,
      bigBlind: 1000,
      ante: 100,
      duration: 20,
      isBreak: false,
    },
    {
      smallBlind: 750,
      bigBlind: 1500,
      ante: 150,
      duration: 20,
      isBreak: false,
    },
    {
      smallBlind: 1000,
      bigBlind: 2000,
      ante: 200,
      duration: 20,
      isBreak: false,
    },
  ],
  settings: {
    soundEnabled: true,
    darkMode: false,
    playerCount: 8,
    startingChips: 10000,
  },
}

export const defaultLevels = mediumPacePreset.levels
export const defaultSettings = mediumPacePreset.settings
