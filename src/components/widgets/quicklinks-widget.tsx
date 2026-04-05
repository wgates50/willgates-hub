"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Link2 } from "lucide-react"

const LINKS = [
  { label: "YouTube", url: "https://youtube.com", icon: "▶", color: "text-red-400", bg: "bg-red-500/12 hover:bg-red-500/20" },
  { label: "Claude", url: "https://claude.ai", icon: "◈", color: "text-amber-400", bg: "bg-amber-500/12 hover:bg-amber-500/20" },
  { label: "Gmail", url: "https://mail.google.com", icon: "✉", color: "text-blue-400", bg: "bg-blue-500/12 hover:bg-blue-500/20" },
  { label: "GitHub", url: "https://github.com", icon: "⌘", color: "text-zinc-400 dark:text-zinc-300", bg: "bg-zinc-500/12 hover:bg-zinc-500/20" },
  { label: "Calendar", url: "https://calendar.google.com", icon: "◉", color: "text-green-400", bg: "bg-green-500/12 hover:bg-green-500/20" },
  { label: "ChatGPT", url: "https://chat.openai.com", icon: "◆", color: "text-emerald-400", bg: "bg-emerald-500/12 hover:bg-emerald-500/20" },
]

export function QuickLinksWidget() {
  return (
    <WidgetWrapper
      title="Shortcuts"
      icon={<Link2 className="h-3.5 w-3.5 text-sky-400" />}
      accentColor="hsl(199, 89%, 48%)"
    >
      <div className="grid grid-cols-3 gap-1.5 stagger-children">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shortcut-card group flex flex-col items-center gap-1 rounded-lg border border-border/30 p-2.5 hover:border-border/60"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all ${link.bg} ${link.color}`}>
              {link.icon}
            </span>
            <span className="text-[10px] text-muted-foreground/60 group-hover:text-foreground/70 transition-colors font-medium">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
