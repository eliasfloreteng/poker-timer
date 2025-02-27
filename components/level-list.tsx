"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Level } from "@/types/poker-timer"
import { LevelEditor } from "@/components/level-editor"
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Coffee,
  Edit,
  Plus,
  Trash2,
  Settings2,
} from "lucide-react"
import { fastPacePreset, mediumPacePreset } from "@/lib/default-data"

interface LevelListProps {
  levels: Level[]
  currentLevelIndex: number
  onUpdateSettings: (settings: any) => void
  onUpdateLevel: (level: Level, index: number) => void
  onAddLevel: (level: Level) => void
  onRemoveLevel: (index: number) => void
  onMoveLevel: (fromIndex: number, toIndex: number) => void
  onSelectLevel: (index: number) => void
  onUpdateLevels: (levels: Level[]) => void
}

export function LevelList({
  levels,
  currentLevelIndex,
  onUpdateSettings,
  onUpdateLevel,
  onAddLevel,
  onRemoveLevel,
  onMoveLevel,
  onSelectLevel,
  onUpdateLevels,
}: LevelListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddingLevel, setIsAddingLevel] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<{
    levels: Level[]
    settings: any
  } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleEditLevel = (index: number) => {
    setEditingIndex(index)
    setIsAddingLevel(false)
  }

  const handleAddLevel = () => {
    setIsAddingLevel(true)
    setEditingIndex(null)
  }

  const handleSaveLevel = (level: Level) => {
    if (editingIndex !== null) {
      onUpdateLevel(level, editingIndex)
      setEditingIndex(null)
    } else if (isAddingLevel) {
      onAddLevel(level)
      setIsAddingLevel(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setIsAddingLevel(false)
  }

  const handlePresetSelect = (preset: { levels: Level[]; settings: any }) => {
    setSelectedPreset(preset)
    setShowConfirmDialog(true)
  }

  const applyPreset = () => {
    if (!selectedPreset) return

    // Update settings first
    onUpdateSettings(selectedPreset.settings)

    // Update all levels at once
    onUpdateLevels(selectedPreset.levels)

    setShowConfirmDialog(false)
    setSelectedPreset(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-xl font-bold">Tournament Levels</h2>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Load Preset
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handlePresetSelect(fastPacePreset)}
              >
                Fast Pace (5 min/round)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePresetSelect(mediumPacePreset)}
              >
                Medium Pace (10 min/round)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAddLevel} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Level
          </Button>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Load Preset Structure</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current tournament structure. Are you sure
              you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPreset(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={applyPreset}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isAddingLevel && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Level</CardTitle>
          </CardHeader>
          <CardContent>
            <LevelEditor onSave={handleSaveLevel} onCancel={handleCancelEdit} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {levels.map((level, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Level {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <LevelEditor
                    level={level}
                    onSave={handleSaveLevel}
                    onCancel={handleCancelEdit}
                  />
                </CardContent>
              </Card>
            ) : (
              <div
                className={`p-3 border rounded-md ${
                  currentLevelIndex === index ? "bg-muted border-primary" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {level.isBreak ? (
                      <Coffee className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}

                    <div
                      className="cursor-pointer"
                      onClick={() => onSelectLevel(index)}
                    >
                      {level.isBreak ? (
                        <span className="font-medium">Break</span>
                      ) : (
                        <span>
                          <span className="font-medium">
                            {level.smallBlind}/{level.bigBlind}
                          </span>
                          {level.ante > 0 && ` (Ante: ${level.ante})`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 justify-between sm:justify-end">
                    <div className="flex items-center mr-2">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{level.duration} min</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveLevel(index, index - 1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveLevel(index, index + 1)}
                        disabled={index === levels.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLevel(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to remove this level?"
                            )
                          ) {
                            onRemoveLevel(index)
                          }
                        }}
                        disabled={levels.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
