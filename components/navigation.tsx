"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Timer,
  BarChart3,
  Users,
  Coins,
  BarChart,
  Settings,
} from "lucide-react"

const navigation = [
  {
    name: "Timer",
    href: "/timer",
    icon: Timer,
  },
  {
    name: "Levels",
    href: "/levels",
    icon: BarChart3,
  },
  {
    name: "Players",
    href: "/players",
    icon: Users,
  },
  {
    name: "Chips",
    href: "/chips",
    icon: Coins,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: BarChart,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="mb-6">
      <div className="overflow-x-auto pb-2 block sm:flex justify-center items-center">
        <div className="inline-flex w-auto sm:min-w-0 min-w-full gap-1 p-1 bg-muted rounded-lg">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 min-w-0",
                    isActive && "shadow-sm"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
