"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { saveData, getData } from "@/lib/api-service"
import type { PokerPlayer, PokerSession } from "@/types/poker-timer"
import { Save, Download } from "lucide-react"

interface QuickSaveLoadProps {
  players: PokerPlayer[]
  sessions: PokerSession[]
  onLoadData: (players: PokerPlayer[], sessions: PokerSession[]) => void
}

export function QuickSaveLoad({
  players,
  sessions,
  onLoadData,
}: QuickSaveLoadProps) {
  const [savedPassword] = useLocalStorage<string>("poker-session-password", "")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fixed key for all users
  const STORAGE_KEY = "poker-sessions-app"

  // Don't render if no password is saved
  if (!savedPassword) {
    return null
  }

  const handleQuickSave = async () => {
    setIsSaving(true)
    try {
      const response = await saveData({
        key: STORAGE_KEY,
        password: savedPassword,
        data: {
          players,
          sessions,
          timestamp: new Date().toISOString(),
        },
      })

      if (response.success) {
        alert("Sessions saved successfully!")
      } else {
        alert(`Save failed: ${response.message || "Unknown error"}`)
      }
    } catch (error) {
      alert("Network error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuickLoad = async () => {
    setIsLoading(true)
    try {
      const response = await getData({
        key: STORAGE_KEY,
        password: savedPassword,
      })

      if (response.success && response.data) {
        const { players: loadedPlayers, sessions: loadedSessions } =
          response.data

        if (loadedPlayers && loadedSessions) {
          onLoadData(loadedPlayers, loadedSessions)
          alert(
            `Successfully loaded ${loadedPlayers.length} players and ${loadedSessions.length} sessions!`
          )
        } else {
          alert("Invalid data format in saved sessions")
        }
      } else {
        alert(`Load failed: ${response.message || "Unknown error"}`)
      }
    } catch (error) {
      alert("Network error occurred while loading")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleQuickSave}
        disabled={isSaving}
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
      >
        <Save className="h-3 w-3" />
        {isSaving ? "Saving..." : "Save"}
      </Button>
      <Button
        onClick={handleQuickLoad}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        {isLoading ? "Loading..." : "Load"}
      </Button>
    </div>
  )
}
