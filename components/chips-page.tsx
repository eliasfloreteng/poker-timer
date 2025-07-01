"use client"

import { ChipCalculator } from "@/components/chip-calculator"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useThemeSync } from "@/hooks/use-theme"
import type { Settings } from "@/types/poker-timer"
import { defaultSettings } from "@/lib/default-data"

export function ChipsPage() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
  )

  // Sync dark mode with next-themes
  useThemeSync(settings, setSettings)

  return <ChipCalculator chipDenominations={settings.chipDenominations} />
}
