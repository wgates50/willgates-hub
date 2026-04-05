"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Link2 } from "lucide-react"

const LINKS = [
  { label: "YouTube", url: "https://youtube.com", icon: "▶", color: "text-red-400", bg: "bg-red-500/12 hover:bg-red-500/20", borderHover: "hover:border-red-500/30" },
  { label: "Claude", url: "https://claude.ai", icon: "◈", color: "text-amber-400", bg: "bg-amber-500/12 hover:bg-amber-500/20", borderHover: "hover:border-amber-500/30" },
  { label: "Gmail", url: "https://mail.google.com", icon: "✉", color: "text-blue-400", bg: "bg-blue-500/12 hover:bg-blue-500/20", borderHover: "hover:border-blue-500/30" },
  { label: "GitHub", url: "https://github.com", icon: "⌘", color: "text-zinc-400 dark:text-zinc-300", bg: "bg-zinc-500/12 hover:bg-zinc-500/20", borderHover: "hover:border-zinc-500/30" },
  { label: "Calendar", url: "https://calendar.google.com", icon: "◉", color: "text-green-400", bg: "bg-green-500/12 hover:bg-green-500/20", borderHover: "hover:border-green-500/30" },
  { label: "ChatGPT", url: "https://chat.openai.com", icon: "◆", color: "text-emerald-400", bg: "bg-emerald-500/12 hover:bg-emerald-500/20", borderHover: "hover:border-emerald-500/30" },
]

export function QuickLinksWidget() {
  return (
    <WidgetWrapper
      title="Shortcuts"
      icon={<Link2 className="h-4 w-4 text-sky-400" />}
      accentColor="hsl(199, 89%, 48%)"
    >
      <div className="grid grid-cols-3 gap-2 stagger-children">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`shortcut-card group flex flex-col items-center gap-1.5 rounded-xl border border-border/30 p-3 ${link.borderHover}`}
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-all ${link.bg} ${link.color}`}>
              {link.icon}
            </span>
            <span className="text-[11px] text-muted-foreground/60 group-hover:text-foreground/80 transition-colors font-medium">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
