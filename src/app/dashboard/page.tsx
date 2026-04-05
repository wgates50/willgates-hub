"use client"

import { useState, useCallback, useEffect } from "react"
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
import { WhatsOnWidget } from "@/components/widgets/whats-on-widget"
import { BriefWidget } from "@/components/widgets/brief-widget"
import { StatsWidget } from "@/components/widgets/stats-widget"
import { AppsWidget } from "@/components/widgets/apps-widget"
import { QuickLinksWidget } from "@/components/widgets/quicklinks-widget"
import { Lock, Unlock, RotateCcw, Sun, Moon } from "lucide-react"

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

declare global {
  interface Window {
    __dashboardLayout?: Layout[]
  }
}

function useTheme() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage?.getItem("theme")
    if (stored === "light") {
      setDark(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
        localStorage?.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage?.setItem("theme", "light")
      }
      return next
    })
  }, [])

  return { dark, toggle }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [layout, setLayout] = useState<Layout[]>(getStoredLayout() || DEFAULT_LAYOUT)
  const [locked, setLocked] = useState(true)
  const { dark, toggle: toggleTheme } = useTheme()
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
      case "whats-on":
        return <WhatsOnWidget />
      case "brief":
        return <BriefWidget />
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
    <div className="space-y-3 animate-fade-in">
      {/* Compact header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-bold tracking-tight">{greeting}</h1>
          <span className="text-[12px] text-muted-foreground/50">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-foreground/70 hover:bg-accent/40 transition-colors"
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setLocked(!locked)}
            className={`p-1.5 rounded-lg transition-all ${
              locked
                ? "text-muted-foreground/50 hover:text-foreground/70 hover:bg-accent/40"
                : "bg-primary/10 text-primary"
            }`}
            title={locked ? "Unlock layout" : "Lock layout"}
          >
            {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </button>
          {!locked && (
            <button
              onClick={resetLayout}
              className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-foreground/70 hover:bg-accent/40 transition-colors"
              title="Reset layout"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
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
        useCSSTransforms={true}
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
