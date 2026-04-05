"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Grid3X3, ArrowUpRight } from "lucide-react"
import { PROJECTS, getAppUrl } from "@/lib/apps-config"

export function AppsWidget() {
  return (
    <WidgetWrapper
      title="My Apps"
      icon={<Grid3X3 className="h-4 w-4 text-indigo-400" />}
      accentColor="hsl(239, 84%, 67%)"
      headerActions={
        <a
          href="/apps"
          className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-foreground/70 transition-colors px-2 py-1 rounded-lg hover:bg-accent/50"
        >
          All <ArrowUpRight className="h-3 w-3" />
        </a>
      }
    >
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 stagger-children">
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={getAppUrl(project.slug)}
            className="shortcut-card group flex flex-col items-center gap-1.5 rounded-xl border border-border/30 p-3 hover:border-border/60"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-transform group-hover:scale-110 ${project.iconBg}`}>
              {project.emoji}
            </div>
            <p className="text-[11px] font-medium truncate w-full text-center text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
              {project.name}
            </p>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
