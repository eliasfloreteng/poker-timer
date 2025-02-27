import React from "react"
import { cn } from "@/lib/utils"

interface ChipIconProps {
  value: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const colorMap: Record<number, string> = {
  10: "bg-red-500 border-red-700 text-white",
  20: "bg-purple-500 border-purple-700 text-white",
  50: "bg-green-600 border-green-800 text-white",
  100: "bg-blue-400 border-blue-600 text-white",
  500: "bg-black border-gray-800 text-white",
}

export function ChipIcon({ value, size = "md", className }: ChipIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  }

  // Default to black if value doesn't have a defined color
  const chipColor = colorMap[value] || "bg-gray-500 border-gray-700 text-white"

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold border-2 shadow",
        chipColor,
        sizeClasses[size],
        className
      )}
    >
      {value}
    </div>
  )
}
