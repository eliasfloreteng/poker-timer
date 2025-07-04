"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { PokerPlayer, PokerSession } from "@/types/poker-timer"
import { PlayerProfiles } from "./player-profiles"
import { SessionForm } from "./session-form"
import { SessionEditForm } from "./session-edit-form"
import { SessionList } from "./session-list"
import { Leaderboard } from "./leaderboard"
import { SaveLoadSessions } from "@/components/save-load-sessions"
import { QuickSaveLoad } from "@/components/quick-save-load"
import { updatePlayerAfterSession } from "@/lib/debt-utils"

export function DebtTracker() {
  const [players, setPlayers] = useLocalStorage<PokerPlayer[]>(
    "poker-debt-players",
    []
  )
  const [sessions, setSessions] = useLocalStorage<PokerSession[]>(
    "poker-debt-sessions",
    []
  )
  const [activeTab, setActiveTab] = useLocalStorage<string>(
    "poker-debt-active-tab",
    "players"
  )
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)

  const handleAddSession = useCallback(
    (newSession: PokerSession) => {
      // Add the session
      setSessions((prev) => [newSession, ...prev])

      // Update player statistics
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player) => {
          const sessionEntry = newSession.players.find(
            (p) => p.playerId === player.id
          )
          if (sessionEntry) {
            return updatePlayerAfterSession(player, sessionEntry)
          }
          return player
        })
      })

      // Switch to sessions tab to show the new session
      setActiveTab("sessions")
    },
    [setSessions, setPlayers, setActiveTab]
  )

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      const sessionToDelete = sessions.find((s) => s.id === sessionId)
      if (!sessionToDelete) return

      // Remove the session
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))

      // Revert player statistics by undoing the session's effects
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player) => {
          const sessionEntry = sessionToDelete.players.find(
            (p) => p.playerId === player.id
          )
          if (sessionEntry) {
            const totalBuyIns = sessionEntry.buyIns.reduce(
              (sum, buyIn) => sum + buyIn,
              0
            )
            return {
              ...player,
              netProfitLoss: player.netProfitLoss - sessionEntry.profit,
              sessionsPlayed: player.sessionsPlayed - 1,
              totalBuyIns: player.totalBuyIns - totalBuyIns,
              totalCashOuts: player.totalCashOuts - sessionEntry.cashOut,
            }
          }
          return player
        })
      })
    },
    [sessions, setSessions, setPlayers]
  )

  const handleEditSession = useCallback(
    (sessionId: string) => {
      setEditingSessionId(sessionId)
      setActiveTab("sessions")
    },
    [setActiveTab]
  )

  const handleUpdateSession = useCallback(
    (updatedSession: PokerSession) => {
      const originalSession = sessions.find((s) => s.id === updatedSession.id)
      if (!originalSession) return

      // Update the session
      setSessions((prev) =>
        prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
      )

      // Revert original session effects and apply new session effects
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player) => {
          const originalEntry = originalSession.players.find(
            (p) => p.playerId === player.id
          )
          const updatedEntry = updatedSession.players.find(
            (p) => p.playerId === player.id
          )

          let updatedPlayer = { ...player }

          // Revert original session effects
          if (originalEntry) {
            const originalTotalBuyIns = originalEntry.buyIns.reduce(
              (sum, buyIn) => sum + buyIn,
              0
            )
            updatedPlayer = {
              ...updatedPlayer,
              netProfitLoss: updatedPlayer.netProfitLoss - originalEntry.profit,
              sessionsPlayed: updatedPlayer.sessionsPlayed - 1,
              totalBuyIns: updatedPlayer.totalBuyIns - originalTotalBuyIns,
              totalCashOuts:
                updatedPlayer.totalCashOuts - originalEntry.cashOut,
            }
          }

          // Apply updated session effects
          if (updatedEntry) {
            updatedPlayer = updatePlayerAfterSession(
              updatedPlayer,
              updatedEntry
            )
          }

          return updatedPlayer
        })
      })

      // Clear editing state
      setEditingSessionId(null)
    },
    [sessions, setSessions, setPlayers]
  )

  const handleCancelEdit = useCallback(() => {
    setEditingSessionId(null)
  }, [])

  const handleLoadData = useCallback(
    (loadedPlayers: PokerPlayer[], loadedSessions: PokerSession[]) => {
      setPlayers(loadedPlayers)
      setSessions(loadedSessions)
    },
    [setPlayers, setSessions]
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Poker Session Tracker</h1>
        <p className="text-muted-foreground">
          Track poker session profit/loss and player statistics in Swedish
          Crowns (SEK)
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2 block sm:flex justify-center items-center gap-4">
          <TabsList className="inline-flex w-auto sm:min-w-0 min-w-full mb-4 md:mb-6 gap-1">
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="add-session">Add Session</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="save-load">Save/Load</TabsTrigger>
          </TabsList>
          <QuickSaveLoad
            players={players}
            sessions={sessions}
            onLoadData={handleLoadData}
          />
        </div>

        <TabsContent value="players">
          <PlayerProfiles players={players} onUpdatePlayers={setPlayers} />
        </TabsContent>

        <TabsContent value="add-session">
          <SessionForm players={players} onAddSession={handleAddSession} />
        </TabsContent>

        <TabsContent value="sessions">
          {editingSessionId ? (
            <SessionEditForm
              players={players}
              session={sessions.find((s) => s.id === editingSessionId)}
              onSaveSession={handleUpdateSession}
              onCancel={handleCancelEdit}
            />
          ) : (
            <SessionList
              sessions={sessions}
              onDeleteSession={handleDeleteSession}
              onEditSession={handleEditSession}
            />
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard players={players} sessions={sessions} />
        </TabsContent>

        <TabsContent value="save-load">
          <SaveLoadSessions
            players={players}
            sessions={sessions}
            onLoadData={handleLoadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
