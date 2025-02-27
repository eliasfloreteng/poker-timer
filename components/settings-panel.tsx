"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Settings } from "@/types/poker-timer"
import { Undo2, Volume2, Moon, Plus, X } from "lucide-react"
import { ChipIcon } from "@/components/ui/chip-icon"

interface SettingsPanelProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
  onResetLevels: () => void
}

export function SettingsPanel({
  settings,
  onUpdateSettings,
  onResetLevels,
}: SettingsPanelProps) {
  const [newDenomination, setNewDenomination] = useState<string>("")

  const handleToggle = (key: keyof Settings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    })
  }

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof Settings
  ) => {
    const value = Number.parseInt(e.target.value) || 0
    onUpdateSettings({
      ...settings,
      [key]: value,
    })
  }

  const addChipDenomination = () => {
    const value = parseInt(newDenomination)
    if (value && !settings.chipDenominations.includes(value)) {
      const newDenominations = [...settings.chipDenominations, value].sort(
        (a, b) => a - b
      )
      onUpdateSettings({
        ...settings,
        chipDenominations: newDenominations,
      })
      setNewDenomination("")
    }
  }

  const removeChipDenomination = (denomination: number) => {
    const newDenominations = settings.chipDenominations.filter(
      (d) => d !== denomination
    )
    onUpdateSettings({
      ...settings,
      chipDenominations: newDenominations,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Tournament Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="soundEnabled">Sound Notifications</Label>
            </div>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={() => handleToggle("soundEnabled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={() => {
                handleToggle("darkMode")
                // Toggle dark mode class on document
                if (!settings.darkMode) {
                  document.documentElement.classList.add("dark")
                } else {
                  document.documentElement.classList.remove("dark")
                }
              }}
            />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Chip Denominations</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.chipDenominations.map((denomination) => (
                <div
                  key={denomination}
                  className="flex items-center gap-1 bg-muted rounded-md p-1"
                >
                  <ChipIcon value={denomination} size="sm" />
                  <span>{denomination}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeChipDenomination(denomination)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newDenomination}
                onChange={(e) => setNewDenomination(e.target.value)}
                placeholder="Add denomination"
                type="number"
                min="1"
              />
              <Button onClick={addChipDenomination} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Reset Options</h3>
        <Button variant="outline" onClick={onResetLevels} className="w-full">
          <Undo2 className="h-4 w-4 mr-2" /> Reset to Default Levels
        </Button>
      </div>
    </div>
  )
}
