import type { ChipDenomination } from "@/types/poker-timer"

interface ChipStack {
  denomination: ChipDenomination
  count: number
}

export function calculateChipsForAmount(
  amount: number,
  chipDenominations: ChipDenomination[]
): ChipStack[] {
  if (amount === 0 || chipDenominations.length === 0) return []

  // Sort denominations in descending order
  const sortedDenoms = [...chipDenominations].sort((a, b) => b.value - a.value)

  let remainingAmount = amount
  const chipStacks: ChipStack[] = []

  // Greedy algorithm to find optimal chip combination
  for (const denom of sortedDenoms) {
    if (denom.value <= remainingAmount) {
      const count = Math.floor(remainingAmount / denom.value)
      remainingAmount -= count * denom.value
      chipStacks.push({ denomination: denom, count })
    }
  }

  // If we couldn't represent the amount exactly, try a different approach
  // This could be improved with a more sophisticated algorithm if needed
  if (remainingAmount > 0) {
    // Reset and try a different approach for the last few chips
    return calculateSimpleStack(amount, chipDenominations)
  }

  return chipStacks
}

// Simplified approach that prioritizes using as few chips as possible
function calculateSimpleStack(
  amount: number,
  chipDenominations: ChipDenomination[]
): ChipStack[] {
  const sortedDenoms = [...chipDenominations].sort((a, b) => b.value - a.value)

  let remainingAmount = amount
  const result: ChipStack[] = []

  for (const denom of sortedDenoms) {
    const count = Math.floor(remainingAmount / denom.value)
    if (count > 0) {
      result.push({ denomination: denom, count })
      remainingAmount -= count * denom.value
    }
  }

  // If we still have a remainder, add the smallest chip
  if (remainingAmount > 0 && sortedDenoms.length > 0) {
    const smallestDenom = sortedDenoms[sortedDenoms.length - 1]
    result.push({ denomination: smallestDenom, count: 1 })
  }

  return result
}
