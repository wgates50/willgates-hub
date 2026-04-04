"use client"

import { useEffect, useState } from "react"
import { WidgetWrapper } from "./widget-wrapper"
import { Newspaper, RefreshCw } from "lucide-react"
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
      .then((res) => res.json())
      .then(setBrief)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBrief()
  }, [])

  return (
    <WidgetWrapper
      title="Daily Brief"
      icon={<Newspaper className="h-4 w-4 text-amber-500" />}
      headerActions={
        <button
          onClick={fetchBrief}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
    >
      <ScrollArea className="h-full">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
          </div>
        ) : brief ? (
          <div className="space-y-4">
            <p className="text-lg font-semibold">{brief.greeting}</p>
            {brief.sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </h4>
                {section.items.length > 0 ? (
                  <ul className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No items yet — connect your data source
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>Brief will appear here</p>
            <p className="text-xs mt-1">Connect to your Cowork morning brief</p>
          </div>
        )}
      </ScrollArea>
    </WidgetWrapper>
  )
}
