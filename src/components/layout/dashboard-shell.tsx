"use client"

import { useState, useEffect, useCallback, createContext, useContext } from "react"
import { Sidebar } from "./sidebar"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: true,
  setCollapsed: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true)

  // Tell react-grid-layout to recalculate when sidebar changes
  const handleSetCollapsed = useCallback((v: boolean) => {
    setCollapsed(v)
    // WidthProvider listens for window resize to recalculate grid width
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 310) // after the 300ms CSS transition
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed: handleSetCollapsed }}>
      <div className="min-h-screen noise-bg">
        <Sidebar />
        <main
          className="transition-all duration-300"
          style={{ paddingLeft: collapsed ? 60 : 220 }}
        >
          <div className="px-5 py-4">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
