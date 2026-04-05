"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Grid3X3, ArrowUpRight } from "lucide-react"
import { PROJECTS, getAppUrl } from "@/lib/apps-config"

export function AppsWidget() {
  return (
    <WidgetWrapper
      title="My Apps"
      icon={<Grid3X3 className="h-3.5 w-3.5 text-indigo-400" />}
      accentColor="hsl(239, 84%, 67%)"
      headerActions={
        <a
          href="/apps"
          className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50 hover:text-foreground/70 transition-colors px-1.5 py-0.5 rounded-md hover:bg-accent/40"
        >
          All <ArrowUpRight className="h-2.5 w-2.5" />
        </a>
      }
    >
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 stagger-children">
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={getAppUrl(project.slug)}
            className="shortcut-card group flex flex-col items-center gap-1 rounded-lg border border-border/30 p-2.5 hover:border-border/60"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition-transform group-hover:scale-110 ${project.iconBg}`}>
              {project.emoji}
            </div>
            <p className="text-[10px] font-medium truncate w-full text-center text-muted-foreground/60 group-hover:text-foreground/70 transition-colors">
              {project.name}
            </p>
          </a>
        ))}
      </div>
    </WidgetWrapper>
  )
}
