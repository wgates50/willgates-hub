"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { BarChart3, Zap, GitBranch, Activity, TrendingUp, ExternalLink, MessageSquare } from "lucide-react"

interface StatsData {
  activeProjects: number
  automationsRunning: number
  deploymentsThisMonth: number
  totalDeployments: number
  loading: boolean
}

export function StatsWidget() {
  const [data, setData] = useState<StatsData>({
    activeProjects: 6,
    automationsRunning: 6,
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
        setData((prev) => ({ ...prev, loading: false }))
      })
  }, [])

  const stats = [
    {
      label: "Projects",
      value: data.activeProjects.toString(),
      sub: "Active on Vercel",
      icon: Zap,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Automations",
      value: data.automationsRunning.toString(),
      sub: "Running",
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Deploys",
      value: data.loading ? "..." : data.deploymentsThisMonth.toString(),
      sub: data.loading ? "Loading" : "Last 30 days",
      icon: GitBranch,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    {
      label: "Uptime",
      value: "99.9%",
      sub: "Last 30 days",
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ]

  return (
    <WidgetWrapper
      title="Stats"
      icon={<BarChart3 className="h-4 w-4 text-violet-400" />}
      accentColor="hsl(263, 70%, 58%)"
    >
      <div className="flex flex-col gap-2.5 h-full">
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg border ${stat.borderColor} bg-gradient-to-br from-transparent to-transparent p-3 flex flex-col justify-between hover:border-opacity-50 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
                <div className={`p-1.5 rounded-md ${stat.bg}`}>
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Claude usage link */}
        <a
          href="https://console.anthropic.com/settings/usage"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-amber-500/20 p-3 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group"
        >
          <div className="p-1.5 rounded-md bg-amber-500/10">
            <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium group-hover:text-amber-400 transition-colors">Claude Usage</p>
            <p className="text-[10px] text-muted-foreground/60">Anthropic dashboard</p>
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
        </a>
      </div>
    </WidgetWrapper>
  )
}
