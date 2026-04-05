"use client"

import { useState } from "react"
import { Clock, CheckCircle2, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PROJECTS, AUTOMATIONS, getAppUrl } from "@/lib/apps-config"
import type { Automation } from "@/lib/apps-config"

export default function AppsPage() {
  const [expandedAuto, setExpandedAuto] = useState<string | null>(null)

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Apps & Projects</h1>
        <p className="text-[13px] text-muted-foreground/70 mt-1">
          All your apps, projects, and automations in one place.
        </p>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest mb-3">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              href={getAppUrl(project.slug)}
              className="group block rounded-xl border border-border/40 overflow-hidden hover:border-border/70 hover:bg-accent/10 transition-all"
            >
              <div className={`h-[2px] bg-gradient-to-r ${project.color}`} />
              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${project.iconBg}`}>
                      {project.emoji}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">{project.description}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
                <p className="text-[12px] text-muted-foreground/50 leading-relaxed">{project.longDescription}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/50 text-muted-foreground/60">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Badge
                    variant={project.status === "live" ? "default" : "secondary"}
                    className="text-[9px] h-5"
                  >
                    {project.status === "live" ? (
                      <><CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />Live</>
                    ) : (
                      <><Clock className="h-2.5 w-2.5 mr-0.5" />Building</>
                    )}
                  </Badge>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Automations */}
      <div>
        <h2 className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest mb-3">
          Automations
        </h2>
        <div className="space-y-1.5">
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
      className="w-full text-left rounded-xl border border-border/40 hover:border-border/60 transition-all overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3.5">
        <span className="text-lg shrink-0">{automation.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium">{automation.name}</p>
          <p className="text-[11px] text-muted-foreground/50">{automation.schedule}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground/50">Active</span>
          </div>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/40" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40" />
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-3.5 pb-3.5 pt-0 border-t border-border/30">
          <div className="pt-3 space-y-2.5">
            <p className="text-[12px] text-muted-foreground/60 leading-relaxed">{automation.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Schedule", value: automation.scheduleDetail },
                { label: "Last ran", value: automation.lastRan || "Never" },
                { label: "Next run", value: automation.nextRun || "—" },
                { label: "Outputs to", value: automation.outputs || "—" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-secondary/30 p-2.5">
                  <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider font-medium">{item.label}</p>
                  <p className="text-[11px] font-medium mt-1 text-foreground/80">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </button>
  )
}
