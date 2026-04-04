"use client"

import { Sidebar } from "./sidebar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pl-[240px] transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
