import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // This is a stub — you can integrate with your Cowork scheduled tasks
  // or an external API to pull the daily brief content
  const brief = {
    date: new Date().toISOString().split("T")[0],
    greeting: `Good ${getTimeOfDay()}, Will`,
    sections: [
      {
        title: "Today's Schedule",
        type: "schedule" as const,
        items: [] as string[], // Populated by calendar widget
      },
      {
        title: "Tasks Due",
        type: "tasks" as const,
        items: [] as string[], // Populated by tasks widget
      },
      {
        title: "Headlines",
        type: "headlines" as const,
        items: [
          "Connect your daily brief source to populate this section",
        ],
      },
    ],
  }

  return NextResponse.json(brief)
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}
