"use client"

import { useEffect, useState, useRef } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { BarChart3, Zap, GitBranch, Activity, TrendingUp, ExternalLink, MessageSquare } from "lucide-react"

// Animated counter hook
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
      // ease-out cubic
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
    { label: "Projects", value: projects.toString(), icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/15 hover:border-blue-500/30" },
    { label: "Automations", value: automations.toString(), icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/15 hover:border-emerald-500/30" },
    { label: "Deploys", value: data.loading ? "..." : deploys.toString(), icon: GitBranch, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/15 hover:border-violet-500/30" },
    { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/15 hover:border-amber-500/30" },
  ]

  return (
    <WidgetWrapper
      title="Stats"
      icon={<BarChart3 className="h-3.5 w-3.5 text-violet-400" />}
      accentColor="hsl(263, 70%, 58%)"
    >
      <div className="flex flex-col gap-2 h-full stagger-children">
        <div className="grid grid-cols-2 gap-1.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`glow-on-hover rounded-lg border ${stat.border} p-2.5 flex flex-col transition-all cursor-default`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">{stat.label}</span>
                <div className={`p-1 rounded-md ${stat.bg}`}>
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold tracking-tight mt-1 stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        <a
          href="https://console.anthropic.com/settings/usage"
          target="_blank"
          rel="noopener noreferrer"
          className="interactive-row flex items-center gap-2.5 rounded-lg border border-amber-500/15 p-2.5 hover:border-amber-500/30 group"
        >
          <div className="p-1 rounded-md bg-amber-500/10">
            <MessageSquare className="h-3 w-3 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium group-hover:text-amber-400 transition-colors">Claude Usage</p>
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
        </a>
      </div>
    </WidgetWrapper>
  )
}
