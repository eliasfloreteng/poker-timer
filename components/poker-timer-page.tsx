"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TimerDisplay } from "@/components/timer-display"
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

export function PokerTimerPage() {
  const [levels] = useLocalStorage<Level[]>("poker-timer-levels", defaultLevels)
  const [settings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
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

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  // Sync dark mode with next-themes
  useThemeSync(settings, () => {})

  return (
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
  )
}
