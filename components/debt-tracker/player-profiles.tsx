"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit2 } from "lucide-react"
import type { PokerPlayer } from "@/types/poker-timer"
import { formatSEK, calculatePlayerProfitLoss } from "@/lib/debt-utils"
import { nanoid } from "nanoid"

interface PlayerProfilesProps {
  players: PokerPlayer[]
  onUpdatePlayers: (players: PokerPlayer[]) => void
}

// Common emojis for poker players
const POKER_EMOJIS = [
  "🎭",
  "🎪",
  "🎨",
  "🎯",
  "🎲",
  "🃏",
  "🎰",
  "♠️",
  "♥️",
  "♦️",
  "♣️",
  "🔥",
  "⚡",
  "💎",
  "👑",
  "🦁",
  "🐯",
  "🦅",
  "🐺",
  "🦈",
  "🐉",
  "😎",
  "🤓",
  "😈",
  "👺",
  "🤖",
  "👽",
  "🎅",
  "🧙‍♂️",
  "🧛‍♂️",
  "🦸‍♂️",
]

interface PlayerFormProps {
  player?: PokerPlayer
  onSave: (player: PokerPlayer) => void
  onCancel: () => void
}

function PlayerForm({ player, onSave, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(player?.name || "")
  const [emoji, setEmoji] = useState(player?.emoji || "🎭")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newPlayer: PokerPlayer = {
      id: player?.id || nanoid(),
      name: name.trim(),
      emoji,
      netProfitLoss: player?.netProfitLoss || 0,
      sessionsPlayed: player?.sessionsPlayed || 0,
      totalBuyIns: player?.totalBuyIns || 0,
      totalCashOuts: player?.totalCashOuts || 0,
    }

    onSave(newPlayer)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Player Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Choose Emoji</Label>
        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded">
          {POKER_EMOJIS.map((emojiOption) => (
            <button
              key={emojiOption}
              type="button"
              onClick={() => setEmoji(emojiOption)}
              className={`text-2xl p-2 rounded hover:bg-muted transition-colors ${
                emoji === emojiOption
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {emojiOption}
            </button>
          ))}
        </div>
        <div className="text-center">
          <span className="text-3xl">{emoji}</span>
          <p className="text-sm text-muted-foreground mt-1">Selected emoji</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {player ? "Update Player" : "Add Player"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function PlayerProfiles({
  players,
  onUpdatePlayers,
}: PlayerProfilesProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<PokerPlayer | null>(null)

  const handleAddPlayer = (player: PokerPlayer) => {
    onUpdatePlayers([...players, player])
    setIsAddDialogOpen(false)
  }

  const handleEditPlayer = (player: PokerPlayer) => {
    const updatedPlayers = players.map((p) => (p.id === player.id ? player : p))
    onUpdatePlayers(updatedPlayers)
    setEditingPlayer(null)
  }

  const handleDeletePlayer = (playerId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this player? This will remove all their session data."
      )
    ) {
      onUpdatePlayers(players.filter((p) => p.id !== playerId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Poker Players</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <PlayerForm
              onSave={handleAddPlayer}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {players.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No players added yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Player
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => {
            const profitLoss = calculatePlayerProfitLoss(player)

            return (
              <Card key={player.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{player.emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{player.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {player.sessionsPlayed} session
                          {player.sessionsPlayed !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPlayer(player)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePlayer(player.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      <span
                        className={
                          profitLoss >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {profitLoss >= 0 ? "+" : ""}
                        {formatSEK(profitLoss)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Net Profit/Loss
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">All-time P/L</p>
                      <p
                        className={`font-medium ${
                          profitLoss >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {profitLoss >= 0 ? "+" : ""}
                        {formatSEK(profitLoss)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total buy-ins</p>
                      <p className="font-medium">
                        {formatSEK(player.totalBuyIns)}
                      </p>
                    </div>
                  </div>

                  {player.sessionsPlayed > 0 && (
                    <Badge
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      Avg per session:{" "}
                      {formatSEK(profitLoss / player.sessionsPlayed)}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Player Dialog */}
      <Dialog
        open={!!editingPlayer}
        onOpenChange={(open) => !open && setEditingPlayer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <PlayerForm
              player={editingPlayer}
              onSave={handleEditPlayer}
              onCancel={() => setEditingPlayer(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
