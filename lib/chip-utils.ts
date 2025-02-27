export function calculateChipsForAmount(
  amount: number,
  denominations: number[]
): { denomination: number; count: number }[] {
  // Sort denominations from highest to lowest
  const sortedDenominations = [...denominations].sort((a, b) => b - a)

  let remaining = amount
  const result = sortedDenominations.map((denom) => {
    const count = Math.floor(remaining / denom)
    remaining -= count * denom
    return { denomination: denom, count }
  })

  // Filter out denominations with zero count
  return result.filter((item) => item.count > 0)
}
