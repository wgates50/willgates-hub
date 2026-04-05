export interface AppProject {
  name: string
  slug: string
  description: string
  longDescription: string
  externalUrl: string
  github?: string
  color: string
  gradientFrom: string
  gradientTo: string
  iconBg: string
  emoji: string
  status: "live" | "building" | "planned"
  tech: string[]
}

export const PROJECTS: AppProject[] = [
  {
    name: "What's On London",
    slug: "whats-on-london",
    description: "Event calendar for London happenings",
    longDescription:
      "Aggregates events across London venues, festivals, and pop-ups. Powered by weekly automated scans.",
    externalUrl: "https://whats-on-london-wgates50s-projects.vercel.app",
    color: "from-rose-500/20 to-rose-600/5",
    gradientFrom: "rose-500",
    gradientTo: "pink-500",
    iconBg: "bg-rose-500/15",
    emoji: "🎭",
    status: "live",
    tech: ["Next.js", "Vercel", "Cowork Automation"],
  },
  {
    name: "Album Club",
    slug: "album-club",
    description: "Collaborative album listening & rating",
    longDescription:
      "A social app for listening clubs — pick albums, rate tracks, discuss with friends. Built with Supabase auth and real-time features.",
    externalUrl: "https://album-club-gamma.vercel.app",
    color: "from-violet-500/20 to-violet-600/5",
    gradientFrom: "violet-500",
    gradientTo: "purple-500",
    iconBg: "bg-violet-500/15",
    emoji: "💿",
    status: "live",
    tech: ["Next.js", "Supabase", "Tailwind"],
  },
  {
    name: "MusicBox",
    slug: "musicbox",
    description: "Spotify new release tracker",
    longDescription:
      "Tracks new releases from your favourite Spotify artists. Never miss an album drop or single release.",
    externalUrl: "https://musicbox-mu.vercel.app",
    color: "from-emerald-500/20 to-emerald-600/5",
    gradientFrom: "emerald-500",
    gradientTo: "green-500",
    iconBg: "bg-emerald-500/15",
    emoji: "🎵",
    status: "live",
    tech: ["Next.js", "Spotify API", "Vercel"],
  },
  {
    name: "TaskFlow",
    slug: "taskflow",
    description: "Personal project management tool",
    longDescription:
      "A lightweight project management tool built exactly how you want it. Kanban boards, custom sections, and clean design.",
    externalUrl: "https://taskflow-lilac-eta.vercel.app",
    color: "from-blue-500/20 to-blue-600/5",
    gradientFrom: "blue-500",
    gradientTo: "indigo-500",
    iconBg: "bg-blue-500/15",
    emoji: "✅",
    status: "building",
    tech: ["Next.js", "Vercel", "React DnD"],
  },
  {
    name: "Click Tracker",
    slug: "click-tracker",
    description: "Link click analytics",
    longDescription:
      "Simple analytics for tracking link clicks across your projects. Lightweight alternative to full analytics suites.",
    externalUrl: "https://click-tracker-silk.vercel.app",
    color: "from-amber-500/20 to-amber-600/5",
    gradientFrom: "amber-500",
    gradientTo: "orange-500",
    iconBg: "bg-amber-500/15",
    emoji: "📊",
    status: "live",
    tech: ["Next.js", "Vercel"],
  },
  {
    name: "Upcoming",
    slug: "upcoming",
    description: "Release & event countdown tracker",
    longDescription:
      "Track upcoming releases, events, and deadlines with countdown timers and notifications.",
    externalUrl: "https://pdevs-upcoming.vercel.app",
    color: "from-cyan-500/20 to-cyan-600/5",
    gradientFrom: "cyan-500",
    gradientTo: "teal-500",
    iconBg: "bg-cyan-500/15",
    emoji: "📅",
    status: "live",
    tech: ["Next.js", "Vercel"],
  },
]

export interface Automation {
  id: string
  name: string
  description: string
  schedule: string
  scheduleDetail: string
  status: "active" | "paused" | "error"
  emoji: string
  lastRan?: string
  nextRun?: string
  outputs?: string
}

export const AUTOMATIONS: Automation[] = [
  {
    id: "morning-brief",
    name: "Morning Brief",
    description: "Compiles your schedule, tasks, weather, and news into a daily briefing delivered each morning.",
    schedule: "Daily",
    scheduleDetail: "Every day at 7:00am GMT",
    status: "active",
    emoji: "☀️",
    lastRan: "Today, 07:00",
    nextRun: "Tomorrow, 07:00",
    outputs: "Brief widget on dashboard",
  },
  {
    id: "reading-digest",
    name: "Smart Reading Digest",
    description: "Scans your Substack subscriptions, saved articles, and newsletters. Summarises and ranks by relevance.",
    schedule: "Daily",
    scheduleDetail: "Every day at 08:00am GMT",
    status: "active",
    emoji: "📚",
    lastRan: "Today, 08:00",
    nextRun: "Tomorrow, 08:00",
    outputs: "Reading digest email",
  },
  {
    id: "email-to-cal",
    name: "Email to Calendar",
    description: "Monitors Gmail for event-like emails (flight bookings, restaurant reservations, tickets) and creates calendar events automatically.",
    schedule: "Daily",
    scheduleDetail: "Every day at 09:00am GMT",
    status: "active",
    emoji: "📧",
    lastRan: "Today, 09:00",
    nextRun: "Tomorrow, 09:00",
    outputs: "Google Calendar events",
  },
  {
    id: "job-alerts",
    name: "Job Alert Scanner",
    description: "Searches job boards for roles matching your criteria. Filters by location, seniority, and tech stack. Delivers a curated shortlist.",
    schedule: "Daily",
    scheduleDetail: "Every day at 10:00am GMT",
    status: "active",
    emoji: "💼",
    lastRan: "Today, 10:00",
    nextRun: "Tomorrow, 10:00",
    outputs: "Email digest",
  },
  {
    id: "london-events",
    name: "London Event Scanner",
    description: "Scans Time Out, Eventbrite, DICE, and venue sites for interesting events in London. Feeds into What's On London app.",
    schedule: "Weekly",
    scheduleDetail: "Every Monday at 06:00am GMT",
    status: "active",
    emoji: "🗺️",
    lastRan: "Monday, 06:00",
    nextRun: "Next Monday, 06:00",
    outputs: "What's On London database",
  },
  {
    id: "life-admin",
    name: "Monthly Life Admin",
    description: "Reviews subscriptions, upcoming renewals, bills, and financial summaries. Generates a checklist of admin tasks for the month.",
    schedule: "Monthly",
    scheduleDetail: "1st of each month at 08:00am GMT",
    status: "active",
    emoji: "🗂️",
    lastRan: "1 Apr, 08:00",
    nextRun: "1 May, 08:00",
    outputs: "Email report + tasks",
  },
]

/** Get the internal path-based URL for an app */
export function getAppUrl(slug: string): string {
  return `/apps/${slug}`
}
