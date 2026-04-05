"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { Grid3X3 } from "lucide-react"
import { PROJECTS, getAppUrl } from "@/lib/apps-config"

export function AppsWidget() {
  return (
    <WidgetWrapper
      title="My Apps"
      icon={<Grid3X3 className="h-4 w-4 text-indigo-500" />}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={getAppUrl(project.slug)}
            className="group flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 hover:border-border transition-all"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${project.widgetColor}`}>
              {project.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {project.name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {project.description}
              </p>
              {project.status === "building" && (
                <span className="inline-flex items-center mt-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 rounded-full px-1.5 py-0.5">
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
