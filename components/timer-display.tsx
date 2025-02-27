import { formatTime } from "@/lib/utils"
import type { Level } from "@/types/poker-timer"
import { Progress } from "@/components/ui/progress"

interface TimerDisplayProps {
  level: Level
  timeRemaining: number
  currentLevelIndex: number
  totalLevels: number
}

export function TimerDisplay({ level, timeRemaining, currentLevelIndex, totalLevels }: TimerDisplayProps) {
  if (!level) return null

  const totalSeconds = level.duration * 60
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100
  const isWarning = timeRemaining <= 60 && !level.isBreak

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-muted-foreground mb-1">
        Level {level.isBreak ? "Break" : currentLevelIndex + 1} of {totalLevels}
      </div>

      <div className={`text-5xl md:text-7xl font-bold mb-2 ${isWarning ? "text-destructive animate-pulse" : ""}`}>
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

          {level.ante > 0 && <div className="text-lg font-medium text-muted-foreground">Ante: {level.ante}</div>}
        </div>
      )}
    </div>
  )
}

