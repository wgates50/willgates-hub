"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pl-[240px] transition-all duration-300">
        <div className="p-6 max-w-[1400px]">{children}</div>
      </main>
    </div>
  )
}
