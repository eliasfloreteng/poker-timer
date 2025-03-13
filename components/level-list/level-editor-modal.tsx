import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LevelEditor } from "@/components/level-editor"
import type { Level } from "@/types/poker-timer"

interface LevelEditorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  level: Level | null
  isNewLevel: boolean
  onSave: (level: Level) => void
}

export function LevelEditorModal({
  isOpen,
  onClose,
  title,
  level,
  isNewLevel,
  onSave,
}: LevelEditorModalProps) {
  const [editingLevel, setEditingLevel] = useState<Level | null>(level)

  // Update local state when the level prop changes
  useState(() => {
    setEditingLevel(level)
  })

  // Handle save button click
  const handleSave = (savedLevel: Level) => {
    onSave(savedLevel)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isNewLevel
              ? "Add a new level to your tournament."
              : "Edit the current level settings."}
          </DialogDescription>
        </DialogHeader>

        {editingLevel && (
          <LevelEditor
            level={editingLevel}
            onSave={handleSave}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
