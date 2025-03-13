"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Award,
  User,
  Smile,
} from "lucide-react"
import { Player, Settings } from "@/types/poker-timer"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"

// Player Card Component
interface PlayerCardProps {
  player: Player
  role: string | null
  isDealer: boolean
  isSmallBlind: boolean
  isBigBlind: boolean
  onEditPlayer: (player: Player) => void
  onRemovePlayer: (playerId: string) => void
  onToggleActive: (playerId: string) => void
  onIncrementBuyIn: (playerId: string) => void
  onDecrementBuyIn: (playerId: string) => void
  onSetDealer: (seatNumber: number) => void
  getRoleDisplayName: (role: string | null) => string
}

function PlayerCard({
  player,
  role,
  isDealer,
  isSmallBlind,
  isBigBlind,
  onEditPlayer,
  onRemovePlayer,
  onToggleActive,
  onIncrementBuyIn,
  onDecrementBuyIn,
  onSetDealer,
  getRoleDisplayName,
}: PlayerCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300 h-full",
        player.active ? "border-2 border-primary" : "opacity-60 border-dashed"
      )}
    >
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-lg bg-muted",
                  (isDealer || isSmallBlind || isBigBlind) &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {player.emoji || <User className="h-4 w-4" />}
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  {player.name || `Player ${player.seatNumber}`}
                </h3>
                <div className="text-xs text-muted-foreground">
                  Seat {player.seatNumber}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEditPlayer(player)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onRemovePlayer(player.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 mb-2 flex-1">
            {role && (
              <div className="flex items-center justify-center py-1 px-2 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {getRoleDisplayName(role)}
              </div>
            )}
            {player.active && !role && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => onSetDealer(player.seatNumber)}
              >
                <Award className="h-3.5 w-3.5 mr-1" />
                Set as Dealer
              </Button>
            )}
          </div>

          <div className="flex justify-between items-end">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-xs h-7",
                player.active ? "border-green-500" : "border-gray-500"
              )}
              onClick={() => onToggleActive(player.id)}
            >
              {player.active ? "Active" : "Inactive"}
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onDecrementBuyIn(player.id)}
                disabled={player.buyIns <= 0}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <div className="flex items-center justify-center min-w-8 px-1 h-7 border rounded-md text-xs font-medium">
                {player.buyIns}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onIncrementBuyIn(player.id)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Extract EditPlayerDialog component
interface EditPlayerDialogProps {
  player: Player | null
  onSave: (player: Player) => void
  onCancel: () => void
  commonEmojis: string[]
}

function EditPlayerDialog({
  player,
  onSave,
  onCancel,
  commonEmojis,
}: EditPlayerDialogProps) {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(player)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Update local state when player prop changes
  useEffect(() => {
    setEditingPlayer(player)
  }, [player])

  if (!editingPlayer) return null

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="playerName">Player Name</Label>
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
            {editingPlayer.emoji ? editingPlayer.emoji : "🙂"}
          </div>
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Smile className="h-4 w-4 mr-2" /> Select Emoji
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
                    <span className="text-xl">{emoji}</span>
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
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="buyIns">Buy-ins</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (editingPlayer.buyIns > 0) {
                setEditingPlayer({
                  ...editingPlayer,
                  buyIns: editingPlayer.buyIns - 1,
                })
              }
            }}
            disabled={editingPlayer.buyIns <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            id="buyIns"
            type="number"
            min="0"
            value={editingPlayer.buyIns}
            onChange={(e) =>
              setEditingPlayer({
                ...editingPlayer,
                buyIns: Math.max(0, parseInt(e.target.value) || 0),
              })
            }
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setEditingPlayer({
                ...editingPlayer,
                buyIns: editingPlayer.buyIns + 1,
              })
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(editingPlayer)}>Save</Button>
      </DialogFooter>
    </div>
  )
}

interface SeatingPlanProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
}

// Custom hook for player management
function usePlayerManagement(
  settings: Settings,
  onUpdateSettings: (settings: Settings) => void
) {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [randomizeInProgress, setRandomizeInProgress] = useState(false)
  const [dealerSeat, setDealerSeat] = useState<number | null>(null)
  const [smallBlindSeat, setSmallBlindSeat] = useState<number | null>(null)
  const [bigBlindSeat, setBigBlindSeat] = useState<number | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Initialize dealer and blind positions from settings if available
  useEffect(() => {
    setDealerSeat(settings.dealerSeat)
    setSmallBlindSeat(settings.smallBlindSeat)
    setBigBlindSeat(settings.bigBlindSeat)
  }, [settings])

  const addPlayer = () => {
    const newPlayer: Player = {
      id: nanoid(),
      name: "",
      seatNumber: settings.players.length + 1,
      active: true,
      buyIns: 1,
    }

    const updatedSettings = {
      ...settings,
      players: [...settings.players, newPlayer],
    }

    onUpdateSettings(updatedSettings)
    setEditingPlayer(newPlayer)
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
    const updatedPlayers = settings.players
      .filter((player) => player.id !== playerId)
      .map((player, index) => ({
        ...player,
        seatNumber: index + 1,
      }))

    // Reset dealer/blind positions if the removed player had one of these roles
    const removedPlayer = settings.players.find((p) => p.id === playerId)
    const removedSeat = removedPlayer?.seatNumber

    const updatedSettings = {
      ...settings,
      players: updatedPlayers,
      dealerSeat: removedSeat === dealerSeat ? null : dealerSeat,
      smallBlindSeat: removedSeat === smallBlindSeat ? null : smallBlindSeat,
      bigBlindSeat: removedSeat === bigBlindSeat ? null : bigBlindSeat,
    }

    onUpdateSettings(updatedSettings)

    // Update the local state variables
    if (removedSeat === dealerSeat) setDealerSeat(null)
    if (removedSeat === smallBlindSeat) setSmallBlindSeat(null)
    if (removedSeat === bigBlindSeat) setBigBlindSeat(null)
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
      player.id === playerId && player.buyIns > 0
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

    // Make a copy of active players
    const activePlayers = settings.players.filter((player) => player.active)

    // Shuffle the active players
    const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5)

    // Inactive players remain in their original positions
    const inactivePlayers = settings.players.filter((player) => !player.active)

    // Assign new seat numbers to active players
    const reseatedPlayers = shuffledPlayers.map((player, index) => ({
      ...player,
      seatNumber: index + 1,
    }))

    // Combine active and inactive players
    const allPlayers = [...reseatedPlayers, ...inactivePlayers]

    // Sort by seat number for display
    allPlayers.sort((a, b) => a.seatNumber - b.seatNumber)

    onUpdateSettings({
      ...settings,
      players: allPlayers,
      // Reset dealer and blind positions when seats are randomized
      dealerSeat: null,
      smallBlindSeat: null,
      bigBlindSeat: null,
    })

    // Reset local state
    setDealerSeat(null)
    setSmallBlindSeat(null)
    setBigBlindSeat(null)

    setTimeout(() => {
      setRandomizeInProgress(false)
    }, 500)
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

  const randomizeDealer = () => {
    const activePlayers = settings.players.filter((player) => player.active)

    if (activePlayers.length > 0) {
      const randomIndex = Math.floor(Math.random() * activePlayers.length)
      const randomPlayer = activePlayers[randomIndex]

      setDealerPosition(randomPlayer.seatNumber)
    }
  }

  const setDealerPosition = (seatNumber: number) => {
    setDealerSeat(seatNumber)
    setAutoBlinds(seatNumber)

    onUpdateSettings({
      ...settings,
      dealerSeat: seatNumber,
      smallBlindSeat: smallBlindSeat,
      bigBlindSeat: bigBlindSeat,
    })
  }

  const setAutoBlinds = (dealerPosition: number) => {
    const activePlayers = settings.players
      .filter((player) => player.active)
      .sort((a, b) => a.seatNumber - b.seatNumber)

    if (activePlayers.length < 2) return

    const dealerIndex = activePlayers.findIndex(
      (player) => player.seatNumber === dealerPosition
    )

    if (dealerIndex === -1) return

    // Small blind is the next active player after the dealer
    const smallBlindIndex = (dealerIndex + 1) % activePlayers.length
    const smallBlindPosition = activePlayers[smallBlindIndex].seatNumber

    // Big blind is the next active player after the small blind
    const bigBlindIndex = (smallBlindIndex + 1) % activePlayers.length
    const bigBlindPosition = activePlayers[bigBlindIndex].seatNumber

    setSmallBlindSeat(smallBlindPosition)
    setBigBlindSeat(bigBlindPosition)

    onUpdateSettings({
      ...settings,
      dealerSeat: dealerPosition,
      smallBlindSeat: smallBlindPosition,
      bigBlindSeat: bigBlindPosition,
    })
  }

  const randomizeAllPositions = () => {
    randomizeSeats()
    setTimeout(() => randomizeDealer(), 600)
  }

  const getPlayerInSeat = (seatNumber: number | null) => {
    if (seatNumber === null) return null
    return (
      settings.players.find((player) => player.seatNumber === seatNumber) ||
      null
    )
  }

  const getPlayerRole = (player: Player) => {
    if (player.seatNumber === dealerSeat) return "dealer"
    if (player.seatNumber === smallBlindSeat) return "smallBlind"
    if (player.seatNumber === bigBlindSeat) return "bigBlind"
    return null
  }

  const getRoleDisplayName = (role: string | null) => {
    if (role === "dealer") return "Dealer (D)"
    if (role === "smallBlind") return "Small Blind (SB)"
    if (role === "bigBlind") return "Big Blind (BB)"
    return ""
  }

  return {
    editingPlayer,
    setEditingPlayer,
    randomizeInProgress,
    dealerSeat,
    smallBlindSeat,
    bigBlindSeat,
    selectedPlayer,
    setSelectedPlayer,
    showEmojiPicker,
    setShowEmojiPicker,
    addPlayer,
    updatePlayer,
    removePlayer,
    incrementBuyIn,
    decrementBuyIn,
    randomizeSeats,
    togglePlayerActive,
    randomizeDealer,
    setDealerPosition,
    setAutoBlinds,
    randomizeAllPositions,
    getPlayerInSeat,
    getPlayerRole,
    getRoleDisplayName,
  }
}

export function SeatingPlan({ settings, onUpdateSettings }: SeatingPlanProps) {
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

  const playerManager = usePlayerManagement(settings, onUpdateSettings)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Seating Plan</h2>
          <p className="text-muted-foreground">
            Manage players and assign positions
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={playerManager.randomizeSeats}
            disabled={playerManager.randomizeInProgress}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Randomize Seats
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={playerManager.randomizeDealer}
          >
            <Award className="h-4 w-4 mr-2" />
            Random Dealer
          </Button>
          <Button onClick={playerManager.addPlayer} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {settings.players.map((player) => {
          const role = playerManager.getPlayerRole(player)
          const isDealer = player.seatNumber === playerManager.dealerSeat
          const isSmallBlind =
            player.seatNumber === playerManager.smallBlindSeat
          const isBigBlind = player.seatNumber === playerManager.bigBlindSeat

          return (
            <PlayerCard
              key={player.id}
              player={player}
              role={role}
              isDealer={isDealer}
              isSmallBlind={isSmallBlind}
              isBigBlind={isBigBlind}
              onEditPlayer={playerManager.setEditingPlayer}
              onRemovePlayer={playerManager.removePlayer}
              onToggleActive={playerManager.togglePlayerActive}
              onIncrementBuyIn={playerManager.incrementBuyIn}
              onDecrementBuyIn={playerManager.decrementBuyIn}
              onSetDealer={playerManager.setDealerPosition}
              getRoleDisplayName={playerManager.getRoleDisplayName}
            />
          )
        })}
      </div>

      <Dialog
        open={!!playerManager.editingPlayer}
        onOpenChange={(open) => !open && playerManager.setEditingPlayer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          <EditPlayerDialog
            player={playerManager.editingPlayer}
            onSave={playerManager.updatePlayer}
            onCancel={() => playerManager.setEditingPlayer(null)}
            commonEmojis={commonEmojis}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
