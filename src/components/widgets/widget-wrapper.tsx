"use client"

import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface WidgetWrapperProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerActions?: React.ReactNode
  accentColor?: string
}

export function WidgetWrapper({
  title,
  icon,
  children,
  className,
  headerActions,
  accentColor,
}: WidgetWrapperProps) {
  return (
    <div className={cn("widget-card h-full flex flex-col", className)}>
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: 0.4,
          }}
        />
      )}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="widget-drag-handle cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 rounded opacity-30 hover:opacity-80 transition-opacity">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
          {icon}
          <h3 className="text-[12px] font-semibold tracking-tight text-foreground/80">{title}</h3>
        </div>
        {headerActions && (
          <div className="flex items-center gap-0.5">{headerActions}</div>
        )}
      </div>
      <div className="flex-1 overflow-auto px-3 pb-2.5 pt-0 min-h-0">
        {children}
      </div>
    </div>
  )
}
