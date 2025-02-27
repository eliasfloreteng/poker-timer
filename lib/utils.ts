import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`
  }
  return amount.toString()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
