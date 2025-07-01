"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { saveData, getData } from "@/lib/api-service"
import type { PokerPlayer, PokerSession } from "@/types/poker-timer"
import {
  Save,
  Download,
  Key,
  AlertCircle,
  CheckCircle,
  FileDown,
  FileUp,
} from "lucide-react"

interface SaveLoadSessionsProps {
  players: PokerPlayer[]
  sessions: PokerSession[]
  onLoadData: (players: PokerPlayer[], sessions: PokerSession[]) => void
}

export function SaveLoadSessions({
  players,
  sessions,
  onLoadData,
}: SaveLoadSessionsProps) {
  const [savedPassword, setSavedPassword] = useLocalStorage<string>(
    "poker-session-password",
    ""
  )

  // Fixed key for all users - no need to enter this
  const STORAGE_KEY = "poker-sessions-app"

  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [savePassword, setSavePassword] = useState(savedPassword)
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Load dialog state
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [loadPassword, setLoadPassword] = useState(savedPassword)
  const [isLoading, setIsLoading] = useState(false)
  const [loadResult, setLoadResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Password dialog state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [newPassword, setNewPassword] = useState(savedPassword)

  const handleSave = async () => {
    const passwordToUse = savePassword.trim() || savedPassword

    if (!passwordToUse) {
      setSaveResult({
        success: false,
        message: "Please enter a password",
      })
      return
    }

    setIsSaving(true)
    setSaveResult(null)

    try {
      const response = await saveData({
        key: STORAGE_KEY,
        password: passwordToUse,
        data: {
          players,
          sessions,
          timestamp: new Date().toISOString(),
        },
      })

      if (response.success) {
        // Save the password for future use
        setSavedPassword(passwordToUse)
        setSaveResult({
          success: true,
          message: "Sessions saved successfully!",
        })

        // Close dialog after success if using saved password
        if (savedPassword) {
          setTimeout(() => {
            setShowSaveDialog(false)
            setSaveResult(null)
          }, 2000)
        }
      } else {
        setSaveResult({
          success: false,
          message: response.message || "Failed to save sessions",
        })
      }
    } catch (error) {
      setSaveResult({
        success: false,
        message: "Network error occurred while saving",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoad = async () => {
    const passwordToUse = loadPassword.trim() || savedPassword

    if (!passwordToUse) {
      setLoadResult({
        success: false,
        message: "Please enter a password",
      })
      return
    }

    setIsLoading(true)
    setLoadResult(null)

    try {
      const response = await getData({
        key: STORAGE_KEY,
        password: passwordToUse,
      })

      if (response.success && response.data) {
        const { players: loadedPlayers, sessions: loadedSessions } =
          response.data

        if (loadedPlayers && loadedSessions) {
          // Save the password for future use
          setSavedPassword(passwordToUse)

          // Load the data
          onLoadData(loadedPlayers, loadedSessions)

          setLoadResult({
            success: true,
            message: `Successfully loaded ${loadedPlayers.length} players and ${loadedSessions.length} sessions!`,
          })

          // Close dialog after a delay
          setTimeout(() => {
            setShowLoadDialog(false)
            setLoadResult(null)
          }, 2000)
        } else {
          setLoadResult({
            success: false,
            message: "Invalid data format in saved sessions",
          })
        }
      } else {
        setLoadResult({
          success: false,
          message: response.message || "Failed to load sessions",
        })
      }
    } catch (error) {
      setLoadResult({
        success: false,
        message: "Network error occurred while loading",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = () => {
    setSavedPassword(newPassword)
    setShowPasswordDialog(false)

    // Update the save/load forms with new password
    setSavePassword(newPassword)
    setLoadPassword(newPassword)
  }

  // Quick save using saved password
  const handleQuickSave = async () => {
    if (!savedPassword) {
      setShowSaveDialog(true)
      return
    }

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
        // Show a temporary success message (could be a toast in a real app)
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

  // Quick load using saved password
  const handleQuickLoad = async () => {
    if (!savedPassword) {
      setShowLoadDialog(true)
      return
    }

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

  // Export to JSON file
  const handleExportToFile = () => {
    try {
      const exportData = {
        players,
        sessions,
        timestamp: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `poker-sessions-${
        new Date().toISOString().split("T")[0]
      }.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert("Sessions exported successfully!")
    } catch (error) {
      alert("Failed to export sessions")
    }
  }

  // Import from JSON file
  const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importData = JSON.parse(content)

        if (importData.players && importData.sessions) {
          onLoadData(importData.players, importData.sessions)
          alert(
            `Successfully imported ${importData.players.length} players and ${importData.sessions.length} sessions!`
          )
        } else {
          alert(
            "Invalid file format. Please select a valid session backup file."
          )
        }
      } catch (error) {
        alert("Failed to read file. Please make sure it's a valid JSON file.")
      }
    }

    reader.readAsText(file)
    // Reset the input so the same file can be selected again
    event.target.value = ""
  }

  const totalSessions = sessions.length
  const totalPlayers = players.length

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Cloud Save & Load
          </CardTitle>
          <CardDescription>
            Save your sessions to the cloud or load previously saved data.
            Currently tracking {totalPlayers} players and {totalSessions}{" "}
            sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {savedPassword ? (
              <Button
                onClick={handleQuickSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save to Cloud"}
              </Button>
            ) : (
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save to Cloud
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Sessions to Cloud</DialogTitle>
                    <DialogDescription>
                      Save your current players and sessions to the cloud for
                      backup or sharing across devices.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="save-password">Password</Label>
                      <Input
                        id="save-password"
                        type="password"
                        placeholder="Enter your password"
                        value={savePassword}
                        onChange={(e) => setSavePassword(e.target.value)}
                      />
                    </div>
                    {saveResult && (
                      <Alert
                        variant={saveResult.success ? "default" : "destructive"}
                      >
                        {saveResult.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                          {saveResult.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowSaveDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {savedPassword ? (
              <Button
                onClick={handleQuickLoad}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isLoading ? "Loading..." : "Load from Cloud"}
              </Button>
            ) : (
              <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Load from Cloud
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Load Sessions from Cloud</DialogTitle>
                    <DialogDescription>
                      Load previously saved players and sessions from the cloud.
                      This will replace your current data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="load-password">Password</Label>
                      <Input
                        id="load-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loadPassword}
                        onChange={(e) => setLoadPassword(e.target.value)}
                      />
                    </div>
                    {loadResult && (
                      <Alert
                        variant={loadResult.success ? "default" : "destructive"}
                      >
                        {loadResult.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                          {loadResult.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleLoad} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Load"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowLoadDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Dialog
              open={showPasswordDialog}
              onOpenChange={setShowPasswordDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Cloud Password</DialogTitle>
                  <DialogDescription>
                    Update your password for cloud save/load operations.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePasswordChange}>
                      Save Password
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Local File Backup
          </CardTitle>
          <CardDescription>
            Export your sessions to a local file or import from a previously
            exported file. Files are saved in JSON format and work offline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleExportToFile}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export to File
            </Button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFromFile}
                style={{ display: "none" }}
                id="file-import"
              />
              <Button
                onClick={() => document.getElementById("file-import")?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileUp className="h-4 w-4" />
                Import from File
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              • Export creates a JSON file with all your players and sessions
            </p>
            <p>• Import replaces all current data with the imported data</p>
            <p>• Files are compatible across different devices and browsers</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
