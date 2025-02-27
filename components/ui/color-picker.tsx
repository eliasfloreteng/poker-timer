import React from "react"
import { cn } from "@/lib/utils"

interface ColorOptionProps {
  color: string
  selected: boolean
  onClick: () => void
}

const ColorOption = ({ color, selected, onClick }: ColorOptionProps) => (
  <button
    type="button"
    className={cn(
      color,
      "w-6 h-6 rounded-full border",
      selected && "ring-2 ring-offset-2 ring-black dark:ring-white"
    )}
    onClick={onClick}
  />
)

interface ColorPickerProps {
  selectedColor: string
  onChange: (color: string) => void
}

export function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  const colorOptions = [
    "bg-red-500 border-red-700 text-white",
    "bg-pink-500 border-pink-700 text-white",
    "bg-purple-500 border-purple-700 text-white",
    "bg-blue-500 border-blue-700 text-white",
    "bg-blue-400 border-blue-600 text-white",
    "bg-cyan-500 border-cyan-700 text-white",
    "bg-teal-500 border-teal-700 text-white",
    "bg-green-600 border-green-800 text-white",
    "bg-yellow-500 border-yellow-700 text-black",
    "bg-orange-500 border-orange-700 text-white",
    "bg-amber-500 border-amber-700 text-black",
    "bg-black border-gray-800 text-white",
    "bg-gray-500 border-gray-700 text-white",
    "bg-white border-gray-300 text-black",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {colorOptions.map((color) => (
        <ColorOption
          key={color}
          color={color}
          selected={selectedColor === color}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}
