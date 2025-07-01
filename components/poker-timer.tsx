"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimerDisplay } from "@/components/timer-display"
import { SettingsPanel } from "@/components/settings-panel"
import { LevelList } from "@/components/level-list"
import { SeatingPlan } from "@/components/seating-plan"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTimer } from "@/hooks/use-timer"
import { useThemeSync } from "@/hooks/use-theme"
import type { Level, Settings } from "@/types/poker-timer"
import { defaultLevels, defaultSettings } from "@/lib/default-data"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react"
import { ChipCalculator } from "@/components/chip-calculator"
import { DebtTracker } from "@/components/debt-tracker/debt-tracker"

// NextLevels component to display upcoming levels
interface NextLevelsProps {
  levels: Level[]
  currentLevelIndex: number
}

function NextLevels({ levels, currentLevelIndex }: NextLevelsProps) {
  const nextLevels = levels.slice(currentLevelIndex + 1, currentLevelIndex + 4)

  if (nextLevels.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        This is the final level
      </div>
    )
  }

  return (
    <div className="mt-4 md:mt-6">
      <h3 className="text-base md:text-lg font-medium mb-2">Upcoming Levels</h3>
      <div className="space-y-2">
        {nextLevels.map((level, idx) => (
          <div
            key={idx}
            className="p-2 sm:p-3 border rounded-md flex justify-between items-center text-sm sm:text-base"
          >
            <div>
              {level.isBreak ? (
                <span className="font-medium">Break</span>
              ) : (
                <span>
                  <span className="font-medium">
                    Level {currentLevelIndex + idx + 2}:
                  </span>{" "}
                  {level.smallBlind}/{level.bigBlind}
                  {level.ante > 0 && ` (Ante: ${level.ante})`}
                </span>
              )}
            </div>
            <div>{level.duration} min</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Timer Controls Component
interface TimerControlsProps {
  isRunning: boolean
  toggleTimer: () => void
  resetTimer: () => void
  goToPreviousLevel: () => void
  goToNextLevel: () => void
  shortenLevel: () => void
  extendLevel: () => void
  soundEnabled: boolean
  toggleSound: () => void
  hasPreviousLevel: boolean
  hasNextLevel: boolean
}

function TimerControls({
  isRunning,
  toggleTimer,
  resetTimer,
  goToPreviousLevel,
  goToNextLevel,
  shortenLevel,
  extendLevel,
  soundEnabled,
  toggleSound,
  hasPreviousLevel,
  hasNextLevel,
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousLevel}
        disabled={!hasPreviousLevel}
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        variant={isRunning ? "destructive" : "default"}
        onClick={toggleTimer}
      >
        {isRunning ? (
          <>
            <Pause className="h-4 w-4 mr-2" /> Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" /> Start
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextLevel}
        disabled={!hasNextLevel}
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      <Button variant="outline" onClick={resetTimer}>
        Reset
      </Button>

      <Button variant="outline" onClick={shortenLevel}>
        -1 Min
      </Button>

      <Button variant="outline" onClick={extendLevel}>
        +1 Min
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleSound}
        title={soundEnabled ? "Mute" : "Unmute"}
      >
        {soundEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

export function PokerTimer() {
  const [levels, setLevels] = useLocalStorage<Level[]>(
    "poker-timer-levels",
    defaultLevels
  )

  const [settings, setSettings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
  )

  const [activeTab, setActiveTab] = useLocalStorage<string>(
    "poker-timer-active-tab",
    "timer"
  )

  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(
    "poker-timer-soundEnabled",
    true
  )

  // Use the timer hook
  const timer = useTimer({
    levels,
    soundEnabled,
    appSoundEnabled: settings.soundEnabled,
  })

  const moveLevel = (fromIndex: number, toIndex: number) => {
    const newLevels = [...levels]
    const [movedLevel] = newLevels.splice(fromIndex, 1)
    newLevels.splice(toIndex, 0, movedLevel)
    setLevels(newLevels)

    // Update currentLevelIndex if it was affected by the move
    if (fromIndex === timer.currentLevelIndex) {
      timer.setCurrentLevelIndex(toIndex)
    } else if (
      (fromIndex < timer.currentLevelIndex &&
        toIndex >= timer.currentLevelIndex) ||
      (fromIndex > timer.currentLevelIndex &&
        toIndex <= timer.currentLevelIndex)
    ) {
      timer.setCurrentLevelIndex(
        fromIndex < timer.currentLevelIndex
          ? timer.currentLevelIndex - 1
          : timer.currentLevelIndex + 1
      )
    }
  }

  const updateLevels = (newLevels: Level[]) => {
    setLevels(newLevels)

    // Ensure currentLevelIndex is still valid
    if (timer.currentLevelIndex >= newLevels.length) {
      timer.setCurrentLevelIndex(Math.max(0, newLevels.length - 1))
    }

    // Update the timer if the current level changed
    if (timer.currentLevelIndex < newLevels.length) {
      timer.setTimeRemaining(newLevels[timer.currentLevelIndex].duration * 60)
    }
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  // Sync dark mode with next-themes
  useThemeSync(settings, setSettings)

  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2 block sm:flex justify-center items-center">
          <TabsList className="inline-flex w-auto sm:min-w-0 min-w-full mb-4 md:mb-6 gap-1">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="levels">Levels</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="chips">Chips</TabsTrigger>
            <TabsTrigger value="debt-tracker">Session Tracker</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="timer">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="space-y-6">
                <TimerDisplay
                  level={timer.currentLevel}
                  timeRemaining={timer.timeRemaining}
                  isRunning={timer.isRunning}
                />

                <TimerControls
                  isRunning={timer.isRunning}
                  toggleTimer={timer.toggleTimer}
                  resetTimer={timer.resetTimer}
                  goToPreviousLevel={timer.goToPreviousLevel}
                  goToNextLevel={timer.goToNextLevel}
                  shortenLevel={timer.shortenLevel}
                  extendLevel={timer.extendLevel}
                  soundEnabled={soundEnabled}
                  toggleSound={toggleSound}
                  hasPreviousLevel={timer.currentLevelIndex > 0}
                  hasNextLevel={timer.currentLevelIndex < levels.length - 1}
                />

                <NextLevels
                  levels={levels}
                  currentLevelIndex={timer.currentLevelIndex}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <LevelList
                levels={levels}
                currentLevelIndex={timer.currentLevelIndex}
                onUpdateLevel={(level, index) => {
                  const newLevels = [...levels]
                  newLevels[index] = level
                  setLevels(newLevels)
                  if (index === timer.currentLevelIndex) {
                    timer.setTimeRemaining(level.duration * 60)
                  }
                }}
                onAddLevel={(level) => setLevels([...levels, level])}
                onRemoveLevel={(index) => {
                  const newLevels = levels.filter((_, i) => i !== index)
                  setLevels(newLevels)
                  if (
                    index <= timer.currentLevelIndex &&
                    timer.currentLevelIndex > 0
                  ) {
                    timer.setCurrentLevelIndex(timer.currentLevelIndex - 1)
                  }
                }}
                onMoveLevel={moveLevel}
                onSelectLevel={(index) => {
                  timer.setCurrentLevelIndex(index)
                  setActiveTab("timer")
                }}
                onUpdateLevels={updateLevels}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardContent className="pt-6">
              <SeatingPlan settings={settings} onUpdateSettings={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chips">
          <ChipCalculator chipDenominations={settings.chipDenominations} />
        </TabsContent>

        <TabsContent value="debt-tracker">
          <DebtTracker />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <SettingsPanel
                settings={settings}
                onUpdateSettings={setSettings}
                onResetLevels={() => {
                  if (
                    confirm(
                      "Are you sure you want to reset all settings to default? This will reload the application."
                    )
                  ) {
                    // Reset all settings and state
                    setLevels(defaultLevels)
                    setSettings(defaultSettings)
                    timer.setCurrentLevelIndex(0)
                    timer.setTimeRemaining(defaultLevels[0].duration * 60)
                    timer.setIsRunning(false)
                    // Reload the application
                    window.location.reload()
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
