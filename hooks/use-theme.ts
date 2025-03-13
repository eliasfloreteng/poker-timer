"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import type { Settings } from "@/types/poker-timer"

// This hook syncs our settings.darkMode with next-themes
export function useThemeSync(
  settings: Settings,
  onUpdateSettings: (settings: Settings) => void
) {
  const { setTheme, theme } = useTheme()
  const isInitialized = useRef(false)
  const isUpdatingTheme = useRef(false)

  // First-time initialization
  useEffect(() => {
    if (!isInitialized.current && theme) {
      isInitialized.current = true
      setTheme(settings.darkMode ? "dark" : "light")
    }
  }, [theme, settings.darkMode, setTheme])

  // When settings.darkMode changes, update next-themes
  useEffect(() => {
    // Skip the first render and any theme updates we triggered
    if (!isInitialized.current || isUpdatingTheme.current) {
      return
    }

    setTheme(settings.darkMode ? "dark" : "light")
  }, [settings.darkMode, setTheme])

  // When theme changes from next-themes, update our settings
  useEffect(() => {
    if (!isInitialized.current || !theme || theme === "system") {
      return
    }

    const shouldBeDark = theme === "dark"
    if (shouldBeDark !== settings.darkMode) {
      isUpdatingTheme.current = true
      onUpdateSettings({
        ...settings,
        darkMode: shouldBeDark,
      })

      // Reset flag after update
      setTimeout(() => {
        isUpdatingTheme.current = false
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]) // Deliberately omitting settings & onUpdateSettings

  return {
    toggleDarkMode: () => {
      onUpdateSettings({
        ...settings,
        darkMode: !settings.darkMode,
      })
    },
  }
}
