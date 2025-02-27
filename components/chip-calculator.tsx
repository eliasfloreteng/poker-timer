"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChipIcon } from "@/components/ui/chip-icon"

interface ChipCount {
  denomination: number
  count: number
}

export function ChipCalculator() {
  const defaultChips = [
    { denomination: 10, count: 0 },
    { denomination: 20, count: 0 },
    { denomination: 50, count: 0 },
    { denomination: 100, count: 0 },
    { denomination: 500, count: 0 },
  ]

  const [chips, setChips] = useState<ChipCount[]>(defaultChips)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array with the correct length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, chips.length)
  }, [chips.length])

  // Calculate total value
  const totalValue = chips.reduce(
    (sum, chip) => sum + chip.denomination * chip.count,
    0
  )

  // Reset all chip counts to zero
  const resetChips = () => {
    setChips(chips.map((chip) => ({ ...chip, count: 0 })))
  }

  // Handle chip count change
  const handleChipCountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCount = parseInt(e.target.value) || 0
    setChips(
      chips.map((chip, i) =>
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
              <div key={chip.denomination} className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChipIcon value={chip.denomination} size="sm" />
                  <Label htmlFor={`chip-${chip.denomination}`}>
                    {chip.denomination} Chips
                  </Label>
                </div>
                <Input
                  id={`chip-${chip.denomination}`}
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
