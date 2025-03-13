import { useCallback, useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Level } from "@/types/poker-timer"

interface UseTimerProps {
  levels: Level[]
  soundEnabled: boolean
  appSoundEnabled: boolean
}

export function useTimer({
  levels,
  soundEnabled,
  appSoundEnabled,
}: UseTimerProps) {
  const [currentLevelIndex, setCurrentLevelIndex] = useLocalStorage<number>(
    "poker-timer-currentLevelIndex",
    0
  )
  const [timeRemaining, setTimeRemaining] = useLocalStorage<number>(
    "poker-timer-timeRemaining",
    levels[0]?.duration * 60 || 0
  )
  const [isRunning, setIsRunning] = useLocalStorage<boolean>(
    "poker-timer-isRunning",
    false
  )

  const currentLevel = levels[currentLevelIndex]

  const playSound = useCallback(() => {
    if (soundEnabled && appSoundEnabled) {
      const audio = new Audio("/notification.wav")
      audio.play().catch((e) => console.error("Error playing sound:", e))
    }
  }, [soundEnabled, appSoundEnabled])

  // Initialize timer when level changes, but only if it's not already set
  useEffect(() => {
    if (currentLevel && timeRemaining === 0) {
      setTimeRemaining(currentLevel.duration * 60)
    }
  }, [currentLevel, timeRemaining, setTimeRemaining])

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
  }, [
    isRunning,
    timeRemaining,
    currentLevelIndex,
    levels.length,
    playSound,
    setTimeRemaining,
    setCurrentLevelIndex,
    setIsRunning,
  ])

  const toggleTimer = () => {
    setIsRunning((prev) => !prev)
  }

  const resetTimer = () => {
    setTimeRemaining(currentLevel.duration * 60)
    setIsRunning(false)
  }

  const goToNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1)
      setTimeRemaining(levels[currentLevelIndex + 1].duration * 60)
      setIsRunning(false)
    }
  }

  const goToPreviousLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex((prev) => prev - 1)
      setTimeRemaining(levels[currentLevelIndex - 1].duration * 60)
      setIsRunning(false)
    }
  }

  const shortenLevel = () => {
    if (timeRemaining > 60) {
      setTimeRemaining((prev) => prev - 60)
    }
  }

  const extendLevel = () => {
    setTimeRemaining((prev) => prev + 60)
  }

  return {
    currentLevelIndex,
    setCurrentLevelIndex,
    timeRemaining,
    setTimeRemaining,
    isRunning,
    setIsRunning,
    currentLevel,
    toggleTimer,
    resetTimer,
    goToNextLevel,
    goToPreviousLevel,
    shortenLevel,
    extendLevel,
  }
}
