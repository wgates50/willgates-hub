"use client"

import { ExternalLink, Github, Zap, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AppProject {
  name: string
  description: string
  longDescription: string
  url: string
  github?: string
  color: string
  emoji: string
  status: "live" | "building" | "planned"
  tech: string[]
}

const PROJECTS: AppProject[] = [
  {
    name: "What's On London",
    description: "Event calendar for London happenings",
    longDescription: "Aggregates events across London venues, festivals, and pop-ups. Powered by weekly automated scans.",
    url: "https://whats-on-london.vercel.app",
    color: "from-rose-500/20 to-rose-600/5",
    emoji: "🎭",
    status: "live",
    tech: ["Next.js", "Vercel", "Cowork Automation"],
  },
  {
    name: "Album Club",
    description: "Collaborative album listening & rating",
    longDescription: "A social app for listening clubs — pick albums, rate tracks, discuss with friends. Built with Supabase auth and real-time features.",
    url: "https://album-club.vercel.app",
    color: "from-violet-500/20 to-violet-600/5",
    emoji: "💿",
    status: "live",
    tech: ["Next.js", "Supabase", "Tailwind"],
  },
  {
    name: "MusicBox",
    description: "Spotify new release tracker",
    longDescription: "Tracks new releases from your favourite Spotify artists. Never miss an album drop or single release.",
    url: "https://musicbox.vercel.app",
    color: "from-emerald-500/20 to-emerald-600/5",
    emoji: "🎵",
    status: "live",
    tech: ["Next.js", "Spotify API", "Vercel"],
  },
  {
    name: "TaskFlow",
    description: "Personal Asana alternative",
    longDescription: "A lightweight project management tool built exactly how you want it. Kanban boards, custom sections, and clean design.",
    url: "https://taskflow.vercel.app",
    color: "from-blue-500/20 to-blue-600/5",
    emoji: "✅",
    status: "building",
    tech: ["Next.js", "Vercel", "React DnD"],
  },
  {
    name: "Click Tracker",
    description: "Link click analytics",
    longDescription: "Simple analytics for tracking link clicks across your projects. Lightweight alternative to full analytics suites.",
    url: "https://click-tracker.vercel.app",
    color: "from-amber-500/20 to-amber-600/5",
    emoji: "📊",
    status: "live",
    tech: ["Next.js", "Vercel"],
  },
  {
    name: "Upcoming",
    description: "Release & event countdown tracker",
    longDescription: "Track upcoming releases, events, and deadlines with countdown timers and notifications.",
    url: "https://upcoming.vercel.app",
    color: "from-cyan-500/20 to-cyan-600/5",
    emoji: "📅",
    status: "live",
    tech: ["Next.js", "Vercel"],
  },
]

const AUTOMATIONS = [
  { name: "Morning Brief", schedule: "Daily 7:00am", status: "active", emoji: "☀️" },
  { name: "Smart Reading Digest", schedule: "Daily", status: "active", emoji: "📚" },
  { name: "Email to Calendar", schedule: "Daily", status: "active", emoji: "📧" },
  { name: "Job Alert Scanner", schedule: "Daily", status: "active", emoji: "💼" },
  { name: "London Event Scanner", schedule: "Weekly", status: "active", emoji: "🗺️" },
  { name: "Monthly Life Admin", schedule: "Monthly", status: "active", emoji: "🗂️" },
]

export default function AppsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Apps & Projects</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All your apps, projects, and automations in one place.
        </p>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((project) => (
            <Card key={project.name} className="group hover:shadow-md transition-all overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.emoji}</span>
                    <div>
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant={project.status === "live" ? "default" : "secondary"}
                    className="text-[10px] shrink-0"
                  >
                    {project.status === "live" ? (
                      <><CheckCircle2 className="h-3 w-3 mr-1" />Live</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1" />Building</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{project.longDescription}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Open App
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Automations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Automations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AUTOMATIONS.map((auto) => (
            <div
              key={auto.name}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
            >
              <span className="text-xl">{auto.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{auto.name}</p>
                <p className="text-xs text-muted-foreground">{auto.schedule}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[11px] text-muted-foreground">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
