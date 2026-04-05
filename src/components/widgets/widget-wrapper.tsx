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
    <div
      className={cn("widget-card h-full flex flex-col", className)}
      style={
        accentColor
          ? ({ "--widget-accent": accentColor } as React.CSSProperties)
          : undefined
      }
    >
      {/* Left accent bar — thick, visible, brightens on hover */}
      {accentColor && (
        <div
          className="widget-accent-bar"
          style={{ background: accentColor }}
        />
      )}
      {/* Top shimmer line */}
      {accentColor && (
        <div
          className="widget-top-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${accentColor} 50%, transparent 95%)`,
          }}
        />
      )}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5 shrink-0 relative z-[1]">
        <div className="flex items-center gap-2">
          <div className="widget-drag-handle cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 rounded opacity-25 hover:opacity-80 transition-opacity">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          {icon}
          <h3 className="text-[13px] font-semibold tracking-tight text-foreground/85">{title}</h3>
        </div>
        {headerActions && (
          <div className="flex items-center gap-0.5">{headerActions}</div>
        )}
      </div>
      <div className="flex-1 overflow-auto px-3.5 pb-3 pt-0 min-h-0 relative z-[1]">
        {children}
      </div>
    </div>
  )
}
