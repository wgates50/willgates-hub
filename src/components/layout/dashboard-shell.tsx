"use client"

import { useState, createContext, useContext } from "react"
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

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen noise-bg">
        <Sidebar />
        <main
          className="transition-all duration-300"
          style={{ paddingLeft: collapsed ? 60 : 220 }}
        >
          <div className="p-5 max-w-[1440px]">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
