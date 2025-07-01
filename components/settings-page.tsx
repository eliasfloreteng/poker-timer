"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SettingsPanel } from "@/components/settings-panel"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useThemeSync } from "@/hooks/use-theme"
import type { Level, Settings } from "@/types/poker-timer"
import { defaultLevels, defaultSettings } from "@/lib/default-data"

export function SettingsPage() {
  const [levels, setLevels] = useLocalStorage<Level[]>(
    "poker-timer-levels",
    defaultLevels
  )
  const [settings, setSettings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
  )

  // Sync dark mode with next-themes
  useThemeSync(settings, setSettings)

  return (
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
              // Reload the application
              window.location.reload()
            }
          }}
        />
      </CardContent>
    </Card>
  )
}
