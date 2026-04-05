"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Link2 } from "lucide-react"

interface QuickLink {
  label: string
  url: string
  icon: string
  color: string
  bgColor: string
}

const LINKS: QuickLink[] = [
  {
    label: "YouTube",
    url: "https://youtube.com",
    icon: "▶",
    color: "text-red-400",
    bgColor: "bg-red-500/15",
  },
  {
    label: "Claude",
    url: "https://claude.ai",
    icon: "◈",
    color: "text-amber-400",
    bgColor: "bg-amber-500/15",
  },
  {
    label: "Gmail",
    url: "https://mail.google.com",
    icon: "✉",
    color: "text-blue-400",
    bgColor: "bg-blue-500/15",
  },
  {
    label: "GitHub",
    url: "https://github.com",
    icon: "⌘",
    color: "text-zinc-300",
    bgColor: "bg-zinc-500/15",
  },
  {
    label: "Calendar",
    url: "https://calendar.google.com",
    icon: "◉",
    color: "text-green-400",
    bgColor: "bg-green-500/15",
  },
  {
    label: "ChatGPT",
    url: "https://chat.openai.com",
    icon: "◆",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/15",
  },
]

export function QuickLinksWidget() {
  return (
    <WidgetWrapper
      title="Shortcuts"
      icon={<Link2 className="h-4 w-4 text-sky-400" />}
      accentColor="hsl(199, 89%, 48%)"
    >
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shortcut-card group flex flex-col items-center gap-1.5 rounded-lg border border-border/40 p-3 hover:border-border/70 hover:bg-accent/40 transition-all"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${link.bgColor} ${link.color}`}
            >
              {link.icon}
            </span>
            <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
