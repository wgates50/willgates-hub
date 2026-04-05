"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Link2, ExternalLink, Bot, Mail, Calendar, Newspaper, Briefcase, MapPin, Play, MessageSquare } from "lucide-react"

interface QuickLink {
  label: string
  url: string
  icon: React.ElementType
  description: string
}

const LINKS: QuickLink[] = [
  {
    label: "YouTube",
    url: "https://youtube.com",
    icon: Play,
    description: "Videos",
  },
  {
    label: "Claude",
    url: "https://claude.ai",
    icon: MessageSquare,
    description: "AI assistant",
  },
  {
    label: "Gmail",
    url: "https://mail.google.com",
    icon: Mail,
    description: "Email inbox",
  },
  {
    label: "Google Calendar",
    url: "https://calendar.google.com",
    icon: Calendar,
    description: "Full calendar",
  },
  {
    label: "Morning Brief",
    url: "#",
    icon: Newspaper,
    description: "Today's brief",
  },
  {
    label: "London Events",
    url: "#",
    icon: MapPin,
    description: "Weekly events",
  },
]

export function QuickLinksWidget() {
  return (
    <WidgetWrapper
      title="Quick Links"
      icon={<Link2 className="h-4 w-4 text-sky-500" />}
    >
      <div className="space-y-0.5">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{link.label}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{link.description}</span>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
