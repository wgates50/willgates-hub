"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, LogOut, Settings, Fingerprint } from "lucide-react"
import { startAuthentication } from "@simplewebauthn/browser"

export function PublicHeader() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passkeyLoading, setPasskeyLoading] = useState(false)

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true)
    try {
      // Get authentication options
      const optRes = await fetch("/api/passkey/auth/options", { method: "POST" })
      if (!optRes.ok) throw new Error("No passkeys registered")
      const { options, sessionId } = await optRes.json()

      // Trigger Touch ID / platform authenticator
      const credential = await startAuthentication(options)

      // Verify with server
      const verifyRes = await fetch("/api/passkey/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, sessionId }),
      })

      if (!verifyRes.ok) throw new Error("Verification failed")

      // Refresh the page to pick up the new session cookie
      router.refresh()
      window.location.href = "/dashboard"
    } catch (err: any) {
      console.error("Passkey login error:", err)
      // Fall back to Google sign-in if no passkeys registered
      if (err.message?.includes("No passkeys")) {
        signIn("google")
      }
    } finally {
      setPasskeyLoading(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            W
          </div>
          <span className="font-semibold text-sm">willgates.dev</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            Home
          </Link>
          <Link
            href="/apps"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            Apps
          </Link>

          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse ml-2" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="text-xs">
                      {session.user?.name?.charAt(0) || "W"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1.5 ml-2">
              <Button
                onClick={handlePasskeyLogin}
                variant="ghost"
                size="sm"
                className="text-sm gap-1.5 h-8"
                disabled={passkeyLoading}
              >
                <Fingerprint className={`h-4 w-4 ${passkeyLoading ? "animate-pulse" : ""}`} />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
              <Button
                onClick={() => signIn("google")}
                variant="ghost"
                size="sm"
                className="text-sm gap-1.5 h-8 text-muted-foreground"
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
