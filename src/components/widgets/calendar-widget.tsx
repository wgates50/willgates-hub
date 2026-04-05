"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { Calendar, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  startOfWeek,
  endOfWeek,
  addWeeks,
  eachDayOfInterval,
  isSameDay,
} from "date-fns"

interface CalendarEvent {
  id: string
  summary: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  location?: string
  calendarName: string
  calendarColor: string
}

interface CalendarData {
  calendars: { id: string; name: string; color: string }[]
  events: CalendarEvent[]
}

export function CalendarWidget() {
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)

  const currentWeekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 })
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd })

  const fetchCalendar = () => {
    setLoading(true)
    setError(null)
    fetch("/api/calendar")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("auth")
          throw new Error("Failed")
        }
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCalendar() }, [])

  const eventsByDay = weekDays.map((day) => ({
    day,
    events: (data?.events || []).filter((e) => {
      const s = e.start?.dateTime || e.start?.date
      return s ? isSameDay(parseISO(s), day) : false
    }),
  }))

  const weekLabel = weekOffset === 0 ? "This week" : weekOffset === 1 ? "Next week" : weekOffset === -1 ? "Last week" : `${format(currentWeekStart, "d MMM")} – ${format(currentWeekEnd, "d MMM")}`

  return (
    <WidgetWrapper
      title="My Calendar"
      icon={<Calendar className="h-4 w-4 text-blue-400" />}
      accentColor="hsl(217, 91%, 60%)"
      headerActions={
        <div className="flex items-center gap-0.5">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground/70 hover:bg-accent/50 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-2 py-1 rounded-lg text-[11px] font-medium text-muted-foreground/50 hover:bg-accent/50 hover:text-foreground/70 transition-colors">
            {weekLabel}
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground/70 hover:bg-accent/50 transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button onClick={fetchCalendar} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground/70 hover:bg-accent/50 transition-colors ml-0.5">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      <ScrollArea className="h-full">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/30 animate-pulse" />
                <div className="flex-1 h-10 rounded-lg bg-muted/20 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error === "auth" ? (
          <div className="text-center py-8 text-muted-foreground/50 text-[13px] space-y-2">
            <Calendar className="h-8 w-8 mx-auto opacity-20" />
            <p>Calendar expired</p>
            <p className="text-[11px] text-muted-foreground/30">Sign out & back in to reconnect</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground/50 text-[13px] space-y-2">
            <Calendar className="h-8 w-8 mx-auto opacity-20" />
            <button onClick={fetchCalendar} className="text-[11px] text-primary hover:underline">Retry</button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {eventsByDay.map(({ day, events }) => {
              const today = isToday(day)
              const dayLabel = today ? "Today" : isTomorrow(day) ? "Tomorrow" : format(day, "EEE")

              return (
                <div
                  key={day.toISOString()}
                  className={`flex gap-3 py-1.5 rounded-lg transition-colors ${today ? "calendar-today -mx-1.5 px-1.5" : "hover:bg-accent/20 -mx-1 px-1"}`}
                >
                  <div className="w-10 shrink-0 text-center pt-0.5">
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${today ? "text-primary" : "text-muted-foreground/40"}`}>
                      {dayLabel}
                    </p>
                    <p className={`text-base font-bold mt-0.5 ${today ? "text-primary" : "text-foreground/60"}`}>
                      {format(day, "d")}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 border-l border-border/30 pl-3 min-h-[2.5rem] py-0.5">
                    {events.length > 0 ? (
                      <div className="space-y-1">
                        {events.map((event) => {
                          const startStr = event.start?.dateTime || event.start?.date || ""
                          const endStr = event.end?.dateTime || event.end?.date || ""
                          const isAllDay = !event.start?.dateTime
                          return (
                            <div key={event.id} className="interactive-row flex gap-2 py-1 rounded-lg px-1.5 -mx-1.5">
                              <div className="w-[3px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: event.calendarColor || "#3b82f6" }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium truncate leading-snug">{event.summary}</p>
                                <span className="text-[11px] text-muted-foreground/50">
                                  {isAllDay ? "All day" : `${format(parseISO(startStr), "HH:mm")} – ${format(parseISO(endStr), "HH:mm")}`}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/25 pt-1.5 italic">No events</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </WidgetWrapper>
  )
}
