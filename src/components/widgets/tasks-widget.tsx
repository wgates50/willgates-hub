"use client"

import { useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { CheckSquare, Circle, CheckCircle2, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  status: "todo" | "in_progress" | "done" | "overdue"
  dueDate?: string
  project?: string
}

// Demo tasks — replace with real API integration (Asana, TaskFlow, etc.)
const DEMO_TASKS: Task[] = [
  { id: "1", title: "Connect TaskFlow API to dashboard", status: "in_progress", project: "Hub" },
  { id: "2", title: "Set up willgates.dev domain", status: "todo", dueDate: "2026-04-05", project: "Hub" },
  { id: "3", title: "Album Club: Supabase migration", status: "todo", dueDate: "2026-04-07", project: "Album Club" },
  { id: "4", title: "MusicBox: Fix release notifications", status: "in_progress", project: "MusicBox" },
  { id: "5", title: "Review CPH1 task", status: "overdue", dueDate: "2026-03-30", project: "Personal" },
  { id: "6", title: "What's On: Add new venue data", status: "todo", dueDate: "2026-04-10", project: "What's On" },
]

export function TasksWidget() {
  const [tasks] = useState<Task[]>(DEMO_TASKS)
  const [showCompleted, setShowCompleted] = useState(false)

  const activeTasks = tasks.filter((t) => t.status !== "done")
  const overdue = activeTasks.filter((t) => t.status === "overdue").length
  const inProgress = activeTasks.filter((t) => t.status === "in_progress").length

  return (
    <WidgetWrapper
      title="Tasks"
      icon={<CheckSquare className="h-4 w-4 text-green-500" />}
      headerActions={
        <div className="flex items-center gap-2">
          {overdue > 0 && (
            <Badge variant="destructive" className="text-[10px] h-5">
              {overdue} overdue
            </Badge>
          )}
          <Badge variant="secondary" className="text-[10px] h-5">
            {inProgress} active
          </Badge>
        </div>
      }
    >
      <ScrollArea className="h-full">
        <div className="space-y-1">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              {task.status === "overdue" ? (
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              ) : task.status === "in_progress" ? (
                <Circle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {task.project && (
                    <span className="text-[11px] text-muted-foreground">{task.project}</span>
                  )}
                  {task.dueDate && (
                    <span className={`text-[11px] ${task.status === "overdue" ? "text-destructive" : "text-muted-foreground"}`}>
                      Due {task.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetWrapper>
  )
}
