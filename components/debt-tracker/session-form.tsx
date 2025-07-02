"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CalendarIcon,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"
import type {
  PokerPlayer,
  PokerSession,
  SessionEntry,
} from "@/types/poker-timer"
import {
  formatSEK,
  calculateTotalBuyIns,
  calculateProfit,
  calculateTotalCashOnTable,
  calculateTotalCashOut,
  validateSession,
} from "@/lib/debt-utils"
import { nanoid } from "nanoid"

interface SessionFormProps {
  players: PokerPlayer[]
  onAddSession: (session: PokerSession) => void
}

interface PlayerSessionData {
  playerId: string
  playerName: string
  included: boolean
  buyIns: number[]
  cashOut: number
}

export function SessionForm({ players, onAddSession }: SessionFormProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [sessionType, setSessionType] = useState<"cash" | "tournament">("cash")
  const [commonExpenses, setCommonExpenses] = useState<number>(0)
  const [playerData, setPlayerData] = useState<PlayerSessionData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize player data when players change
  useEffect(() => {
    setPlayerData(
      players.map((player) => ({
        playerId: player.id,
        playerName: player.name,
        included: false,
        buyIns: [50], // Default buy-in of 50 SEK
        cashOut: 0,
      }))
    )
  }, [players])

  const includedPlayers = playerData.filter((p) => p.included)
  const totalCashOnTable = calculateTotalCashOnTable(
    includedPlayers.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      buyIns: p.buyIns,
      cashOut: p.cashOut,
      profit: calculateProfit(p.buyIns, p.cashOut),
    }))
  )
  const totalCashOut = calculateTotalCashOut(
    includedPlayers.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      buyIns: p.buyIns,
      cashOut: p.cashOut,
      profit: calculateProfit(p.buyIns, p.cashOut),
    }))
  )
  const isValid = validateSession(
    includedPlayers.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      buyIns: p.buyIns,
      cashOut: p.cashOut,
      profit: calculateProfit(p.buyIns, p.cashOut),
    })),
    commonExpenses
  )
  const expectedCashOut = totalCashOnTable - commonExpenses
  const difference = totalCashOut - expectedCashOut

  const togglePlayerInclusion = (playerId: string) => {
    setPlayerData((prev) =>
      prev.map((p) =>
        p.playerId === playerId ? { ...p, included: !p.included } : p
      )
    )
  }

  const addBuyIn = (playerId: string) => {
    setPlayerData((prev) =>
      prev.map((p) =>
        p.playerId === playerId ? { ...p, buyIns: [...p.buyIns, 30] } : p
      )
    )
  }

  const removeBuyIn = (playerId: string, index: number) => {
    setPlayerData((prev) =>
      prev.map((p) =>
        p.playerId === playerId
          ? { ...p, buyIns: p.buyIns.filter((_, i) => i !== index) }
          : p
      )
    )
  }

  const updateBuyIn = (playerId: string, index: number, value: number) => {
    setPlayerData((prev) =>
      prev.map((p) =>
        p.playerId === playerId
          ? {
              ...p,
              buyIns: p.buyIns.map((buyIn, i) => (i === index ? value : buyIn)),
            }
          : p
      )
    )
  }

  const updateCashOut = (playerId: string, value: number) => {
    setPlayerData((prev) =>
      prev.map((p) => (p.playerId === playerId ? { ...p, cashOut: value } : p))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || includedPlayers.length === 0) return

    setIsSubmitting(true)

    try {
      const sessionEntries: SessionEntry[] = includedPlayers.map((p) => ({
        playerId: p.playerId,
        playerName: p.playerName,
        buyIns: p.buyIns,
        cashOut: p.cashOut,
        profit: calculateProfit(p.buyIns, p.cashOut),
      }))

      const newSession: PokerSession = {
        id: nanoid(),
        date: format(date, "MMMM do, yyyy"),
        type: sessionType,
        players: sessionEntries,
        totalCashOnTable,
        commonExpenses,
        validated: true,
      }

      onAddSession(newSession)

      // Reset form
      setPlayerData((prev) =>
        prev.map((p) => ({
          ...p,
          included: false,
          buyIns: [50],
          cashOut: 0,
        }))
      )
      setDate(new Date())
      setSessionType("cash")
      setCommonExpenses(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You need to add players before creating sessions
          </p>
          <p className="text-sm text-muted-foreground">
            Go to the Players tab to add your first player
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Poker Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date, Session Type, and Common Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Session Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "MMMM do, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Session Type</Label>
                <Select
                  value={sessionType}
                  onValueChange={(value: "cash" | "tournament") =>
                    setSessionType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash Game</SelectItem>
                    <SelectItem value="tournament">Tournament</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="common-expenses">
                  Common Expenses
                  <span className="text-xs text-muted-foreground ml-1">
                    (food, drinks, venue)
                  </span>
                </Label>
                <Input
                  id="common-expenses"
                  type="number"
                  value={commonExpenses}
                  onChange={(e) =>
                    setCommonExpenses(Number(e.target.value) || 0)
                  }
                  placeholder="Amount in SEK"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Player Selection and Buy-ins */}
            <div className="space-y-4">
              <Label>Players and Buy-ins</Label>
              <div className="space-y-3">
                {playerData.map((player) => {
                  const totalBuyIns = calculateTotalBuyIns(player.buyIns)
                  const profit = calculateProfit(player.buyIns, player.cashOut)

                  return (
                    <Card key={player.playerId} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={player.included}
                              onCheckedChange={() =>
                                togglePlayerInclusion(player.playerId)
                              }
                            />
                            <span className="font-medium">
                              {player.playerName}
                            </span>
                          </div>
                          {player.included && (
                            <Badge
                              variant={profit >= 0 ? "default" : "destructive"}
                            >
                              {profit >= 0 ? "+" : ""}
                              {formatSEK(profit)}
                            </Badge>
                          )}
                        </div>

                        {player.included && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Buy-ins */}
                            <div className="space-y-2">
                              <Label className="text-sm">
                                Buy-ins ({formatSEK(totalBuyIns)} total)
                              </Label>
                              <div className="space-y-2">
                                {player.buyIns.map((buyIn, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      type="number"
                                      value={buyIn}
                                      onChange={(e) =>
                                        updateBuyIn(
                                          player.playerId,
                                          index,
                                          Number(e.target.value) || 0
                                        )
                                      }
                                      placeholder="Amount in SEK"
                                      min="0"
                                      step="0.01"
                                      className="flex-1"
                                    />
                                    {player.buyIns.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          removeBuyIn(player.playerId, index)
                                        }
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addBuyIn(player.playerId)}
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Rebuy
                                </Button>
                              </div>
                            </div>

                            {/* Cash Out */}
                            <div className="space-y-2">
                              <Label
                                htmlFor={`cashout-${player.playerId}`}
                                className="text-sm"
                              >
                                Cash Out
                              </Label>
                              <Input
                                id={`cashout-${player.playerId}`}
                                type="number"
                                value={player.cashOut}
                                onChange={(e) =>
                                  updateCashOut(
                                    player.playerId,
                                    Number(e.target.value) || 0
                                  )
                                }
                                placeholder="Amount in SEK"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Session Summary */}
            {includedPlayers.length > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        Total Cash on Table
                      </p>
                      <p className="font-medium text-lg">
                        {formatSEK(totalCashOnTable)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Common Expenses</p>
                      <p className="font-medium text-lg">
                        {formatSEK(commonExpenses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected Cash Out</p>
                      <p className="font-medium text-lg">
                        {formatSEK(expectedCashOut)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Actual Cash Out</p>
                      <p className="font-medium text-lg">
                        {formatSEK(totalCashOut)}
                      </p>
                    </div>
                  </div>

                  {/* Validation Status */}
                  <div className="mt-4">
                    {isValid ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          ✅ Cash outs match expected amount (after common
                          expenses)
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          ⚠️ Cash outs don't match expected amount
                          {difference !== 0 && (
                            <span className="block">
                              Difference: {difference > 0 ? "+" : ""}
                              {formatSEK(difference)}
                            </span>
                          )}
                          {commonExpenses > 0 && (
                            <span className="block text-xs mt-1">
                              Expected: {formatSEK(totalCashOnTable)} -{" "}
                              {formatSEK(commonExpenses)} ={" "}
                              {formatSEK(expectedCashOut)}
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              disabled={
                !isValid || includedPlayers.length === 0 || isSubmitting
              }
              className="w-full"
            >
              {isSubmitting ? "Adding Session..." : "Add Session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
