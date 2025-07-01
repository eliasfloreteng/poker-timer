"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, TrendingDown, Target, Coins } from "lucide-react"
import type { PokerPlayer, PokerSession } from "@/types/poker-timer"
import {
  formatSEK,
  getLeaderboardData,
  getLeaderboardDataByType,
  getBiggestSessionWins,
  getBiggestSessionWinsByType,
  calculatePlayerProfitLoss,
} from "@/lib/debt-utils"

interface LeaderboardProps {
  players: PokerPlayer[]
  sessions: PokerSession[]
}

export function Leaderboard({ players, sessions }: LeaderboardProps) {
  const leaderboardData = getLeaderboardData(players, sessions)
  const biggestWins = getBiggestSessionWins(sessions, 10)

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No players to display</p>
          <p className="text-sm text-muted-foreground">
            Add players and sessions to see the leaderboard
          </p>
        </CardContent>
      </Card>
    )
  }

  const winners = leaderboardData.filter((p) => p.profitLoss > 0)
  const losers = leaderboardData.filter((p) => p.profitLoss < 0)
  const breakEven = leaderboardData.filter((p) => p.profitLoss === 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className="flex gap-2">
          <Badge variant="default">{winners.length} winners</Badge>
          <Badge variant="destructive">{losers.length} losers</Badge>
          {breakEven.length > 0 && (
            <Badge variant="secondary">{breakEven.length} break-even</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="cash">Cash Games</TabsTrigger>
          <TabsTrigger value="tournament">Tournaments</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats">Player Stats</TabsTrigger>
              <TabsTrigger value="wins">Biggest Wins</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4">
              {/* Top 3 Podium */}
              {leaderboardData.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {leaderboardData.slice(0, 3).map((player, index) => (
                    <Card
                      key={player.id}
                      className={`relative ${
                        index === 0
                          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                          : index === 1
                          ? "border-gray-400 bg-gray-50 dark:bg-gray-950/20"
                          : "border-amber-600 bg-amber-50 dark:bg-amber-950/20"
                      }`}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-2">
                          {index === 0 && (
                            <Trophy className="h-8 w-8 text-yellow-500" />
                          )}
                          {index === 1 && (
                            <Trophy className="h-8 w-8 text-gray-400" />
                          )}
                          {index === 2 && (
                            <Trophy className="h-8 w-8 text-amber-600" />
                          )}
                        </div>
                        <div className="text-2xl">{player.emoji}</div>
                        <CardTitle className="text-lg">{player.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-xl font-bold">
                          <span
                            className={
                              player.profitLoss >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {player.profitLoss >= 0 ? "+" : ""}
                            {formatSEK(player.profitLoss)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {player.sessionsPlayed} sessions
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Full Rankings Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">
                          Profit/Loss
                        </TableHead>
                        <TableHead className="text-right">Sessions</TableHead>
                        <TableHead className="text-right">
                          Avg/Session
                        </TableHead>
                        <TableHead className="text-right">Net Loss</TableHead>
                        <TableHead className="text-right">
                          Biggest Win
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((player, index) => {
                        const avgPerSession =
                          player.sessionsPlayed > 0
                            ? player.profitLoss / player.sessionsPlayed
                            : 0

                        return (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">
                              #{index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{player.emoji}</span>
                                <span className="font-medium">
                                  {player.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {player.profitLoss > 0 && (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                )}
                                {player.profitLoss < 0 && (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span
                                  className={`font-medium ${
                                    player.profitLoss >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {player.profitLoss >= 0 ? "+" : ""}
                                  {formatSEK(player.profitLoss)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {player.sessionsPlayed}
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`${
                                  avgPerSession >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {avgPerSession >= 0 ? "+" : ""}
                                {formatSEK(avgPerSession)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`${
                                  player.netProfitLoss < 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {player.netProfitLoss < 0
                                  ? formatSEK(Math.abs(player.netProfitLoss))
                                  : "-"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {player.biggestWin > 0 ? (
                                <span className="text-green-600">
                                  +{formatSEK(player.biggestWin)}
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Biggest Session Wins (All Sessions)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {biggestWins.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No profitable sessions recorded yet
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">Rank</TableHead>
                          <TableHead>Player</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Session Type</TableHead>
                          <TableHead className="text-right">
                            Win Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {biggestWins.map((win, index) => (
                          <TableRow
                            key={`${win.playerName}-${win.date}-${index}`}
                          >
                            <TableCell className="font-medium">
                              #{index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {win.playerName}
                            </TableCell>
                            <TableCell>{win.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {win.sessionType === "tournament" ? (
                                  <Trophy className="h-4 w-4 text-yellow-600" />
                                ) : (
                                  <Coins className="h-4 w-4 text-green-600" />
                                )}
                                <span className="text-sm">
                                  {win.sessionType === "tournament"
                                    ? "Tournament"
                                    : "Cash Game"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-green-600 font-medium">
                                +{formatSEK(win.profit)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {biggestWins.length > 0
                          ? formatSEK(biggestWins[0].profit)
                          : "0.00 SEK"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Biggest Win Ever
                      </p>
                      {biggestWins.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {biggestWins[0].playerName} on {biggestWins[0].date}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{sessions.length}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Sessions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {formatSEK(
                          sessions.reduce(
                            (total, session) =>
                              total + session.totalCashOnTable,
                            0
                          )
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Money Played
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="cash" className="space-y-4">
          <CashGameLeaderboard players={players} sessions={sessions} />
        </TabsContent>

        <TabsContent value="tournament" className="space-y-4">
          <TournamentLeaderboard players={players} sessions={sessions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component for Cash Game specific leaderboard
function CashGameLeaderboard({
  players,
  sessions,
}: {
  players: PokerPlayer[]
  sessions: PokerSession[]
}) {
  const cashGameData = getLeaderboardDataByType(players, sessions, "cash")
  const cashGameWins = getBiggestSessionWinsByType(sessions, "cash", 10)

  if (cashGameData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No cash game data available
          </p>
          <p className="text-sm text-muted-foreground">
            Add some cash game sessions to see statistics
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stats">Cash Game Stats</TabsTrigger>
        <TabsTrigger value="wins">Biggest Wins</TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cash Game Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Avg/Session</TableHead>
                  <TableHead className="text-right">Biggest Win</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashGameData.map((player, index) => {
                  const avgPerSession =
                    player.sessionsPlayed > 0
                      ? player.profitLoss / player.sessionsPlayed
                      : 0

                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{player.emoji}</span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            player.profitLoss >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {player.profitLoss >= 0 ? "+" : ""}
                          {formatSEK(player.profitLoss)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {player.sessionsPlayed}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`${
                            avgPerSession >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {avgPerSession >= 0 ? "+" : ""}
                          {formatSEK(avgPerSession)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {player.biggestWin > 0 ? (
                          <span className="text-green-600">
                            +{formatSEK(player.biggestWin)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wins" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Biggest Cash Game Wins</CardTitle>
          </CardHeader>
          <CardContent>
            {cashGameWins.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No profitable cash game sessions recorded yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Win Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashGameWins.map((win, index) => (
                    <TableRow key={`${win.playerName}-${win.date}-${index}`}>
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {win.playerName}
                      </TableCell>
                      <TableCell>{win.date}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-600 font-medium">
                          +{formatSEK(win.profit)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Component for Tournament specific leaderboard
function TournamentLeaderboard({
  players,
  sessions,
}: {
  players: PokerPlayer[]
  sessions: PokerSession[]
}) {
  const tournamentData = getLeaderboardDataByType(
    players,
    sessions,
    "tournament"
  )
  const tournamentWins = getBiggestSessionWinsByType(sessions, "tournament", 10)

  if (tournamentData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No tournament data available
          </p>
          <p className="text-sm text-muted-foreground">
            Add some tournament sessions to see statistics
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stats">Tournament Stats</TabsTrigger>
        <TabsTrigger value="wins">Biggest Wins</TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tournament Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Avg/Session</TableHead>
                  <TableHead className="text-right">Biggest Win</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournamentData.map((player, index) => {
                  const avgPerSession =
                    player.sessionsPlayed > 0
                      ? player.profitLoss / player.sessionsPlayed
                      : 0

                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{player.emoji}</span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            player.profitLoss >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {player.profitLoss >= 0 ? "+" : ""}
                          {formatSEK(player.profitLoss)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {player.sessionsPlayed}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`${
                            avgPerSession >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {avgPerSession >= 0 ? "+" : ""}
                          {formatSEK(avgPerSession)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {player.biggestWin > 0 ? (
                          <span className="text-green-600">
                            +{formatSEK(player.biggestWin)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wins" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Biggest Tournament Wins</CardTitle>
          </CardHeader>
          <CardContent>
            {tournamentWins.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No profitable tournament sessions recorded yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Win Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentWins.map((win, index) => (
                    <TableRow key={`${win.playerName}-${win.date}-${index}`}>
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {win.playerName}
                      </TableCell>
                      <TableCell>{win.date}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-600 font-medium">
                          +{formatSEK(win.profit)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
