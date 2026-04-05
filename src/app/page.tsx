"use client"

import Link from "next/link"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowRight, Fingerprint, ExternalLink } from "lucide-react"
import { startAuthentication } from "@simplewebauthn/browser"
import { PROJECTS, getAppUrl } from "@/lib/apps-config"

const SHORTCUTS = [
  { name: "YouTube", url: "https://youtube.com", icon: "▶", color: "bg-red-500/10 text-red-400" },
  { name: "Claude", url: "https://claude.ai", icon: "◈", color: "bg-amber-500/10 text-amber-400" },
  { name: "Gmail", url: "https://mail.google.com", icon: "✉", color: "bg-blue-500/10 text-blue-400" },
  { name: "GitHub", url: "https://github.com", icon: "⌘", color: "bg-zinc-500/10 text-zinc-400" },
  { name: "Calendar", url: "https://calendar.google.com", icon: "◉", color: "bg-green-500/10 text-green-400" },
  { name: "ChatGPT", url: "https://chat.openai.com", icon: "◆", color: "bg-emerald-500/10 text-emerald-400" },
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passkeyLoading, setPasskeyLoading] = useState(false)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true)
    try {
      const optRes = await fetch("/api/passkey/auth/options", { method: "POST" })
      if (!optRes.ok) throw new Error("No passkeys registered")
      const { options, sessionId } = await optRes.json()
      const credential = await startAuthentication(options)
      const verifyRes = await fetch("/api/passkey/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, sessionId }),
      })
      if (!verifyRes.ok) throw new Error("Verification failed")
      router.refresh()
      window.location.href = "/dashboard"
    } catch (err: any) {
      console.error("Passkey login error:", err)
      if (err.message?.includes("No passkeys")) {
        signIn("google", { callbackUrl: "/dashboard" })
      }
    } finally {
      setPasskeyLoading(false)
    }
  }

  const liveProjects = PROJECTS.filter((p) => p.status === "live")

  // Show loading while checking session / redirecting
  if (status === "loading" || session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-4xl flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              W
            </div>
            <span className="font-semibold text-sm">willgates.dev</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePasskeyLogin}
              disabled={passkeyLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Fingerprint className={`h-4 w-4 ${passkeyLoading ? "animate-pulse" : ""}`} />
              Sign in
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero */}
          <div className="space-y-3 pt-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Will Gates
            </h1>
            <p className="text-lg text-muted-foreground">
              Building apps and automations. Based in London.
            </p>
          </div>

          {/* Shortcuts */}
          <div className="space-y-4">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Shortcuts
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SHORTCUTS.map((shortcut) => (
                <a
                  key={shortcut.name}
                  href={shortcut.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 hover:bg-accent/50 hover:border-border transition-all"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${shortcut.color}`}>
                    {shortcut.icon}
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {shortcut.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {liveProjects.map((project) => (
                <a
                  key={project.slug}
                  href={getAppUrl(project.slug)}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 p-4 hover:bg-accent/50 hover:border-border transition-all"
                >
                  <span className="text-2xl shrink-0">{project.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>willgates.dev</span>
          <span>London</span>
        </div>
      </footer>
    </div>
  )
}
