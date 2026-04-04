"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Link2, ExternalLink, Bot, Mail, Calendar, Newspaper, Briefcase, MapPin } from "lucide-react"

interface QuickLink {
  label: string
  url: string
  icon: React.ElementType
  description: string
}

const LINKS: QuickLink[] = [
  {
    label: "Morning Brief",
    url: "#",
    icon: Newspaper,
    description: "Today's briefing from Cowork",
  },
  {
    label: "Reading Digest",
    url: "#",
    icon: Bot,
    description: "Smart reading digest",
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
    description: "Full calendar view",
  },
  {
    label: "Job Alerts",
    url: "#",
    icon: Briefcase,
    description: "Job scanner results",
  },
  {
    label: "London Events",
    url: "#",
    icon: MapPin,
    description: "Weekly event scan",
  },
]

export function QuickLinksWidget() {
  return (
    <WidgetWrapper
      title="Quick Links"
      icon={<Link2 className="h-4 w-4 text-sky-500" />}
    >
      <div className="space-y-1">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{link.label}</p>
              <p className="text-[11px] text-muted-foreground">{link.description}</p>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
