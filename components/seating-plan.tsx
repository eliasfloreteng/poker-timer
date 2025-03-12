"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus, Minus, Edit, Trash2, UserPlus, RefreshCw } from "lucide-react"
import { Player, Settings } from "@/types/poker-timer"
import { nanoid } from "nanoid"

interface SeatingPlanProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
}

export function SeatingPlan({ settings, onUpdateSettings }: SeatingPlanProps) {
  const [newPlayerName, setNewPlayerName] = useState("")
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [randomizeInProgress, setRandomizeInProgress] = useState(false)

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      // Find the next available seat
      const occupiedSeats = settings.players.map((p) => p.seatNumber)
      let nextSeat = 1
      while (
        occupiedSeats.includes(nextSeat) &&
        nextSeat <= settings.maxSeats
      ) {
        nextSeat++
      }

      // Only add if we have an available seat
      if (nextSeat <= settings.maxSeats) {
        const newPlayer: Player = {
          id: nanoid(),
          name: newPlayerName.trim(),
          seatNumber: nextSeat,
          buyIns: 1,
          active: true,
        }

        onUpdateSettings({
          ...settings,
          players: [...settings.players, newPlayer],
        })
        setNewPlayerName("")
      }
    }
  }

  const updatePlayer = (updatedPlayer: Player) => {
    const updatedPlayers = settings.players.map((player) =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    )

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })
    setEditingPlayer(null)
  }

  const removePlayer = (playerId: string) => {
    onUpdateSettings({
      ...settings,
      players: settings.players.filter((player) => player.id !== playerId),
    })
  }

  const incrementBuyIn = (playerId: string) => {
    const updatedPlayers = settings.players.map((player) =>
      player.id === playerId ? { ...player, buyIns: player.buyIns + 1 } : player
    )

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })
  }

  const decrementBuyIn = (playerId: string) => {
    const updatedPlayers = settings.players.map((player) =>
      player.id === playerId && player.buyIns > 1
        ? { ...player, buyIns: player.buyIns - 1 }
        : player
    )

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })
  }

  const randomizeSeats = () => {
    setRandomizeInProgress(true)

    // Get all active players
    const activePlayers = settings.players.filter((p) => p.active)

    // Create an array of available seats (1 to maxSeats)
    const availableSeats = Array.from(
      { length: settings.maxSeats },
      (_, i) => i + 1
    )

    // Shuffle the available seats
    const shuffledSeats = [...availableSeats].sort(() => Math.random() - 0.5)

    // Assign new seats to active players
    const updatedPlayers = settings.players.map((player) => {
      if (player.active) {
        const newSeat = shuffledSeats.pop() || player.seatNumber
        return { ...player, seatNumber: newSeat }
      }
      return player
    })

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })

    setRandomizeInProgress(false)
  }

  const togglePlayerActive = (playerId: string) => {
    const updatedPlayers = settings.players.map((player) =>
      player.id === playerId ? { ...player, active: !player.active } : player
    )

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Tournament Seating Plan</h2>

        <div className="flex items-center gap-2 mb-4">
          <Input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addPlayer()
              }
            }}
          />
          <Button
            onClick={addPlayer}
            disabled={settings.players.length >= settings.maxSeats}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add Player
          </Button>
          <Button
            variant="outline"
            onClick={randomizeSeats}
            disabled={
              randomizeInProgress ||
              settings.players.filter((p) => p.active).length < 2
            }
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                randomizeInProgress ? "animate-spin" : ""
              }`}
            />
            Randomize Seats
          </Button>
        </div>

        {settings.players.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Seat</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="w-24 text-center">Buy-ins</TableHead>
                    <TableHead className="w-24 text-center">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.players
                    .sort((a, b) => a.seatNumber - b.seatNumber)
                    .map((player) => (
                      <TableRow
                        key={player.id}
                        className={!player.active ? "opacity-60" : ""}
                      >
                        <TableCell className="font-medium">
                          {player.seatNumber}
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => decrementBuyIn(player.id)}
                              disabled={player.buyIns <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span>{player.buyIns}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => incrementBuyIn(player.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant={player.active ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePlayerActive(player.id)}
                          >
                            {player.active ? "Active" : "Inactive"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setEditingPlayer(player)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Player</DialogTitle>
                                </DialogHeader>
                                {editingPlayer && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="playerName">
                                        Player Name
                                      </Label>
                                      <Input
                                        id="playerName"
                                        value={editingPlayer.name}
                                        onChange={(e) =>
                                          setEditingPlayer({
                                            ...editingPlayer,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="seatNumber">
                                        Seat Number
                                      </Label>
                                      <Input
                                        id="seatNumber"
                                        type="number"
                                        min={1}
                                        max={settings.maxSeats}
                                        value={editingPlayer.seatNumber}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value)
                                          if (
                                            value >= 1 &&
                                            value <= settings.maxSeats
                                          ) {
                                            setEditingPlayer({
                                              ...editingPlayer,
                                              seatNumber: value,
                                            })
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() =>
                                        editingPlayer &&
                                        updatePlayer(editingPlayer)
                                      }
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removePlayer(player.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              No players added yet. Add players to create a seating plan.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
