"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { MapPin, ArrowUpRight, Ticket, Music, Utensils, Palette } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LondonEvent {
  id: string
  title: string
  venue: string
  date: string
  category: "music" | "food" | "art" | "theatre" | "other"
  url?: string
}

const CATEGORY_CONFIG = {
  music: { icon: Music, color: "text-violet-400", bg: "bg-violet-500/10" },
  food: { icon: Utensils, color: "text-amber-400", bg: "bg-amber-500/10" },
  art: { icon: Palette, color: "text-rose-400", bg: "bg-rose-500/10" },
  theatre: { icon: Ticket, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  other: { icon: MapPin, color: "text-blue-400", bg: "bg-blue-500/10" },
}

// Placeholder events — will be populated by the London Event Scanner automation
const FEATURED_EVENTS: LondonEvent[] = [
  {
    id: "1",
    title: "Check What's On London for this week's events",
    venue: "Powered by London Event Scanner",
    date: "Updated weekly",
    category: "other",
  },
]

export function WhatsOnWidget() {
  return (
    <WidgetWrapper
      title="What's On London"
      icon={<MapPin className="h-4 w-4 text-rose-400" />}
      accentColor="hsl(346, 77%, 60%)"
      headerActions={
        <a
          href="/apps/whats-on-london"
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
        >
          Open app
          <ArrowUpRight className="h-3 w-3" />
        </a>
      }
    >
      <ScrollArea className="h-full">
        <div className="space-y-3">
          {/* Featured app card */}
          <a
            href="/apps/whats-on-london"
            className="group block rounded-lg border border-border/60 p-4 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 text-lg">
                🎭
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-rose-400 transition-colors">
                  What's On London
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Events across London venues, festivals, and pop-ups. Updated every Monday by the London Event Scanner.
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            </div>
          </a>

          {/* Category quick links */}
          <div className="grid grid-cols-2 gap-2">
            {(["music", "food", "art", "theatre"] as const).map((cat) => {
              const config = CATEGORY_CONFIG[cat]
              const Icon = config.icon
              return (
                <a
                  key={cat}
                  href="/apps/whats-on-london"
                  className="group flex items-center gap-2.5 rounded-lg border border-border/40 p-2.5 hover:border-border/70 hover:bg-accent/30 transition-all"
                >
                  <div className={`p-1.5 rounded-md ${config.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                  </div>
                  <span className="text-xs font-medium capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                    {cat}
                  </span>
                </a>
              )
            })}
          </div>

          {/* Automation status */}
          <div className="flex items-center gap-2 px-1 pt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-muted-foreground">
              London Event Scanner runs every Monday at 6am
            </span>
          </div>
        </div>
      </ScrollArea>
    </WidgetWrapper>
  )
}
