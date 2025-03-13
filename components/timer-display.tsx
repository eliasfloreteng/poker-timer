import { formatTime } from "@/lib/utils"
import type { Level } from "@/types/poker-timer"
import { Progress } from "@/components/ui/progress"

interface TimerDisplayProps {
  level: Level
  timeRemaining: number
  isRunning: boolean
}

export function TimerDisplay({
  level,
  timeRemaining,
  isRunning,
}: TimerDisplayProps) {
  if (!level) return null

  const totalSeconds = level.duration * 60
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100
  const isWarning = timeRemaining <= 60 && !level.isBreak

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-muted-foreground mb-1">
        {level.isBreak ? "Break" : "Level"}
      </div>

      <div
        className={`text-5xl md:text-7xl font-bold mb-2 md:mb-4 ${
          isWarning ? "text-red-500 animate-pulse" : ""
        }`}
      >
        {formatTime(timeRemaining)}
      </div>

      <Progress value={progress} className="w-full h-2 mb-4 md:mb-6" />

      {level.isBreak ? (
        <div className="text-xl font-medium">Break Time!</div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl md:text-2xl font-medium">
            {level.smallBlind}/{level.bigBlind}
            {level.ante > 0 && ` + ${level.ante}`}
          </div>
          <div className="text-sm text-muted-foreground">
            Small Blind / Big Blind {level.ante > 0 ? "+ Ante" : ""}
          </div>
        </div>
      )}
    </div>
  )
}
