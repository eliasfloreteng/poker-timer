import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { Level, Preset } from "@/types/poker-timer"
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Coffee,
  Edit,
  Plus,
  Trash2,
  MoreVertical,
} from "lucide-react"
import {
  saveCustomPreset,
  updateCustomPreset,
  deleteCustomPreset,
} from "@/lib/preset-manager"
import { LevelEditorModal } from "./level-editor-modal"
import { LevelPresetSelector } from "./level-preset-selector"

interface LevelListProps {
  levels: Level[]
  currentLevelIndex: number
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
  onUpdateLevel,
  onAddLevel,
  onRemoveLevel,
  onMoveLevel,
  onSelectLevel,
  onUpdateLevels,
}: LevelListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddingLevel, setIsAddingLevel] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
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
    if (isAddingLevel) {
      onAddLevel(level)
    } else if (editingIndex !== null) {
      onUpdateLevel(level, editingIndex)
    }
    setIsAddingLevel(false)
    setEditingIndex(null)
  }

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset)
    setShowConfirmDialog(true)
  }

  const applyPreset = () => {
    if (selectedPreset) {
      onUpdateLevels(selectedPreset.levels)
      setShowConfirmDialog(false)
      setSelectedPreset(null)
    }
  }

  const handleSavePreset = (name: string, levels: Level[]) => {
    saveCustomPreset(name, levels)
  }

  const handleUpdatePreset = (preset: Preset, levels: Level[]) => {
    updateCustomPreset(preset.id, preset.name, levels)
  }

  const handleDeletePreset = (preset: Preset) => {
    deleteCustomPreset(preset.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tournament Levels</h2>
          <p className="text-muted-foreground">
            Configure the blind structure for your tournament
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleAddLevel} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Level
          </Button>

          <LevelPresetSelector
            levels={levels}
            onSelectPreset={handlePresetSelect}
            onSavePreset={handleSavePreset}
            onUpdatePreset={handleUpdatePreset}
            onDeletePreset={handleDeletePreset}
          />
        </div>
      </div>

      <div className="space-y-2">
        {levels.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              No levels configured. Add a level to get started.
            </p>
          </div>
        ) : (
          levels.map((level, index) => (
            <Card
              key={index}
              className={`${
                currentLevelIndex === index ? "border-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {level.isBreak ? (
                      <Coffee className="h-5 w-5 text-primary" />
                    ) : (
                      <Clock className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <h3 className="font-medium">
                        {level.isBreak
                          ? "Break"
                          : `Level ${index + 1}: ${level.smallBlind}/${
                              level.bigBlind
                            }`}
                        {level.ante > 0 && ` + ${level.ante} ante`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {level.duration} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMoveLevel(index, index - 1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index !== levels.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMoveLevel(index, index + 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditLevel(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onRemoveLevel(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        currentLevelIndex === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => onSelectLevel(index)}
                    >
                      {currentLevelIndex === index ? "Current" : "Go to level"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Level editor modal */}
      <LevelEditorModal
        isOpen={isAddingLevel || editingIndex !== null}
        onClose={() => {
          setIsAddingLevel(false)
          setEditingIndex(null)
        }}
        title={isAddingLevel ? "Add Level" : "Edit Level"}
        level={
          isAddingLevel
            ? {
                smallBlind: 25,
                bigBlind: 50,
                ante: 0,
                duration: 15,
                isBreak: false,
              }
            : editingIndex !== null
            ? levels[editingIndex]
            : null
        }
        isNewLevel={isAddingLevel}
        onSave={handleSaveLevel}
      />

      {/* Preset confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Preset</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all current levels with the preset &quot;
              {selectedPreset?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowConfirmDialog(false)
                setSelectedPreset(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={applyPreset}>Apply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
