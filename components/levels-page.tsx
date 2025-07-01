"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LevelList } from "@/components/level-list"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTimer } from "@/hooks/use-timer"
import { useThemeSync } from "@/hooks/use-theme"
import type { Level, Settings } from "@/types/poker-timer"
import { defaultLevels, defaultSettings } from "@/lib/default-data"

export function LevelsPage() {
  const [levels, setLevels] = useLocalStorage<Level[]>(
    "poker-timer-levels",
    defaultLevels
  )
  const [settings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
  )
  const [soundEnabled] = useLocalStorage<boolean>(
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

  // Sync dark mode with next-themes
  useThemeSync(settings, () => {})

  return (
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
            // Navigate to timer page
            window.location.href = "/timer"
          }}
          onUpdateLevels={updateLevels}
        />
      </CardContent>
    </Card>
  )
}
