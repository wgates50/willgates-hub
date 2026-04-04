"use client"

import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, Palette, Bell } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and dashboard preferences.
        </p>
      </div>

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
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
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
