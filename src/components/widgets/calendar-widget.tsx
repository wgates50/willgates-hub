"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { Calendar, Clock, MapPin, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns"

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
  const [filter, setFilter] = useState<"today" | "week">("week")

  const fetchCalendar = () => {
    setLoading(true)
    setError(null)
    fetch("/api/calendar")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("auth")
          throw new Error("Failed to fetch")
        }
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCalendar()
  }, [])

  const filteredEvents = data?.events.filter((event) => {
    const startStr = event.start?.dateTime || event.start?.date
    if (!startStr) return false
    const start = parseISO(startStr)
    if (filter === "today") return isToday(start)
    return isThisWeek(start)
  })

  const groupedEvents = groupByDay(filteredEvents || [])

  return (
    <WidgetWrapper
      title="Calendar"
      icon={<Calendar className="h-4 w-4 text-blue-500" />}
      headerActions={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter("today")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filter === "today"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filter === "week"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Week
          </button>
          <button
            onClick={fetchCalendar}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-1"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      <ScrollArea className="h-full">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : error === "auth" ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
            <Calendar className="h-8 w-8 mx-auto opacity-40" />
            <p>Calendar access expired.</p>
            <p className="text-xs">Sign out and sign back in to reconnect.</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
            <Calendar className="h-8 w-8 mx-auto opacity-40" />
            <p>Couldn't load calendar.</p>
            <button onClick={fetchCalendar} className="text-xs text-primary hover:underline">
              Try again
            </button>
          </div>
        ) : !filteredEvents?.length ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No events {filter === "today" ? "today" : "this week"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedEvents).map(([day, events]) => (
              <div key={day}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {day}
                </p>
                <div className="space-y-1.5">
                  {events.map((event: CalendarEvent) => {
                    const startStr = event.start?.dateTime || event.start?.date || ""
                    const endStr = event.end?.dateTime || event.end?.date || ""
                    const isAllDay = !event.start?.dateTime
                    return (
                      <div
                        key={event.id}
                        className="flex gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div
                          className="w-1 rounded-full shrink-0 mt-0.5"
                          style={{ backgroundColor: event.calendarColor || "#3b82f6" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.summary}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {isAllDay
                                ? "All day"
                                : `${format(parseISO(startStr), "HH:mm")} – ${format(parseISO(endStr), "HH:mm")}`}
                            </span>
                            {event.location && (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetWrapper>
  )
}

function groupByDay(events: CalendarEvent[]) {
  const groups: Record<string, CalendarEvent[]> = {}
  events.forEach((event) => {
    const startStr = event.start?.dateTime || event.start?.date || ""
    const start = parseISO(startStr)
    let dayLabel: string
    if (isToday(start)) dayLabel = "Today"
    else if (isTomorrow(start)) dayLabel = "Tomorrow"
    else dayLabel = format(start, "EEEE, d MMMM")
    if (!groups[dayLabel]) groups[dayLabel] = []
    groups[dayLabel].push(event)
  })
  return groups
}
