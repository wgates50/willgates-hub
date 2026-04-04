"use client"

import { useState, useCallback } from "react"
import { Responsive, WidthProvider, Layout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { PublicHeader } from "@/components/layout/public-header"
import { AppsWidget } from "@/components/widgets/apps-widget"
import { StatsWidget } from "@/components/widgets/stats-widget"
import { QuickLinksWidget } from "@/components/widgets/quicklinks-widget"
import { BriefWidget } from "@/components/widgets/brief-widget"

const ResponsiveGridLayout = WidthProvider(Responsive)

const PUBLIC_LAYOUT: Layout[] = [
  { i: "welcome", x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 2, static: true },
  { i: "apps", x: 0, y: 3, w: 8, h: 6, minW: 4, minH: 3 },
  { i: "stats", x: 8, y: 3, w: 4, h: 6, minW: 3, minH: 3 },
  { i: "quicklinks", x: 0, y: 9, w: 4, h: 5, minW: 3, minH: 3 },
]

export default function HomePage() {
  const [layout, setLayout] = useState<Layout[]>(PUBLIC_LAYOUT)

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
            rowHeight={40}
            margin={[16, 16]}
            isDraggable={false}
            isResizable={false}
            onLayoutChange={(newLayout) => setLayout(newLayout)}
            compactType="vertical"
          >
            <div key="welcome">
              <div className="h-full flex flex-col justify-center">
                <h1 className="text-3xl font-bold tracking-tight">Will Gates</h1>
                <p className="text-muted-foreground mt-1">
                  Personal hub — apps, projects, and automations.
                </p>
              </div>
            </div>
            <div key="apps">
              <AppsWidget />
            </div>
            <div key="stats">
              <StatsWidget />
            </div>
            <div key="quicklinks">
              <QuickLinksWidget />
            </div>
          </ResponsiveGridLayout>
        </div>
      </main>
    </div>
  )
}
