"use client"

import { Sidebar } from "./sidebar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen noise-bg">
      <Sidebar />
      <main className="pl-[220px] transition-all duration-300">
        <div className="p-6 max-w-[1400px]">{children}</div>
      </main>
    </div>
  )
}
