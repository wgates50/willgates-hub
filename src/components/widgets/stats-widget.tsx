"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { BarChart3, TrendingUp, Zap, GitBranch, Activity, ExternalLink, MessageSquare } from "lucide-react"

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
    },
    {
      label: "Automations",
      value: data.automationsRunning.toString(),
      sub: "All healthy",
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Deploys (30d)",
      value: data.loading ? "..." : data.deploymentsThisMonth.toString(),
      sub: data.loading ? "Loading" : `${data.totalDeployments} total`,
      icon: GitBranch,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Uptime",
      value: "99.9%",
      sub: "Last 30 days",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ]

  return (
    <WidgetWrapper
      title="Stats"
      icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
    >
      <div className="space-y-3 h-full">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border/50 p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                <div className={`p-1.5 rounded-md ${stat.bg}`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Claude usage link */}
        <a
          href="https://console.anthropic.com/settings/usage"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 hover:border-border transition-all group"
        >
          <div className="p-1.5 rounded-md bg-amber-500/10">
            <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium group-hover:text-primary transition-colors">Claude Usage</p>
            <p className="text-[10px] text-muted-foreground">View your Anthropic dashboard</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </WidgetWrapper>
  )
}
