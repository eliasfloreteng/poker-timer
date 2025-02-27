import { formatTime } from "@/lib/utils"
import { calculateChipsForAmount } from "@/lib/chip-utils"
import type { Level } from "@/types/poker-timer"
import { Progress } from "@/components/ui/progress"
import { ChipIcon } from "@/components/ui/chip-icon"

interface TimerDisplayProps {
  level: Level
  timeRemaining: number
  currentLevelIndex: number
  totalLevels: number
  chipDenominations: number[]
}

export function TimerDisplay({
  level,
  timeRemaining,
  currentLevelIndex,
  totalLevels,
  chipDenominations,
}: TimerDisplayProps) {
  if (!level) return null

  const totalSeconds = level.duration * 60
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100
  const isWarning = timeRemaining <= 60 && !level.isBreak

  // Calculate chips required for small blind and big blind
  const smallBlindChips = level.isBreak
    ? []
    : calculateChipsForAmount(level.smallBlind, chipDenominations)
  const bigBlindChips = level.isBreak
    ? []
    : calculateChipsForAmount(level.bigBlind, chipDenominations)
  const anteChips =
    level.isBreak || level.ante === 0
      ? []
      : calculateChipsForAmount(level.ante, chipDenominations)

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-muted-foreground mb-1">
        Level {level.isBreak ? "Break" : currentLevelIndex + 1} of {totalLevels}
      </div>

      <div
        className={`text-5xl md:text-7xl font-bold mb-2 ${
          isWarning ? "text-destructive animate-pulse" : ""
        }`}
      >
        {formatTime(timeRemaining)}
      </div>

      <Progress value={progress} className="h-2 w-full mb-4" />

      {level.isBreak ? (
        <div className="text-xl font-semibold">Break Time</div>
      ) : (
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-semibold mb-1">
            {level.smallBlind} / {level.bigBlind}
          </div>

          {level.ante > 0 && (
            <div className="text-lg font-medium text-muted-foreground mb-2">
              Ante: {level.ante}
            </div>
          )}

          {/* Display chips for small blind */}
          {smallBlindChips.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-1">
                Small Blind
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {smallBlindChips.map((chip, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <ChipIcon value={chip.denomination} size="sm" />
                    {chip.count > 1 && <span>x{chip.count}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display chips for big blind */}
          {bigBlindChips.length > 0 && (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground mb-1">
                Big Blind
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {bigBlindChips.map((chip, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <ChipIcon value={chip.denomination} size="sm" />
                    {chip.count > 1 && <span>x{chip.count}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display chips for ante */}
          {anteChips.length > 0 && (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground mb-1">Ante</div>
              <div className="flex flex-wrap justify-center gap-2">
                {anteChips.map((chip, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <ChipIcon value={chip.denomination} size="sm" />
                    {chip.count > 1 && <span>x{chip.count}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
