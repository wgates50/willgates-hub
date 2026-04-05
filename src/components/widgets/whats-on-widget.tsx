"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { MapPin, ArrowUpRight, Music, Utensils, Palette, Ticket } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const CATEGORIES = [
  { name: "Music", icon: Music, color: "text-violet-400", bg: "bg-violet-500/10", borderHover: "hover:bg-violet-500/15 hover:border-violet-500/25" },
  { name: "Food", icon: Utensils, color: "text-amber-400", bg: "bg-amber-500/10", borderHover: "hover:bg-amber-500/15 hover:border-amber-500/25" },
  { name: "Art", icon: Palette, color: "text-rose-400", bg: "bg-rose-500/10", borderHover: "hover:bg-rose-500/15 hover:border-rose-500/25" },
  { name: "Theatre", icon: Ticket, color: "text-emerald-400", bg: "bg-emerald-500/10", borderHover: "hover:bg-emerald-500/15 hover:border-emerald-500/25" },
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
          className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-foreground/70 transition-colors px-2 py-1 rounded-lg hover:bg-accent/50"
        >
          Open <ArrowUpRight className="h-3 w-3" />
        </a>
      }
    >
      <ScrollArea className="h-full">
        <div className="space-y-3 stagger-children">
          {/* Featured app link */}
          <a
            href="/apps/whats-on-london"
            className="interactive-row group block rounded-xl border border-border/40 p-3.5 hover:border-rose-500/25"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/15 to-pink-500/10 text-lg transition-transform group-hover:scale-110">
                🎭
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium group-hover:text-rose-400 transition-colors">
                  Explore events
                </p>
                <p className="text-[11px] text-muted-foreground/50 mt-0.5 leading-relaxed">
                  Venues, festivals, and pop-ups across London
                </p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-rose-400/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-0.5" />
            </div>
          </a>

          {/* Categories */}
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <a
                  key={cat.name}
                  href="/apps/whats-on-london"
                  className={`shortcut-card group flex items-center gap-2.5 rounded-xl border border-border/30 p-2.5 ${cat.borderHover} transition-all`}
                >
                  <div className={`p-1.5 rounded-lg ${cat.bg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-3.5 w-3.5 ${cat.color}`} />
                  </div>
                  <span className="text-[12px] font-medium text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
                    {cat.name}
                  </span>
                </a>
              )
            })}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-0.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-[11px] text-muted-foreground/40">
              Scanner runs every Monday at 6am
            </span>
          </div>
        </div>
      </ScrollArea>
    </WidgetWrapper>
  )
}
