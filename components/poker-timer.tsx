"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimerDisplay } from "@/components/timer-display"
import { SettingsPanel } from "@/components/settings-panel"
import { LevelList } from "@/components/level-list"
import { useLocalStorage } from "@/hooks/use-local-storage"
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

export function PokerTimer() {
  const [levels, setLevels] = useLocalStorage<Level[]>(
    "poker-timer-levels",
    defaultLevels
  )
  const [settings, setSettings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
  )
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("timer")
  const [soundEnabled, setSoundEnabled] = useState(true)

  const currentLevel = levels[currentLevelIndex]

  const playSound = useCallback(() => {
    if (soundEnabled && settings.soundEnabled) {
      const audio = new Audio("/notification.wav")
      audio.play().catch((e) => console.error("Error playing sound:", e))
    }
  }, [soundEnabled, settings.soundEnabled])

  // Initialize timer when level changes
  useEffect(() => {
    if (currentLevel) {
      setTimeRemaining(currentLevel.duration * 60)
    }
  }, [currentLevel])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            playSound()
            if (currentLevelIndex < levels.length - 1) {
              setCurrentLevelIndex((prev) => prev + 1)
              // Don't stop the timer when advancing levels
              return 0
            } else {
              setIsRunning(false)
              return 0
            }
          }
          return prev - 1
        })
      }, 1000)
    } else if (timeRemaining === 0 && currentLevelIndex === levels.length - 1) {
      // Only stop the timer if we're on the last level and time is up
      setIsRunning(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, currentLevelIndex, levels.length, playSound])

  const moveLevel = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= levels.length) return

    const newLevels = [...levels]
    const [removed] = newLevels.splice(fromIndex, 1)
    newLevels.splice(toIndex, 0, removed)
    setLevels(newLevels)

    // Update current level index if needed
    if (currentLevelIndex === fromIndex) {
      setCurrentLevelIndex(toIndex)
    } else if (
      (currentLevelIndex > fromIndex && currentLevelIndex <= toIndex) ||
      (currentLevelIndex < fromIndex && currentLevelIndex >= toIndex)
    ) {
      setCurrentLevelIndex((prev) =>
        fromIndex < toIndex ? prev - 1 : prev + 1
      )
    }
  }

  const toggleTimer = () => {
    setIsRunning((prev) => !prev)
  }

  const resetTimer = () => {
    if (currentLevel) {
      setTimeRemaining(currentLevel.duration * 60)
    }
    setIsRunning(false)
  }

  const goToNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1)
    }
  }

  const goToPreviousLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex((prev) => prev - 1)
    }
  }

  const skipBreak = () => {
    if (currentLevel?.isBreak && currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1)
    }
  }

  const shortenLevel = () => {
    if (timeRemaining > 60) {
      setTimeRemaining((prev) => prev - 60)
    } else {
      setTimeRemaining(0)
    }
  }

  const extendLevel = () => {
    setTimeRemaining((prev) => prev + 60)
  }

  const updateLevels = (newLevels: Level[]) => {
    setLevels(newLevels)
    setCurrentLevelIndex(0)
    setIsRunning(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
          <TabsTrigger value="chips">Counter</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <TimerDisplay
                level={currentLevel}
                timeRemaining={timeRemaining}
                currentLevelIndex={currentLevelIndex}
                totalLevels={levels.length}
                chipDenominations={settings.chipDenominations}
              />

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousLevel}
                  disabled={currentLevelIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant={isRunning ? "destructive" : "default"}
                  size="lg"
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
                  disabled={currentLevelIndex === levels.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {currentLevel?.isBreak && (
                <div className="mt-4 flex justify-center">
                  <Button variant="secondary" onClick={skipBreak}>
                    Skip Break
                  </Button>
                </div>
              )}

              <div className="mt-4 flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={shortenLevel}>
                  -1 Min
                </Button>
                <Button variant="outline" size="sm" onClick={resetTimer}>
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={extendLevel}>
                  +1 Min
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Next Levels</h3>
            <div className="space-y-2">
              {levels
                .slice(currentLevelIndex + 1, currentLevelIndex + 4)
                .map((level, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-md flex justify-between items-center"
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
        </TabsContent>

        <TabsContent value="levels">
          <Card>
            <CardContent className="pt-6">
              <LevelList
                levels={levels}
                currentLevelIndex={currentLevelIndex}
                onUpdateSettings={setSettings}
                onUpdateLevel={(level, index) => {
                  const newLevels = [...levels]
                  newLevels[index] = level
                  setLevels(newLevels)
                  if (index === currentLevelIndex) {
                    setTimeRemaining(level.duration * 60)
                  }
                }}
                onAddLevel={(level) => setLevels([...levels, level])}
                onRemoveLevel={(index) => {
                  const newLevels = levels.filter((_, i) => i !== index)
                  setLevels(newLevels)
                  if (index <= currentLevelIndex && currentLevelIndex > 0) {
                    setCurrentLevelIndex((prev) => prev - 1)
                  }
                }}
                onMoveLevel={moveLevel}
                onSelectLevel={(index) => {
                  setCurrentLevelIndex(index)
                  setActiveTab("timer")
                }}
                onUpdateLevels={updateLevels}
              />
            </CardContent>
          </Card>
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
                    setCurrentLevelIndex(0)
                    setTimeRemaining(defaultLevels[0].duration * 60)
                    setIsRunning(false)
                    // Reload the application
                    window.location.reload()
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chips">
          <ChipCalculator chipDenominations={settings.chipDenominations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
