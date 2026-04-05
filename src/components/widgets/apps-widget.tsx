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
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </a>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={getAppUrl(project.slug)}
            className="group flex flex-col items-center gap-2 rounded-lg border border-border/40 p-3 hover:border-border/70 hover:bg-accent/30 transition-all shortcut-card"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${project.iconBg}`}
            >
              {project.emoji}
            </div>
            <div className="text-center min-w-0 w-full">
              <p className="text-[12px] font-medium truncate group-hover:text-primary transition-colors">
                {project.name}
              </p>
              {project.status === "building" && (
                <span className="inline-flex items-center mt-0.5 text-[9px] font-medium text-amber-400 bg-amber-500/10 rounded-full px-1.5 py-0.5">
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
