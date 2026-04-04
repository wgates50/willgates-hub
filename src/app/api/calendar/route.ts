import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const now = new Date()
    const timeMin = now.toISOString()
    const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch calendar list first
    const calendarListRes = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    )

    if (!calendarListRes.ok) {
      throw new Error("Failed to fetch calendar list")
    }

    const calendarList = await calendarListRes.json()
    const calendars = calendarList.items || []

    // Fetch events from all calendars
    const allEvents = await Promise.all(
      calendars
        .filter((cal: any) => cal.selected !== false)
        .slice(0, 5) // Limit to 5 calendars
        .map(async (cal: any) => {
          const eventsRes = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=20`,
            {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          )

          if (!eventsRes.ok) return []

          const eventsData = await eventsRes.json()
          return (eventsData.items || []).map((event: any) => ({
            ...event,
            calendarId: cal.id,
            calendarName: cal.summary,
            calendarColor: cal.backgroundColor,
          }))
        })
    )

    const events = allEvents
      .flat()
      .sort((a: any, b: any) => {
        const aStart = a.start?.dateTime || a.start?.date || ""
        const bStart = b.start?.dateTime || b.start?.date || ""
        return aStart.localeCompare(bStart)
      })

    return NextResponse.json({
      calendars: calendars.map((c: any) => ({
        id: c.id,
        name: c.summary,
        color: c.backgroundColor,
      })),
      events,
    })
  } catch (error) {
    console.error("Calendar API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    )
  }
}
