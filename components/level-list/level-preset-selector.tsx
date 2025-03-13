import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
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
import {
  getAllPresets,
  saveCustomPreset,
  updateCustomPreset,
  deleteCustomPreset,
} from "@/lib/preset-manager"
import { Settings2, Save } from "lucide-react"

interface LevelPresetSelectorProps {
  levels: Level[]
  onSelectPreset: (preset: Preset) => void
  onSavePreset: (name: string, levels: Level[]) => void
  onUpdatePreset: (preset: Preset, levels: Level[]) => void
  onDeletePreset: (preset: Preset) => void
}

export function LevelPresetSelector({
  levels,
  onSelectPreset,
  onSavePreset,
  onUpdatePreset,
  onDeletePreset,
}: LevelPresetSelectorProps) {
  const [presets, setPresets] = useState<Preset[]>(() => getAllPresets())
  const [presetName, setPresetName] = useState("")
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [updatingPreset, setUpdatingPreset] = useState<Preset | null>(null)
  const [showUpdateConfirmDialog, setShowUpdateConfirmDialog] = useState(false)

  const refreshPresets = () => {
    setPresets(getAllPresets())
  }

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim(), levels)
      setPresetName("")
      setShowSavePresetDialog(false)
      refreshPresets()
    }
  }

  const handleUpdatePreset = () => {
    if (editingPreset && presetName.trim()) {
      const updatedPreset = {
        ...editingPreset,
        name: presetName.trim(),
      }
      onUpdatePreset(updatedPreset, editingPreset.levels)
      setEditingPreset(null)
      setPresetName("")
      refreshPresets()
    }
  }

  const handleUpdatePresetLevels = () => {
    if (updatingPreset) {
      onUpdatePreset(updatingPreset, levels)
      setUpdatingPreset(null)
      setShowUpdateConfirmDialog(false)
      refreshPresets()
    }
  }

  const openEditPresetDialog = (preset: Preset) => {
    setEditingPreset(preset)
    setPresetName(preset.name)
  }

  const openUpdatePresetDialog = (preset: Preset) => {
    setUpdatingPreset(preset)
    setShowUpdateConfirmDialog(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto">
            <Settings2 className="h-4 w-4 mr-2" />
            Presets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Load Preset</DropdownMenuLabel>
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
            >
              {preset.name}
              {preset.isDefault && " (Default)"}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSavePresetDialog(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save Current Levels as Preset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Preset Dialog */}
      <Dialog
        open={showSavePresetDialog}
        onOpenChange={setShowSavePresetDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Preset</DialogTitle>
            <DialogDescription>
              Save your current levels as a preset for easy reuse.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="presetName">Preset Name</Label>
              <Input
                id="presetName"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., My Custom Tournament"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSavePresetDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePreset}>Save Preset</Button>
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
            <DialogDescription>
              Update the name of your preset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editPresetName">Preset Name</Label>
              <Input
                id="editPresetName"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPreset(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePreset}>Update Preset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Preset Levels Confirmation Dialog */}
      <Dialog
        open={showUpdateConfirmDialog}
        onOpenChange={setShowUpdateConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Preset Levels</DialogTitle>
            <DialogDescription>
              Do you want to update the levels in &quot;
              {updatingPreset?.name}&quot; with your current levels?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUpdatingPreset(null)
                setShowUpdateConfirmDialog(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePresetLevels}>Update Levels</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
