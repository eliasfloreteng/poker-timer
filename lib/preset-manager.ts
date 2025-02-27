import { Level, Preset } from "@/types/poker-timer"
import { defaultPresets } from "@/lib/default-data"

const CUSTOM_PRESETS_KEY = "poker-timer-custom-presets"

// Generate a unique ID for new presets
export const generatePresetId = (): string => {
  return `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Get all presets (defaults + custom)
export const getAllPresets = (): Preset[] => {
  const customPresets = getCustomPresets()
  return [...defaultPresets, ...customPresets]
}

// Get custom presets from local storage
export const getCustomPresets = (): Preset[] => {
  if (typeof window === "undefined") {
    return [] // Return empty if running on server
  }

  const savedPresets = localStorage.getItem(CUSTOM_PRESETS_KEY)
  if (!savedPresets) {
    return []
  }

  try {
    return JSON.parse(savedPresets)
  } catch (error) {
    console.error("Error parsing custom presets:", error)
    return []
  }
}

// Save a custom preset
export const saveCustomPreset = (name: string, levels: Level[]): Preset => {
  const preset: Preset = {
    id: generatePresetId(),
    name,
    levels,
    isDefault: false,
  }

  const customPresets = getCustomPresets()
  const updatedPresets = [...customPresets, preset]

  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets))
  return preset
}

// Update a custom preset
export const updateCustomPreset = (
  id: string,
  name: string,
  levels?: Level[]
): Preset | null => {
  const customPresets = getCustomPresets()
  const presetIndex = customPresets.findIndex((p) => p.id === id)

  if (presetIndex === -1) {
    return null
  }

  const updatedPreset = {
    ...customPresets[presetIndex],
    name,
    ...(levels && { levels }),
  }

  customPresets[presetIndex] = updatedPreset
  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets))

  return updatedPreset
}

// Delete a custom preset
export const deleteCustomPreset = (id: string): boolean => {
  const customPresets = getCustomPresets()
  const filteredPresets = customPresets.filter((p) => p.id !== id)

  if (filteredPresets.length === customPresets.length) {
    return false // No preset was removed
  }

  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(filteredPresets))
  return true
}
