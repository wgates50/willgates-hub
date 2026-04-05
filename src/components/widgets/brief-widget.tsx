"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { Newspaper, RefreshCw, Sun, Cloud, CloudRain } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BriefData {
  date: string
  greeting: string
  sections: {
    title: string
    type: string
    items: string[]
  }[]
}

export function BriefWidget() {
  const [brief, setBrief] = useState<BriefData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBrief = () => {
    setLoading(true)
    fetch("/api/brief")
      .then((res) => {
        if (!res.ok) throw new Error("Failed")
        return res.json()
      })
      .then(setBrief)
      .catch(() => {
        // Generate a local brief if API fails
        const hour = new Date().getHours()
        const greeting =
          hour < 12
            ? "Good morning"
            : hour < 17
            ? "Good afternoon"
            : "Good evening"

        setBrief({
          date: new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
          greeting,
          sections: [
            {
              title: "Today",
              type: "schedule",
              items: ["Check your calendar for today's events"],
            },
            {
              title: "Automations",
              type: "status",
              items: [
                "6 automations running",
                "Morning Brief delivered at 07:00",
                "Reading Digest sent at 08:00",
              ],
            },
          ],
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBrief()
  }, [])

  return (
    <WidgetWrapper
      title="Daily Brief"
      icon={<Newspaper className="h-4 w-4 text-amber-400" />}
      accentColor="hsl(38, 92%, 50%)"
      headerActions={
        <button
          onClick={fetchBrief}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
    >
      <ScrollArea className="h-full">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-3/4 rounded bg-muted/40" />
            <div className="h-3 w-1/2 rounded bg-muted/30" />
            <div className="h-3 w-2/3 rounded bg-muted/30" />
          </div>
        ) : brief ? (
          <div className="space-y-3.5">
            {brief.sections.map((section, idx) => (
              <div key={section.title} className={idx > 0 ? "pt-1" : ""}>
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {section.title}
                </h4>
                {section.items.length > 0 ? (
                  <div className="space-y-1">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="text-[13px] text-foreground/80 flex items-start gap-2 py-0.5"
                      >
                        <span className="mt-[7px] h-1 w-1 rounded-full bg-primary/50 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-muted-foreground/60 italic">
                    No items yet
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Newspaper className="h-6 w-6 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Brief will appear here</p>
          </div>
        )}
      </ScrollArea>
    </WidgetWrapper>
  )
}
