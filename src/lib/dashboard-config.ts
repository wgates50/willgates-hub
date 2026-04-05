import type { Layout } from "react-grid-layout"

export interface WidgetConfig {
  id: string
  type: "calendar" | "whats-on" | "brief" | "stats" | "apps" | "quicklinks"
  title: string
  visible: boolean
}

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "calendar", type: "calendar", title: "My Calendar", visible: true },
  { id: "whats-on", type: "whats-on", title: "What's On London", visible: true },
  { id: "brief", type: "brief", title: "Daily Brief", visible: true },
  { id: "stats", type: "stats", title: "Stats", visible: true },
  { id: "apps", type: "apps", title: "My Apps", visible: true },
  { id: "quicklinks", type: "quicklinks", title: "Quick Links", visible: true },
]

export const DEFAULT_LAYOUT: Layout[] = [
  { i: "calendar", x: 0, y: 0, w: 8, h: 8, minW: 4, minH: 4 },
  { i: "quicklinks", x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "brief", x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "whats-on", x: 0, y: 8, w: 6, h: 6, minW: 3, minH: 3 },
  { i: "stats", x: 6, y: 8, w: 6, h: 6, minW: 3, minH: 3 },
  { i: "apps", x: 0, y: 14, w: 12, h: 5, minW: 4, minH: 3 },
]

export const GRID_COLS = 12
export const ROW_HEIGHT = 40
export const GRID_MARGIN: [number, number] = [14, 14]
