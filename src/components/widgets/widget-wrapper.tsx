"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface WidgetWrapperProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerActions?: React.ReactNode
}

export function WidgetWrapper({
  title,
  icon,
  children,
  className,
  headerActions,
}: WidgetWrapperProps) {
  return (
    <Card className={cn("h-full flex flex-col overflow-hidden border-border/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="widget-drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-accent transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          {icon}
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </div>
        {headerActions}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-4 pb-4 pt-0 min-h-0">
        {children}
      </CardContent>
    </Card>
  )
}
