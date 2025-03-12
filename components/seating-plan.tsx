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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  Info,
  User,
  Smile,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Player, Settings } from "@/types/poker-timer"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"

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
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Common emojis for easy selection
  const commonEmojis = [
    "😀",
    "😎",
    "🤓",
    "😍",
    "🤑",
    "😏",
    "🧐",
    "🤠",
    "👑",
    "🐱",
    "🐶",
    "🦊",
    "🦁",
    "🐯",
    "🐻",
    "🐼",
    "🐨",
    "🦄",
    "🍀",
    "⭐",
    "🔥",
    "💰",
    "💎",
    "🃏",
    "♠️",
    "♥️",
    "♦️",
    "♣️",
  ]

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
        emoji: undefined, // Default to no emoji
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

  // Get player role
  const getPlayerRole = (player: Player) => {
    if (dealerSeat === player.seatNumber) return "dealer"
    if (smallBlindSeat === player.seatNumber) return "smallBlind"
    if (bigBlindSeat === player.seatNumber) return "bigBlind"
    return null
  }

  // Get role display name
  const getRoleDisplayName = (role: string | null) => {
    if (role === "dealer") return "Dealer"
    if (role === "smallBlind") return "Small Blind"
    if (role === "bigBlind") return "Big Blind"
    return null
  }

  // Calculate player position in circle
  const calculatePosition = (index: number, total: number) => {
    // Only use active players for calculation
    const activeTotal = activePlayers.length
    if (activeTotal === 0) return { top: "50%", left: "50%" }

    // Adjust index to only consider active players
    if (!activePlayers.includes(sortedPlayers[index])) {
      return { top: "50%", left: "50%" }
    }

    const activeIndex = activePlayers.findIndex(
      (p) => p.id === sortedPlayers[index].id
    )

    // Calculate position on a circle
    // Start from top (12 o'clock) and go clockwise
    const angleStep = (2 * Math.PI) / activeTotal
    const angle = angleStep * activeIndex - Math.PI / 2 // Start from top

    // Table radius - adjust as needed
    const radius = activeTotal <= 4 ? 35 : activeTotal <= 6 ? 40 : 45

    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)

    return {
      left: `${x}%`,
      top: `${y}%`,
    }
  }

  // Function to manually set dealer position
  const setDealerPosition = (seatNumber: number) => {
    setDealerSeat(seatNumber)
    setAutoBlinds(seatNumber)
  }

  // Function to manually change a player's seat number
  const changePlayerSeat = (playerId: string, newSeatNumber: number) => {
    // Get the player we're moving
    const currentPlayer = settings.players.find((p) => p.id === playerId)
    if (!currentPlayer) return

    // Find the player who is currently in the target seat
    const targetPlayer = settings.players.find(
      (p) => p.seatNumber === newSeatNumber && p.id !== playerId
    )

    // Update player positions
    const updatedPlayers = settings.players.map((player) => {
      if (player.id === playerId) {
        // Move current player to new seat
        return { ...player, seatNumber: newSeatNumber }
      } else if (player.id === targetPlayer?.id) {
        // Swap the other player to current player's seat
        return { ...player, seatNumber: currentPlayer.seatNumber }
      }
      return player
    })

    // Update settings with new player positions
    onUpdateSettings({
      ...settings,
      players: updatedPlayers,
    })

    // Update dealer, small blind and big blind positions if needed
    if (dealerSeat === newSeatNumber) {
      setDealerSeat(currentPlayer.seatNumber)
    } else if (dealerSeat === currentPlayer.seatNumber) {
      setDealerSeat(newSeatNumber)
    }

    if (smallBlindSeat === newSeatNumber) {
      setSmallBlindSeat(currentPlayer.seatNumber)
    } else if (smallBlindSeat === currentPlayer.seatNumber) {
      setSmallBlindSeat(newSeatNumber)
    }

    if (bigBlindSeat === newSeatNumber) {
      setBigBlindSeat(currentPlayer.seatNumber)
    } else if (bigBlindSeat === currentPlayer.seatNumber) {
      setBigBlindSeat(newSeatNumber)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Tournament Seating Plan</h2>

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

        {/* Circular poker table visualization */}
        {settings.players.length > 0 && (
          <div className="mb-6">
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              {/* Table background */}
              <div className="absolute inset-[15%] rounded-full bg-green-700 dark:bg-green-800 border-8 border-brown-800 dark:border-stone-900 shadow-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <span className="text-lg font-medium">Poker Table</span>
                  {dealerSeat && getPlayerInSeat(dealerSeat) && (
                    <div className="text-sm mt-1">
                      Dealer: Seat {dealerSeat} -{" "}
                      {getPlayerInSeat(dealerSeat)?.name}
                      {getPlayerInSeat(dealerSeat)?.emoji && (
                        <span className="ml-1">
                          {getPlayerInSeat(dealerSeat)?.emoji}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Players around the table */}
              {sortedPlayers.map((player, index) => {
                if (!player.active) return null

                const position = calculatePosition(index, sortedPlayers.length)
                const role = getPlayerRole(player)

                // Role badge colors
                const roleColors = {
                  dealer: "bg-yellow-500",
                  smallBlind: "bg-blue-500",
                  bigBlind: "bg-purple-500",
                }

                return (
                  <Dialog key={player.id}>
                    <DialogTrigger asChild>
                      <button
                        className="absolute w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md border-2 border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
                        style={{ top: position.top, left: position.left }}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                          {player.emoji ? (
                            <span className="text-xl">{player.emoji}</span>
                          ) : (
                            <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                          )}
                        </div>
                        <div className="text-xs mt-1 font-medium truncate max-w-[95%] text-gray-800 dark:text-gray-200">
                          {player.name}
                        </div>
                        <div className="absolute -top-1 -right-1 flex gap-0.5">
                          {role && (
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${
                                roleColors[role as keyof typeof roleColors]
                              }`}
                              title={getRoleDisplayName(role) || ""}
                            >
                              {role === "dealer"
                                ? "D"
                                : role === "smallBlind"
                                ? "S"
                                : "B"}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -left-1 bg-gray-800 dark:bg-gray-900 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                          {player.seatNumber}
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          Player Details: {player.name}{" "}
                          {player.emoji && <span>{player.emoji}</span>}
                          {role && (
                            <span
                              className={`ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${
                                roleColors[role as keyof typeof roleColors]
                              }`}
                            >
                              {role === "dealer"
                                ? "D"
                                : role === "smallBlind"
                                ? "SB"
                                : "BB"}
                            </span>
                          )}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label className="text-muted-foreground">Seat</Label>
                          <div className="font-medium">{player.seatNumber}</div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Buy-ins
                          </Label>
                          <div className="font-medium">{player.buyIns}</div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Status
                          </Label>
                          <div
                            className={`font-medium ${
                              player.active
                                ? "text-green-600 dark:text-green-500"
                                : "text-gray-500"
                            }`}
                          >
                            {player.active ? "Active" : "Inactive"}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Role</Label>
                          <div className="font-medium">
                            {getRoleDisplayName(role) || "None"}
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="flex gap-2">
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

                                {/* Emoji Selection */}
                                <div className="space-y-2">
                                  <Label>Player Emoji</Label>
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 flex items-center justify-center border rounded-md">
                                      {editingPlayer.emoji
                                        ? editingPlayer.emoji
                                        : "🙂"}
                                    </div>
                                    <Popover
                                      open={showEmojiPicker}
                                      onOpenChange={setShowEmojiPicker}
                                    >
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Smile className="h-4 w-4 mr-2" />{" "}
                                          Select Emoji
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-64">
                                        <div className="grid grid-cols-5 gap-2">
                                          {commonEmojis.map((emoji) => (
                                            <Button
                                              key={emoji}
                                              variant="ghost"
                                              className="h-10 w-10 p-0"
                                              onClick={() => {
                                                const updatedPlayer = {
                                                  ...editingPlayer,
                                                  emoji: emoji,
                                                }
                                                updatePlayer(updatedPlayer)
                                                setShowEmojiPicker(false)
                                              }}
                                            >
                                              <span className="text-xl">
                                                {emoji}
                                              </span>
                                            </Button>
                                          ))}
                                          <Button
                                            variant="ghost"
                                            className="h-10 w-10 p-0"
                                            onClick={() => {
                                              const updatedPlayer = {
                                                ...editingPlayer,
                                                emoji: undefined,
                                              }
                                              updatePlayer(updatedPlayer)
                                              setShowEmojiPicker(false)
                                            }}
                                          >
                                            <span className="text-xl">❌</span>
                                          </Button>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>

                                {/* Dealer Position Assignment */}
                                <div className="space-y-2">
                                  <Label>Dealer Position</Label>
                                  <Button
                                    variant={
                                      dealerSeat === editingPlayer.seatNumber
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() =>
                                      setDealerPosition(
                                        editingPlayer.seatNumber
                                      )
                                    }
                                    className="w-full"
                                  >
                                    {dealerSeat === editingPlayer.seatNumber
                                      ? "Current Dealer"
                                      : "Set as Dealer"}
                                  </Button>
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
                                    editingPlayer && updatePlayer(editingPlayer)
                                  }
                                >
                                  Save Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Existing buttons */}
                        <Button
                          variant={player.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePlayerActive(player.id)}
                          className="flex-1"
                        >
                          {player.active ? "Set Inactive" : "Set Active"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )
              })}
            </div>
          </div>
        )}

        {/* Player list table */}
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
                        <div className="flex items-center gap-2">
                          <div>{player.seatNumber}</div>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0"
                              onClick={() => {
                                const prevSeatNumber = player.seatNumber - 1
                                if (prevSeatNumber >= 1) {
                                  changePlayerSeat(player.id, prevSeatNumber)
                                }
                              }}
                              disabled={player.seatNumber <= 1}
                              title="Move to previous seat"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0"
                              onClick={() => {
                                const nextSeatNumber = player.seatNumber + 1
                                if (nextSeatNumber <= settings.players.length) {
                                  changePlayerSeat(player.id, nextSeatNumber)
                                }
                              }}
                              disabled={
                                player.seatNumber >= settings.players.length
                              }
                              title="Move to next seat"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {player.emoji && (
                            <span className="text-xl">{player.emoji}</span>
                          )}
                          {player.name}
                        </div>
                      </TableCell>
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

                                  {/* Emoji Selection */}
                                  <div className="space-y-2">
                                    <Label>Player Emoji</Label>
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 flex items-center justify-center border rounded-md">
                                        {editingPlayer.emoji
                                          ? editingPlayer.emoji
                                          : "🙂"}
                                      </div>
                                      <Popover
                                        open={showEmojiPicker}
                                        onOpenChange={setShowEmojiPicker}
                                      >
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Smile className="h-4 w-4 mr-2" />{" "}
                                            Select Emoji
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64">
                                          <div className="grid grid-cols-5 gap-2">
                                            {commonEmojis.map((emoji) => (
                                              <Button
                                                key={emoji}
                                                variant="ghost"
                                                className="h-10 w-10 p-0"
                                                onClick={() => {
                                                  setEditingPlayer({
                                                    ...editingPlayer,
                                                    emoji: emoji,
                                                  })
                                                  setShowEmojiPicker(false)
                                                }}
                                              >
                                                <span className="text-xl">
                                                  {emoji}
                                                </span>
                                              </Button>
                                            ))}
                                            <Button
                                              variant="ghost"
                                              className="h-10 w-10 p-0"
                                              onClick={() => {
                                                setEditingPlayer({
                                                  ...editingPlayer,
                                                  emoji: undefined,
                                                })
                                                setShowEmojiPicker(false)
                                              }}
                                            >
                                              <span className="text-xl">
                                                ❌
                                              </span>
                                            </Button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>

                                  {/* Dealer Position Assignment */}
                                  <div className="space-y-2">
                                    <Label>Dealer Position</Label>
                                    <Button
                                      variant={
                                        dealerSeat === editingPlayer.seatNumber
                                          ? "default"
                                          : "outline"
                                      }
                                      onClick={() =>
                                        setDealerPosition(
                                          editingPlayer.seatNumber
                                        )
                                      }
                                      className="w-full"
                                    >
                                      {dealerSeat === editingPlayer.seatNumber
                                        ? "Current Dealer"
                                        : "Set as Dealer"}
                                    </Button>
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
