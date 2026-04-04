"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, Palette, Bell, Fingerprint, Plus, Trash2 } from "lucide-react"
import { startRegistration } from "@simplewebauthn/browser"

interface PasskeyInfo {
  id: string
  createdAt: string
  transports?: string[]
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([])
  const [registering, setRegistering] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/passkey/credentials")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPasskeys(data)
      })
      .catch(() => {})
  }, [])

  const handleRegisterPasskey = async () => {
    setRegistering(true)
    setMessage(null)
    try {
      const optRes = await fetch("/api/passkey/register/options", { method: "POST" })
      if (!optRes.ok) throw new Error("Failed to get options")
      const { options, sessionId } = await optRes.json()

      const credential = await startRegistration({ optionsJSON: options })

      const verifyRes = await fetch("/api/passkey/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, sessionId }),
      })

      if (!verifyRes.ok) throw new Error("Registration failed")

      setMessage({ type: "success", text: "Passkey registered! You can now sign in with Touch ID." })
      // Refresh passkeys list
      const listRes = await fetch("/api/passkey/credentials")
      const data = await listRes.json()
      if (Array.isArray(data)) setPasskeys(data)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to register passkey" })
    } finally {
      setRegistering(false)
    }
  }

  const handleDeletePasskey = async (id: string) => {
    try {
      await fetch("/api/passkey/credentials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialId: id }),
      })
      setPasskeys((prev) => prev.filter((p) => p.id !== id))
      setMessage({ type: "success", text: "Passkey removed." })
    } catch {
      setMessage({ type: "error", text: "Failed to delete passkey" })
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and dashboard preferences.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Account
          </CardTitle>
          <CardDescription>Your Google account details and sign-in status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-lg">
                {session?.user?.name?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session?.user?.name || "Will Gates"}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email || ""}</p>
              <Badge variant="outline" className="mt-1 text-[10px]">
                Google OAuth
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>

      {/* Passkeys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            Passkeys
          </CardTitle>
          <CardDescription>
            Sign in with Touch ID, Face ID, or Windows Hello instead of Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passkeys.length > 0 ? (
            <div className="space-y-2">
              {passkeys.map((pk) => (
                <div
                  key={pk.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Passkey</p>
                      <p className="text-xs text-muted-foreground">
                        Registered {new Date(pk.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePasskey(pk.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No passkeys registered yet. Add one to sign in with your fingerprint.
            </p>
          )}
          <Button
            onClick={handleRegisterPasskey}
            disabled={registering}
            className="gap-2"
          >
            {registering ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Waiting for Touch ID...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add passkey
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
          <CardDescription>Customise the look and feel of your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Theme and layout customisation coming soon. For now, the dashboard uses dark mode by default and you can rearrange widgets by clicking the unlock button on the dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Integrations
          </CardTitle>
          <CardDescription>Connected services and data sources.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">📅</span>
                <div>
                  <p className="text-sm font-medium">Google Calendar</p>
                  <p className="text-xs text-muted-foreground">Calendar events on your dashboard</p>
                </div>
              </div>
              <Badge variant={session?.accessToken ? "default" : "secondary"}>
                {session?.accessToken ? "Connected" : "Not connected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="text-sm font-medium">Cowork Automations</p>
                  <p className="text-xs text-muted-foreground">Morning brief, digests, scanners</p>
                </div>
              </div>
              <Badge variant="outline">6 active</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🚀</span>
                <div>
                  <p className="text-sm font-medium">Vercel</p>
                  <p className="text-xs text-muted-foreground">Deployment status and stats</p>
                </div>
              </div>
              <Badge variant="outline">6 projects</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
