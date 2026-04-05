"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { Calendar, Clock, MapPin, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isThisWeek,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isSameWeek,
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

  const currentWeekStart = startOfWeek(
    weekOffset === 0 ? new Date() : addWeeks(new Date(), weekOffset),
    { weekStartsOn: 1 }
  )
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd })

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

  // Group events by day within the current week
  const eventsByDay = weekDays.map((day) => {
    const dayEvents = (data?.events || []).filter((event) => {
      const startStr = event.start?.dateTime || event.start?.date
      if (!startStr) return false
      return isSameDay(parseISO(startStr), day)
    })
    return { day, events: dayEvents }
  })

  const weekLabel = weekOffset === 0
    ? "This week"
    : weekOffset === 1
    ? "Next week"
    : weekOffset === -1
    ? "Last week"
    : `${format(currentWeekStart, "d MMM")} – ${format(currentWeekEnd, "d MMM")}`

  return (
    <WidgetWrapper
      title="My Calendar"
      icon={<Calendar className="h-4 w-4 text-blue-400" />}
      accentColor="hsl(217, 91%, 60%)"
      headerActions={
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
          >
            {weekLabel}
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={fetchCalendar}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors ml-0.5"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      <ScrollArea className="h-full">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-16 rounded bg-muted/40 animate-pulse" />
                <div className="h-10 rounded-lg bg-muted/20 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error === "auth" ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
            <Calendar className="h-8 w-8 mx-auto opacity-30" />
            <p className="text-xs">Calendar access expired</p>
            <p className="text-[11px] text-muted-foreground/60">Sign out and sign back in to reconnect</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
            <Calendar className="h-8 w-8 mx-auto opacity-30" />
            <p className="text-xs">Couldn't load calendar</p>
            <button onClick={fetchCalendar} className="text-[11px] text-primary hover:underline">
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {eventsByDay.map(({ day, events }) => {
              const isCurrentDay = isToday(day)
              const dayLabel = isToday(day)
                ? "Today"
                : isTomorrow(day)
                ? "Tomorrow"
                : format(day, "EEE")
              const dateLabel = format(day, "d")

              return (
                <div
                  key={day.toISOString()}
                  className={`flex gap-3 py-1.5 ${
                    isCurrentDay ? "" : ""
                  }`}
                >
                  {/* Day column */}
                  <div className="w-10 shrink-0 text-center pt-0.5">
                    <p
                      className={`text-[10px] font-medium uppercase tracking-wider ${
                        isCurrentDay ? "text-primary" : "text-muted-foreground/60"
                      }`}
                    >
                      {dayLabel}
                    </p>
                    <p
                      className={`text-base font-semibold mt-0.5 ${
                        isCurrentDay
                          ? "text-primary bg-primary/10 rounded-md w-7 h-7 flex items-center justify-center mx-auto"
                          : "text-foreground/70"
                      }`}
                    >
                      {dateLabel}
                    </p>
                  </div>

                  {/* Events column */}
                  <div className="flex-1 min-w-0 border-l border-border/40 pl-3 min-h-[2.5rem]">
                    {events.length > 0 ? (
                      <div className="space-y-1">
                        {events.map((event) => {
                          const startStr = event.start?.dateTime || event.start?.date || ""
                          const endStr = event.end?.dateTime || event.end?.date || ""
                          const isAllDay = !event.start?.dateTime
                          return (
                            <div
                              key={event.id}
                              className="flex gap-2 py-1 rounded-md group"
                            >
                              <div
                                className="w-0.5 rounded-full shrink-0 mt-0.5 h-auto"
                                style={{ backgroundColor: event.calendarColor || "#3b82f6" }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium truncate leading-tight">
                                  {event.summary}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] text-muted-foreground">
                                    {isAllDay
                                      ? "All day"
                                      : `${format(parseISO(startStr), "HH:mm")} – ${format(parseISO(endStr), "HH:mm")}`}
                                  </span>
                                  {event.location && (
                                    <span className="text-[11px] text-muted-foreground/60 truncate">
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/40 pt-1.5 italic">
                        No events
                      </p>
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
