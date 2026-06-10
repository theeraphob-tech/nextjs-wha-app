"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  RiDashboardLine,
  RiBox3Line,
  RiHomeLine,
} from "@remixicon/react"
import LogoutButton from "@/components/logout-button"

const navItems = [
  { href: "/", label: "หน้าหลัก", icon: RiHomeLine },
  { href: "/dashboard", label: "แดชบอร์ด", icon: RiDashboardLine },
  { href: "/dashboard/products", label: "สินค้า", icon: RiBox3Line },
]

function AdminNav() {
  const pathname = usePathname()

  return (
    <div data-slot="admin-nav" className="mb-8 flex items-center justify-between">
      <nav className="flex items-center gap-1 rounded-4xl bg-muted p-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-3xl px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <LogoutButton />
    </div>
  )
}

export { AdminNav }
