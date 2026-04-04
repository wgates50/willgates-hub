"use client"

import { WidgetWrapper } from "./widget-wrapper"
import { BarChart3, TrendingUp, Zap, Clock } from "lucide-react"

const stats = [
  {
    label: "Active Projects",
    value: "6",
    change: "+1 this month",
    icon: Zap,
    color: "text-blue-500",
  },
  {
    label: "Automations Running",
    value: "6",
    change: "All healthy",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "Tasks Due This Week",
    value: "5",
    change: "1 overdue",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    label: "Deployments (30d)",
    value: "12",
    change: "+3 vs last month",
    icon: BarChart3,
    color: "text-purple-500",
  },
]

export function StatsWidget() {
  return (
    <WidgetWrapper
      title="Stats"
      icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
    >
      <div className="grid grid-cols-2 gap-3 h-full">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
    </WidgetWrapper>
  )
}
