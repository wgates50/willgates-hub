import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? "Good morning, Will"
      : hour < 17
      ? "Good afternoon, Will"
      : "Good evening, Will"

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const sections: { title: string; type: string; items: string[] }[] = []

  // Try to pull today's calendar events
  if (session?.accessToken) {
    try {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()

      const calRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      )

      if (calRes.ok) {
        const calData = await calRes.json()
        const events = calData.items || []
        if (events.length > 0) {
          sections.push({
            title: "Today's Schedule",
            type: "schedule",
            items: events.slice(0, 5).map((e: any) => {
              const time = e.start?.dateTime
                ? new Date(e.start.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                : "All day"
              return `${time} — ${e.summary}`
            }),
          })
        } else {
          sections.push({
            title: "Today's Schedule",
            type: "schedule",
            items: ["No events scheduled today"],
          })
        }
      }
    } catch {
      // Calendar fetch failed, skip
    }
  }

  // Automations status
  sections.push({
    title: "Automations",
    type: "status",
    items: [
      "6 automations running — all healthy",
      "Morning Brief delivered at 07:00",
      "Reading Digest sent at 08:00",
    ],
  })

  // Quick reminders
  sections.push({
    title: "Quick Links",
    type: "links",
    items: [
      "Check Claude usage on the Anthropic dashboard",
      "Review Vercel deployment stats",
    ],
  })

  return NextResponse.json({
    date: today,
    greeting,
    sections,
  })
}
