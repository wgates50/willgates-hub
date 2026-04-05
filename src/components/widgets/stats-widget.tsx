"use client"

import { useEffect, useState, useRef } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { BarChart3, Zap, GitBranch, Activity, TrendingUp, ExternalLink, MessageSquare } from "lucide-react"

function useAnimatedValue(target: number, duration = 800) {
  const [value, setValue] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = ref.current
    const diff = target - start
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + diff * eased)
      setValue(current)
      ref.current = current
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return value
}

export function StatsWidget() {
  const [data, setData] = useState({
    activeProjects: 0,
    automationsRunning: 0,
    deploymentsThisMonth: 0,
    totalDeployments: 0,
    loading: true,
  })

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((stats) => {
        setData({
          activeProjects: stats.activeProjects ?? 6,
          automationsRunning: stats.automationsRunning ?? 6,
          deploymentsThisMonth: stats.deploymentsThisMonth ?? 0,
          totalDeployments: stats.totalDeployments ?? 0,
          loading: false,
        })
      })
      .catch(() => {
        setData({ activeProjects: 6, automationsRunning: 6, deploymentsThisMonth: 0, totalDeployments: 0, loading: false })
      })
  }, [])

  const projects = useAnimatedValue(data.activeProjects)
  const automations = useAnimatedValue(data.automationsRunning)
  const deploys = useAnimatedValue(data.deploymentsThisMonth)

  const stats = [
    { label: "Projects", value: projects.toString(), icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10", borderColor: "rgba(59,130,246,0.15)", hoverBorderColor: "rgba(59,130,246,0.35)", statColor: "rgba(59,130,246,0.12)" },
    { label: "Automations", value: automations.toString(), icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", borderColor: "rgba(16,185,129,0.15)", hoverBorderColor: "rgba(16,185,129,0.35)", statColor: "rgba(16,185,129,0.12)" },
    { label: "Deploys", value: data.loading ? "..." : deploys.toString(), icon: GitBranch, color: "text-violet-500", bg: "bg-violet-500/10", borderColor: "rgba(139,92,246,0.15)", hoverBorderColor: "rgba(139,92,246,0.35)", statColor: "rgba(139,92,246,0.12)" },
    { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", borderColor: "rgba(245,158,11,0.15)", hoverBorderColor: "rgba(245,158,11,0.35)", statColor: "rgba(245,158,11,0.12)" },
  ]

  return (
    <WidgetWrapper
      title="Stats"
      icon={<BarChart3 className="h-4 w-4 text-violet-400" />}
      accentColor="hsl(263, 70%, 58%)"
    >
      <div className="flex flex-col gap-2.5 h-full stagger-children">
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card rounded-xl border p-3 flex flex-col cursor-default"
              style={{
                borderColor: stat.borderColor,
                ["--stat-color" as string]: stat.statColor,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = stat.hoverBorderColor }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = stat.borderColor }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
                <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold tracking-tight mt-1.5 stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        <a
          href="https://console.anthropic.com/settings/usage"
          target="_blank"
          rel="noopener noreferrer"
          className="interactive-row flex items-center gap-3 rounded-xl border border-amber-500/15 p-3 hover:border-amber-500/30 group"
        >
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium group-hover:text-amber-400 transition-colors">Claude Usage</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
        </a>
      </div>
    </WidgetWrapper>
  )
}
