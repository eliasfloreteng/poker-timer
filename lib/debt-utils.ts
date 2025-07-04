import type {
  PokerPlayer,
  PokerSession,
  SessionEntry,
} from "@/types/poker-timer"

/**
 * Format currency in SEK
 */
export function formatSEK(amount: number): string {
  return `${amount.toFixed(2)} SEK`
}

/**
 * Calculate total buy-ins for a session entry
 */
export function calculateTotalBuyIns(buyIns: number[]): number {
  return buyIns.reduce((sum, buyIn) => sum + buyIn, 0)
}

/**
 * Calculate profit for a session entry
 */
export function calculateProfit(buyIns: number[], cashOut: number): number {
  return cashOut - calculateTotalBuyIns(buyIns)
}

/**
 * Calculate total cash on table for a session
 */
export function calculateTotalCashOnTable(
  sessionEntries: SessionEntry[]
): number {
  return sessionEntries.reduce((total, entry) => {
    return total + calculateTotalBuyIns(entry.buyIns)
  }, 0)
}

/**
 * Calculate total cash out for a session
 */
export function calculateTotalCashOut(sessionEntries: SessionEntry[]): number {
  return sessionEntries.reduce((total, entry) => total + entry.cashOut, 0)
}

/**
 * Validate that cash outs match total cash on table minus common expenses
 */
export function validateSession(
  sessionEntries: SessionEntry[],
  commonExpenses: number = 0
): boolean {
  const totalCashOnTable = calculateTotalCashOnTable(sessionEntries)
  const totalCashOut = calculateTotalCashOut(sessionEntries)
  const expectedCashOut = totalCashOnTable - commonExpenses
  return Math.abs(expectedCashOut - totalCashOut) < 0.01 // Allow for small rounding errors
}

/**
 * Update player statistics after a session
 */
export function updatePlayerAfterSession(
  player: PokerPlayer,
  sessionEntry: SessionEntry
): PokerPlayer {
  const totalBuyIns = calculateTotalBuyIns(sessionEntry.buyIns)
  const profit = sessionEntry.profit

  return {
    ...player,
    netProfitLoss: player.netProfitLoss + profit,
    sessionsPlayed: player.sessionsPlayed + 1,
    totalBuyIns: player.totalBuyIns + totalBuyIns,
    totalCashOuts: player.totalCashOuts + sessionEntry.cashOut,
  }
}

/**
 * Calculate all-time profit/loss for a player
 */
export function calculatePlayerProfitLoss(player: PokerPlayer): number {
  return player.totalCashOuts - player.totalBuyIns
}

/**
 * Get player's biggest session win from sessions
 */
export function getBiggestSessionWin(
  playerId: string,
  sessions: PokerSession[]
): { profit: number; date: string } | null {
  let biggestWin = { profit: -Infinity, date: "" }

  sessions.forEach((session) => {
    const playerEntry = session.players.find((p) => p.playerId === playerId)
    if (playerEntry && playerEntry.profit > biggestWin.profit) {
      biggestWin = { profit: playerEntry.profit, date: session.date }
    }
  })

  return biggestWin.profit === -Infinity ? null : biggestWin
}

/**
 * Get leaderboard data sorted by profit/loss
 */
export function getLeaderboardData(
  players: PokerPlayer[],
  sessions: PokerSession[]
): Array<PokerPlayer & { profitLoss: number; biggestWin: number }> {
  return players
    .map((player) => {
      const profitLoss = calculatePlayerProfitLoss(player)
      const biggestWin = getBiggestSessionWin(player.id, sessions)

      return {
        ...player,
        profitLoss,
        biggestWin: biggestWin?.profit || 0,
      }
    })
    .sort((a, b) => b.profitLoss - a.profitLoss)
}

/**
 * Get leaderboard data filtered by session type
 */
export function getLeaderboardDataByType(
  players: PokerPlayer[],
  sessions: PokerSession[],
  sessionType: "cash" | "tournament"
): Array<
  PokerPlayer & {
    profitLoss: number
    biggestWin: number
    sessionsPlayed: number
  }
> {
  const filteredSessions = sessions.filter((s) => s.type === sessionType)

  return players
    .map((player) => {
      // Calculate stats only from sessions of the specified type
      const playerSessions = filteredSessions.filter((session) =>
        session.players.some((p) => p.playerId === player.id)
      )

      let totalProfit = 0
      let biggestWin = 0

      playerSessions.forEach((session) => {
        const playerEntry = session.players.find(
          (p) => p.playerId === player.id
        )
        if (playerEntry) {
          totalProfit += playerEntry.profit
          if (playerEntry.profit > biggestWin) {
            biggestWin = playerEntry.profit
          }
        }
      })

      return {
        ...player,
        profitLoss: totalProfit,
        biggestWin,
        sessionsPlayed: playerSessions.length,
      }
    })
    .filter((player) => player.sessionsPlayed > 0) // Only include players who have played this session type
    .sort((a, b) => b.profitLoss - a.profitLoss)
}

/**
 * Get biggest session wins filtered by session type
 */
export function getBiggestSessionWinsByType(
  sessions: PokerSession[],
  sessionType: "cash" | "tournament",
  limit: number = 10
): Array<{
  playerName: string
  profit: number
  date: string
  sessionType: "cash" | "tournament"
}> {
  const filteredSessions = sessions.filter((s) => s.type === sessionType)
  return getBiggestSessionWins(filteredSessions, limit)
}

/**
 * Get biggest session wins across all players
 */
export function getBiggestSessionWins(
  sessions: PokerSession[],
  limit: number = 10
): Array<{
  playerName: string
  profit: number
  date: string
  sessionType: "cash" | "tournament"
}> {
  const allWins: Array<{
    playerName: string
    profit: number
    date: string
    sessionType: "cash" | "tournament"
  }> = []

  sessions.forEach((session) => {
    session.players.forEach((player) => {
      if (player.profit > 0) {
        allWins.push({
          playerName: player.playerName,
          profit: player.profit,
          date: session.date,
          sessionType: session.type,
        })
      }
    })
  })

  return allWins.sort((a, b) => b.profit - a.profit).slice(0, limit)
}
