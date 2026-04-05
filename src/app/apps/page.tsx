"use client"

import { useState } from "react"
import { Clock, CheckCircle2, ChevronDown, ChevronUp, ArrowUpRight, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PROJECTS, AUTOMATIONS, getAppUrl } from "@/lib/apps-config"
import type { Automation } from "@/lib/apps-config"

export default function AppsPage() {
  const [expandedAuto, setExpandedAuto] = useState<string | null>(null)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Apps & Projects</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All your apps, projects, and automations in one place.
        </p>
      </div>

      {/* Projects Grid — clickable cards, no buttons */}
      <div>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              href={getAppUrl(project.slug)}
              className="group block rounded-xl border border-border/50 overflow-hidden hover:border-border hover:shadow-lg hover:shadow-black/5 transition-all"
            >
              <div className={`h-1 bg-gradient-to-r ${project.color}`} />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={project.status === "live" ? "default" : "secondary"}
                      className="text-[10px] shrink-0"
                    >
                      {project.status === "live" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" />Live</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" />Building</>
                      )}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{project.longDescription}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-mono">
                  willgates.dev/apps/{project.slug}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Automations — clickable with expanded details */}
      <div>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Automations
        </h2>
        <div className="space-y-2">
          {AUTOMATIONS.map((auto) => (
            <AutomationCard
              key={auto.id}
              automation={auto}
              expanded={expandedAuto === auto.id}
              onToggle={() => setExpandedAuto(expandedAuto === auto.id ? null : auto.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AutomationCard({
  automation,
  expanded,
  onToggle,
}: {
  automation: Automation
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-xl border border-border/50 hover:border-border transition-all overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        <span className="text-xl shrink-0">{automation.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{automation.name}</p>
          <p className="text-xs text-muted-foreground">{automation.schedule}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-[11px] text-muted-foreground">Active</span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50">
          <div className="pt-3 space-y-3">
            <p className="text-sm text-muted-foreground">{automation.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-secondary/50 p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Schedule</p>
                <p className="text-xs font-medium mt-1">{automation.scheduleDetail}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last ran</p>
                <p className="text-xs font-medium mt-1">{automation.lastRan || "Never"}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Next run</p>
                <p className="text-xs font-medium mt-1">{automation.nextRun || "—"}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Outputs to</p>
                <p className="text-xs font-medium mt-1">{automation.outputs || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}
