"use client"

import { useState, useCallback } from "react"
import { Responsive, WidthProvider, Layout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { useSession } from "next-auth/react"
import {
  DEFAULT_LAYOUT,
  DEFAULT_WIDGETS,
  GRID_COLS,
  ROW_HEIGHT,
  GRID_MARGIN,
} from "@/lib/dashboard-config"
import { CalendarWidget } from "@/components/widgets/calendar-widget"
import { BriefWidget } from "@/components/widgets/brief-widget"
import { TasksWidget } from "@/components/widgets/tasks-widget"
import { StatsWidget } from "@/components/widgets/stats-widget"
import { AppsWidget } from "@/components/widgets/apps-widget"
import { QuickLinksWidget } from "@/components/widgets/quicklinks-widget"
import { Lock, Unlock, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const ResponsiveGridLayout = WidthProvider(Responsive)

function getStoredLayout(): Layout[] | null {
  if (typeof window === "undefined") return null
  try {
    const stored = window.__dashboardLayout
    return stored || null
  } catch {
    return null
  }
}

// Extend window for in-memory layout storage (no localStorage)
declare global {
  interface Window {
    __dashboardLayout?: Layout[]
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [layout, setLayout] = useState<Layout[]>(getStoredLayout() || DEFAULT_LAYOUT)
  const [locked, setLocked] = useState(true)
  const widgets = DEFAULT_WIDGETS

  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout)
    if (typeof window !== "undefined") {
      window.__dashboardLayout = newLayout
    }
  }, [])

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT)
    if (typeof window !== "undefined") {
      window.__dashboardLayout = undefined
    }
  }, [])

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "calendar":
        return <CalendarWidget />
      case "brief":
        return <BriefWidget />
      case "tasks":
        return <TasksWidget />
      case "stats":
        return <StatsWidget />
      case "apps":
        return <AppsWidget />
      case "quicklinks":
        return <QuickLinksWidget />
      default:
        return null
    }
  }

  const greeting = getGreeting(session?.user?.name || "Will")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocked(!locked)}
            className="gap-2"
          >
            {locked ? (
              <>
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Locked</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                <span className="hidden sm:inline">Editing</span>
              </>
            )}
          </Button>
          {!locked && (
            <Button variant="ghost" size="sm" onClick={resetLayout} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Widget Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: GRID_COLS, md: 10, sm: 6, xs: 4 }}
        rowHeight={ROW_HEIGHT}
        margin={GRID_MARGIN}
        isDraggable={!locked}
        isResizable={!locked}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag-handle"
        compactType="vertical"
      >
        {widgets
          .filter((w) => w.visible)
          .map((widget) => (
            <div key={widget.id} className="widget-container">
              {renderWidget(widget.id)}
            </div>
          ))}
      </ResponsiveGridLayout>
    </div>
  )
}

function getGreeting(name: string) {
  const hour = new Date().getHours()
  const firstName = name.split(" ")[0]
  if (hour < 12) return `Good morning, ${firstName}`
  if (hour < 17) return `Good afternoon, ${firstName}`
  return `Good evening, ${firstName}`
}
