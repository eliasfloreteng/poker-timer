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
import {
  Plus,
  Minus,
  Edit,
  Trash2,
  UserPlus,
  RefreshCw,
  Coins,
  Award,
  Repeat,
} from "lucide-react"
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
  const [dealerSeat, setDealerSeat] = useState<number | null>(null)
  const [smallBlindSeat, setSmallBlindSeat] = useState<number | null>(null)
  const [bigBlindSeat, setBigBlindSeat] = useState<number | null>(null)

  // Calculate the current number of seats based on player count
  const seatCount = Math.max(settings.players.length, 2)

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      // Create a new player - seat number will be assigned when displaying
      const newPlayer: Player = {
        id: nanoid(),
        name: newPlayerName.trim(),
        seatNumber: settings.players.length + 1, // Incremental seat number
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
    // Get the player we're removing
    const playerToRemove = settings.players.find((p) => p.id === playerId)

    // Remove the player
    let updatedPlayers = settings.players.filter((p) => p.id !== playerId)

    // Renumber the remaining players to ensure sequential seat numbers
    updatedPlayers = updatedPlayers.map((player, index) => ({
      ...player,
      seatNumber: index + 1,
    }))

    // Check if we're removing a player in a special seat and reset it
    if (playerToRemove) {
      if (dealerSeat === playerToRemove.seatNumber) setDealerSeat(null)
      if (smallBlindSeat === playerToRemove.seatNumber) setSmallBlindSeat(null)
      if (bigBlindSeat === playerToRemove.seatNumber) setBigBlindSeat(null)
    }

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
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

    // Get active players
    const activePlayers = settings.players.filter((p) => p.active)
    if (activePlayers.length < 2) {
      setRandomizeInProgress(false)
      return
    }

    // Create a shuffled copy of the active players
    const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5)

    // Create a copy of the inactive players (we won't shuffle these)
    const inactivePlayers = settings.players.filter((p) => !p.active)

    // Reassign the seat numbers sequentially for active players
    const reorderedPlayers = shuffledPlayers.map((player, index) => ({
      ...player,
      seatNumber: index + 1,
    }))

    // Add inactive players after active ones
    const allPlayers = [
      ...reorderedPlayers,
      ...inactivePlayers.map((player, index) => ({
        ...player,
        seatNumber: reorderedPlayers.length + index + 1,
      })),
    ]

    onUpdateSettings({
      ...settings,
      players: allPlayers,
    })

    // Reset positions since players have changed seats
    setDealerSeat(null)
    setSmallBlindSeat(null)
    setBigBlindSeat(null)

    setRandomizeInProgress(false)
  }

  const togglePlayerActive = (playerId: string) => {
    const playerToToggle = settings.players.find((p) => p.id === playerId)
    const updatedPlayers = settings.players.map((player) =>
      player.id === playerId ? { ...player, active: !player.active } : player
    )

    // Check if we're deactivating a player in a special seat and reset it
    if (playerToToggle && playerToToggle.active) {
      if (dealerSeat === playerToToggle.seatNumber) setDealerSeat(null)
      if (smallBlindSeat === playerToToggle.seatNumber) setSmallBlindSeat(null)
      if (bigBlindSeat === playerToToggle.seatNumber) setBigBlindSeat(null)
    }

    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })
  }

  const handleStartingChipsChange = (value: string) => {
    const chips = parseInt(value) || 0
    onUpdateSettings({
      ...settings,
      startingChips: chips,
    })
  }

  const randomizeDealer = () => {
    const activePlayers = settings.players.filter((p) => p.active)
    if (activePlayers.length === 0) return

    // Get a random active player for dealer
    const randomIndex = Math.floor(Math.random() * activePlayers.length)
    const randomSeat = activePlayers[randomIndex].seatNumber
    setDealerSeat(randomSeat)

    // Automatically set blinds based on dealer position
    setAutoBlinds(randomSeat)
  }

  const setAutoBlinds = (dealerPosition: number) => {
    // Find active players and sort by seat number
    const activePlayers = settings.players
      .filter((p) => p.active)
      .sort((a, b) => a.seatNumber - b.seatNumber)

    if (activePlayers.length < 3) return // Need at least 3 players to set blinds

    // Find the dealer's index in the sorted array
    const dealerIndex = activePlayers.findIndex(
      (p) => p.seatNumber === dealerPosition
    )
    if (dealerIndex === -1) return

    // Small blind is next player after dealer
    const sbIndex = (dealerIndex + 1) % activePlayers.length
    // Big blind is next player after small blind
    const bbIndex = (dealerIndex + 2) % activePlayers.length

    setSmallBlindSeat(activePlayers[sbIndex].seatNumber)
    setBigBlindSeat(activePlayers[bbIndex].seatNumber)
  }

  // Randomize all positions (dealer and blinds) at once
  const randomizeAllPositions = () => {
    randomizeDealer()
  }

  // Get the player who is sitting in a specific seat
  const getPlayerInSeat = (seatNumber: number | null) => {
    if (seatNumber === null) return null
    return settings.players.find((p) => p.active && p.seatNumber === seatNumber)
  }

  // Get active players
  const activePlayers = settings.players.filter((p) => p.active)

  // Sort players by seat number for display
  const sortedPlayers = [...settings.players].sort(
    (a, b) => a.seatNumber - b.seatNumber
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Tournament Seating Plan</h2>

        {/* Starting Chips Setting */}
        <div className="mb-6 p-4 border rounded-md bg-muted/30">
          <div className="space-y-2 mb-4">
            <Label htmlFor="startingChips">Starting Chips</Label>
            <Input
              id="startingChips"
              type="number"
              min="100"
              step="100"
              value={settings.startingChips}
              onChange={(e) => handleStartingChipsChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Number of chips each player starts with
            </p>
          </div>
        </div>

        {/* Player management buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            className="flex-1 min-w-[200px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addPlayer()
              }
            }}
          />
          <Button onClick={addPlayer}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Player
          </Button>
          <Button
            variant="outline"
            onClick={randomizeSeats}
            disabled={randomizeInProgress || activePlayers.length < 2}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                randomizeInProgress ? "animate-spin" : ""
              }`}
            />
            Shuffle Players
          </Button>
          <Button
            variant="outline"
            onClick={randomizeAllPositions}
            disabled={activePlayers.length < 3}
          >
            <Repeat className="h-4 w-4 mr-2" />
            Assign Dealer & Blinds
          </Button>
        </div>

        {/* Position display */}
        {activePlayers.length > 0 && (
          <div className="mb-4 p-4 bg-muted/30 rounded-md flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[150px]">
              <div className="text-sm font-medium mb-1">Dealer</div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-yellow-500" />
                {getPlayerInSeat(dealerSeat) ? (
                  <span>
                    Seat {dealerSeat}: {getPlayerInSeat(dealerSeat)?.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <div className="text-sm font-medium mb-1">Small Blind</div>
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-2 text-blue-500" />
                {getPlayerInSeat(smallBlindSeat) ? (
                  <span>
                    Seat {smallBlindSeat}:{" "}
                    {getPlayerInSeat(smallBlindSeat)?.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <div className="text-sm font-medium mb-1">Big Blind</div>
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-2 text-purple-500" />
                {getPlayerInSeat(bigBlindSeat) ? (
                  <span>
                    Seat {bigBlindSeat}: {getPlayerInSeat(bigBlindSeat)?.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </div>
            </div>
          </div>
        )}

        {settings.players.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Seat</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="w-24 text-center">Role</TableHead>
                    <TableHead className="w-24 text-center">Buy-ins</TableHead>
                    <TableHead className="w-24 text-center">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlayers.map((player) => (
                    <TableRow
                      key={player.id}
                      className={!player.active ? "opacity-60" : ""}
                    >
                      <TableCell className="font-medium">
                        {player.seatNumber}
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell className="text-center">
                        {player.active && (
                          <div className="flex items-center justify-center gap-1">
                            {dealerSeat === player.seatNumber && (
                              <span
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                title="Dealer"
                              >
                                D
                              </span>
                            )}
                            {smallBlindSeat === player.seatNumber && (
                              <span
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                title="Small Blind"
                              >
                                SB
                              </span>
                            )}
                            {bigBlindSeat === player.seatNumber && (
                              <span
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                title="Big Blind"
                              >
                                BB
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
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
                                  {/* Remove seat number editing as we're managing seats automatically */}
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
