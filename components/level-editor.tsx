"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Level } from "@/types/poker-timer"

interface LevelEditorProps {
  level?: Level
  onSave: (level: Level) => void
  onCancel: () => void
}

export function LevelEditor({ level, onSave, onCancel }: LevelEditorProps) {
  const [formData, setFormData] = useState<Level>(
    level || {
      smallBlind: 25,
      bigBlind: 50,
      ante: 0,
      duration: 15,
      isBreak: false,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleToggleBreak = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isBreak: checked,
      // Reset blinds and ante if it's a break
      ...(checked ? { smallBlind: 0, bigBlind: 0, ante: 0 } : {}),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="isBreak"
          checked={formData.isBreak}
          onCheckedChange={handleToggleBreak}
        />
        <Label htmlFor="isBreak">This is a break</Label>
      </div>

      {!formData.isBreak && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smallBlind">Small Blind</Label>
              <Input
                id="smallBlind"
                name="smallBlind"
                type="number"
                value={formData.smallBlind}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bigBlind">Big Blind</Label>
              <Input
                id="bigBlind"
                name="bigBlind"
                type="number"
                value={formData.bigBlind}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ante">Ante (0 for no ante)</Label>
            <Input
              id="ante"
              name="ante"
              type="number"
              value={formData.ante}
              onChange={handleChange}
              min={0}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          min={1}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
