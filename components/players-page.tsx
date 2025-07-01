"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SeatingPlan } from "@/components/seating-plan"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useThemeSync } from "@/hooks/use-theme"
import type { Settings } from "@/types/poker-timer"
import { defaultSettings } from "@/lib/default-data"

export function PlayersPage() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "poker-timer-settings",
    defaultSettings
  )

  // Sync dark mode with next-themes
  useThemeSync(settings, setSettings)

  return (
    <Card>
      <CardContent className="pt-6">
        <SeatingPlan settings={settings} onUpdateSettings={setSettings} />
      </CardContent>
    </Card>
  )
}
