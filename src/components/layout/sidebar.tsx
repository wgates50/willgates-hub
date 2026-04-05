"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Grid3X3,
  Settings,
  LogOut,
  Globe,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { useSidebar } from "./dashboard-shell"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apps", label: "Apps", icon: Grid3X3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/40 bg-card/90 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="flex h-12 items-center justify-between border-b border-border/30 px-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-[11px] font-bold shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40">
            W
          </div>
          {!collapsed && (
            <span className="font-semibold text-[13px] tracking-tight text-foreground/80">
              willgates.dev
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md text-muted-foreground/40 hover:text-foreground/70 hover:bg-accent/40 transition-colors"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-1.5 pt-2">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center rounded-lg p-2 mb-1 text-muted-foreground/40 hover:text-foreground/70 hover:bg-accent/40 transition-colors"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/60 hover:bg-accent/40 hover:text-foreground/80"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        <div className={cn("pt-2 mt-2 border-t border-border/20", collapsed && "mx-1")}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "Public site" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground/40 hover:bg-accent/30 hover:text-muted-foreground/70 transition-all",
              collapsed && "justify-center px-0"
            )}
          >
            <Globe className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Public site</span>}
          </a>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-border/30 p-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/40 transition-colors",
                collapsed && "justify-center px-0"
              )}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                  {session?.user?.name?.charAt(0) || "W"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <span className="text-[12px] font-medium truncate text-foreground/70">
                  {session?.user?.name || "Will"}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[11px] font-normal text-muted-foreground">
              {session?.user?.email || ""}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="text-[13px]">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-[13px]">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
