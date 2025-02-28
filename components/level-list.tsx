"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import type { Level, Preset } from "@/types/poker-timer"
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
  Save,
  MoreVertical,
} from "lucide-react"
import {
  getAllPresets,
  saveCustomPreset,
  updateCustomPreset,
  deleteCustomPreset,
} from "@/lib/preset-manager"

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
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [presets, setPresets] = useState<Preset[]>(() => getAllPresets())
  const [updatingPreset, setUpdatingPreset] = useState<Preset | null>(null)
  const [showUpdateConfirmDialog, setShowUpdateConfirmDialog] = useState(false)

  const refreshPresets = () => {
    setPresets(getAllPresets())
  }

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

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset)
    setShowConfirmDialog(true)
  }

  const applyPreset = () => {
    if (!selectedPreset) return

    // Update levels with the selected preset
    onUpdateLevels(selectedPreset.levels)

    setShowConfirmDialog(false)
    setSelectedPreset(null)
  }

  const handleSavePreset = () => {
    if (!presetName.trim()) return

    const newPreset = saveCustomPreset(presetName, levels)
    refreshPresets()
    setShowSavePresetDialog(false)
    setPresetName("")
  }

  const handleUpdatePreset = () => {
    if (!editingPreset || !presetName.trim()) return

    updateCustomPreset(editingPreset.id, presetName)
    refreshPresets()
    setEditingPreset(null)
    setPresetName("")
  }

  const handleUpdatePresetLevels = () => {
    if (!updatingPreset) return

    // Update both name and levels
    updateCustomPreset(updatingPreset.id, updatingPreset.name, levels)
    refreshPresets()
    setUpdatingPreset(null)
    setShowUpdateConfirmDialog(false)
  }

  const handleDeletePreset = (preset: Preset) => {
    if (preset.isDefault) return // Can't delete default presets

    if (
      confirm(`Are you sure you want to delete the preset "${preset.name}"?`)
    ) {
      deleteCustomPreset(preset.id)
      refreshPresets()
    }
  }

  const openEditPresetDialog = (preset: Preset) => {
    if (preset.isDefault) return // Can't edit default presets

    setEditingPreset(preset)
    setPresetName(preset.name)
  }

  const openUpdatePresetDialog = (preset: Preset) => {
    if (preset.isDefault) return // Can't update default presets

    setUpdatingPreset(preset)
    setShowUpdateConfirmDialog(true)
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
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Built-in Presets</DropdownMenuLabel>
              {presets
                .filter((p) => p.isDefault)
                .map((preset) => (
                  <DropdownMenuItem
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.name}
                  </DropdownMenuItem>
                ))}

              {presets.some((p) => !p.isDefault) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Your Custom Presets</DropdownMenuLabel>
                  {presets
                    .filter((p) => !p.isDefault)
                    .map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between px-2"
                      >
                        <DropdownMenuItem
                          onClick={() => handlePresetSelect(preset)}
                          className="flex-1"
                        >
                          {preset.name}
                        </DropdownMenuItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openUpdatePresetDialog(preset)}
                            >
                              <Save className="h-4 w-4 mr-2" /> Update with
                              Current Structure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditPresetDialog(preset)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Rename Preset
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeletePreset(preset)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Preset
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowSavePresetDialog(true)}>
                <Save className="h-4 w-4 mr-2" /> Save Current Structure as New
                Preset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAddLevel} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Level
          </Button>
        </div>
      </div>

      {/* Load Preset Confirmation Dialog */}
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

      {/* Save Preset Dialog */}
      <Dialog
        open={showSavePresetDialog}
        onOpenChange={setShowSavePresetDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Preset</DialogTitle>
            <DialogDescription>
              Save your current tournament structure as a custom preset.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="preset-name">Preset Name</Label>
            <Input
              id="preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSavePresetDialog(false)
                setPresetName("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePreset}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Preset Dialog */}
      <Dialog
        open={!!editingPreset}
        onOpenChange={(open) => !open && setEditingPreset(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Preset</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-preset-name">Preset Name</Label>
            <Input
              id="edit-preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingPreset(null)
                setPresetName("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePreset}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Preset Confirmation Dialog */}
      <AlertDialog
        open={showUpdateConfirmDialog}
        onOpenChange={setShowUpdateConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Preset</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite the levels in "{updatingPreset?.name}" with
              your current tournament structure. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUpdatingPreset(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdatePresetLevels}>
              Update
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
                          onRemoveLevel(index)
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
