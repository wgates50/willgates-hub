"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { ExternalLink, Grid3X3 } from "lucide-react"

interface AppProject {
  name: string
  description: string
  url: string
  color: string
  emoji: string
  status: "live" | "building" | "planned"
}

const PROJECTS: AppProject[] = [
  {
    name: "What's On London",
    description: "Event calendar for London happenings",
    url: "https://whats-on-london.vercel.app",
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    emoji: "🎭",
    status: "live",
  },
  {
    name: "Album Club",
    description: "Collaborative album listening & rating",
    url: "https://album-club.vercel.app",
    color: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    emoji: "💿",
    status: "live",
  },
  {
    name: "MusicBox",
    description: "Spotify new release tracker",
    url: "https://musicbox.vercel.app",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    emoji: "🎵",
    status: "live",
  },
  {
    name: "TaskFlow",
    description: "Personal Asana alternative",
    url: "https://taskflow.vercel.app",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emoji: "✅",
    status: "building",
  },
  {
    name: "Click Tracker",
    description: "Link click analytics",
    url: "https://click-tracker.vercel.app",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    emoji: "📊",
    status: "live",
  },
  {
    name: "Upcoming",
    description: "Release & event countdown tracker",
    url: "https://upcoming.vercel.app",
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    emoji: "📅",
    status: "live",
  },
]

export function AppsWidget() {
  return (
    <WidgetWrapper
      title="My Apps"
      icon={<Grid3X3 className="h-4 w-4 text-indigo-500" />}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-all hover:shadow-sm"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-lg ${project.color}`}>
              {project.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium truncate">{project.name}</p>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {project.description}
              </p>
              {project.status === "building" && (
                <span className="inline-flex items-center mt-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 rounded-full px-1.5 py-0.5">
                  Building
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
