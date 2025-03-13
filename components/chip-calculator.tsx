"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChipIcon } from "@/components/ui/chip-icon"
import type { ChipDenomination } from "@/types/poker-timer"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface ChipCount {
  denomination: ChipDenomination
  count: number
}

interface ChipCalculatorProps {
  chipDenominations?: ChipDenomination[]
}

export function ChipCalculator({
  chipDenominations = [
    { value: 10, color: "bg-red-500 border-red-700 text-white" },
    { value: 20, color: "bg-purple-500 border-purple-700 text-white" },
    { value: 50, color: "bg-green-600 border-green-800 text-white" },
    { value: 100, color: "bg-blue-400 border-blue-600 text-white" },
    { value: 500, color: "bg-black border-gray-800 text-white" },
  ],
}: ChipCalculatorProps) {
  const defaultChips = chipDenominations.map((denomination) => ({
    denomination,
    count: 0,
  }))

  const [chips, setChips] = useLocalStorage<ChipCount[]>(
    "chip-calculator",
    defaultChips
  )
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array with the correct length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, chips.length)
  }, [chips.length])

  // Update chips when denominations change
  useEffect(() => {
    setChips((currentChips) => {
      // Keep existing counts when possible, set to 0 for new denominations
      const newChips = chipDenominations.map((denomination) => {
        const existingChip = currentChips.find(
          (chip) => chip.denomination.value === denomination.value
        )
        return existingChip || { denomination, count: 0 }
      })

      // Only update if the structure has changed
      const hasChanged =
        JSON.stringify(newChips.map((c) => c.denomination.value)) !==
        JSON.stringify(currentChips.map((c) => c.denomination.value))

      return hasChanged ? newChips : currentChips
    })
  }, [chipDenominations, setChips])

  // Calculate total value
  const totalValue = chips.reduce(
    (sum, chip) => sum + chip.denomination.value * chip.count,
    0
  )

  // Reset all chip counts to zero
  const resetChips = () => {
    setChips((currentChips) =>
      currentChips.map((chip) => ({ ...chip, count: 0 }))
    )
  }

  // Handle chip count change
  const handleChipCountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCount = parseInt(e.target.value) || 0
    setChips((currentChips) =>
      currentChips.map((chip, i) =>
        i === index ? { ...chip, count: newCount } : chip
      )
    )
  }

  // Handle Enter key press to move to next input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const nextIndex = (index + 1) % chips.length
      inputRefs.current[nextIndex]?.focus()
    }
  }

  // Handle input focus to select all text
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Chip Counter</CardTitle>
          <Button variant="outline" onClick={resetChips}>
            Reset Counts
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {chips.map((chip, index) => (
              <div key={chip.denomination.value} className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChipIcon
                    value={chip.denomination.value}
                    color={chip.denomination.color}
                    size="sm"
                  />
                  <Label htmlFor={`chip-${chip.denomination.value}`}>
                    {chip.denomination.value} Chips
                  </Label>
                </div>
                <Input
                  id={`chip-${chip.denomination.value}`}
                  type="number"
                  min="0"
                  value={chip.count}
                  onChange={(e) => handleChipCountChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={handleFocus}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <h3 className="text-lg font-medium">Total Value</h3>
            <p className="text-2xl font-bold">{totalValue}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
