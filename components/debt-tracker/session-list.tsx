"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Calendar,
  Coins,
  Trophy,
  Edit,
} from "lucide-react"
import type { PokerSession } from "@/types/poker-timer"
import { formatSEK } from "@/lib/debt-utils"

interface SessionListProps {
  sessions: PokerSession[]
  onDeleteSession: (sessionId: string) => void
  onEditSession: (sessionId: string) => void
}

interface SessionCardProps {
  session: PokerSession
  onDelete: (sessionId: string) => void
  onEdit: (sessionId: string) => void
}

function SessionCard({ session, onDelete, onEdit }: SessionCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Calculate session statistics
  const winners = session.players.filter((p) => p.profit > 0)
  const losers = session.players.filter((p) => p.profit < 0)
  const biggestWinner = session.players.reduce((max, player) =>
    player.profit > max.profit ? player : max
  )
  const biggestLoser = session.players.reduce((min, player) =>
    player.profit < min.profit ? player : min
  )

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {session.date}
                    {session.type === "tournament" ? (
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Coins className="h-4 w-4 text-green-600" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {session.type === "tournament" ? "Tournament" : "Cash Game"}{" "}
                    • {session.players.length} players •{" "}
                    {formatSEK(session.totalCashOnTable)} total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {winners.length} winner{winners.length !== 1 ? "s" : ""}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(session.id)
                  }}
                  title="Edit session"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                      title="Delete session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Session</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this session from{" "}
                        {session.date}? This action cannot be undone and will
                        affect all player statistics.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(session.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Session Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Biggest Winner
                  </p>
                  <p className="text-lg">
                    {biggestWinner.playerName} (+
                    {formatSEK(biggestWinner.profit)})
                  </p>
                </div>
                {biggestLoser.profit < 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      Biggest Loser
                    </p>
                    <p className="text-lg">
                      {biggestLoser.playerName} (
                      {formatSEK(biggestLoser.profit)})
                    </p>
                  </div>
                )}
              </div>

              {/* Player Results */}
              <div className="space-y-2">
                <h4 className="font-medium">Player Results</h4>
                <div className="space-y-2">
                  {session.players
                    .sort((a, b) => b.profit - a.profit)
                    .map((player) => (
                      <div
                        key={player.playerId}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{player.playerName}</p>
                          <p className="text-sm text-muted-foreground">
                            Buy-ins:{" "}
                            {player.buyIns
                              .map((buyIn) => formatSEK(buyIn))
                              .join(", ")}
                            {player.buyIns.length > 1 && (
                              <span className="ml-2">
                                (Total:{" "}
                                {formatSEK(
                                  player.buyIns.reduce(
                                    (sum, buyIn) => sum + buyIn,
                                    0
                                  )
                                )}
                                )
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cash out: {formatSEK(player.cashOut)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              player.profit >= 0 ? "default" : "destructive"
                            }
                            className="text-lg px-3 py-1"
                          >
                            {player.profit >= 0 ? "+" : ""}
                            {formatSEK(player.profit)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Session Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
                <div>
                  <p className="text-muted-foreground">Total Cash on Table</p>
                  <p className="font-medium">
                    {formatSEK(session.totalCashOnTable)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Common Expenses</p>
                  <p className="font-medium">
                    {formatSEK(session.commonExpenses || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expected Cash Out</p>
                  <p className="font-medium">
                    {formatSEK(
                      session.totalCashOnTable - (session.commonExpenses || 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Actual Cash Out</p>
                  <p className="font-medium">
                    {formatSEK(
                      session.players.reduce((sum, p) => sum + p.cashOut, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export function SessionList({
  sessions,
  onDeleteSession,
  onEditSession,
}: SessionListProps) {
  // Sort sessions by date (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => {
    // Parse the date strings (format: "January 1st, 2024")
    const dateA = new Date(a.date.replace(/(\d+)(st|nd|rd|th)/, "$1"))
    const dateB = new Date(b.date.replace(/(\d+)(st|nd|rd|th)/, "$1"))
    return dateB.getTime() - dateA.getTime()
  })

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No sessions recorded yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first session to start tracking poker profits and losses
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Session History</h2>
        <Badge variant="secondary">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedSessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={onDeleteSession}
            onEdit={onEditSession}
          />
        ))}
      </div>
    </div>
  )
}
