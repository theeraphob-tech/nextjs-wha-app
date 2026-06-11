import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse, RevenuePoint, Period } from "@/types/admin"

const periodDays: Record<Period, number> = { "7d": 7, "30d": 30, "90d": 90 }

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" } satisfies ApiResponse<never>, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const rawPeriod = searchParams.get("period") ?? "30d"
  const period = (Object.hasOwn(periodDays, rawPeriod) ? rawPeriod : "30d") as Period
  const days = periodDays[period]

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const rows = await prisma.orders.findMany({
    where: { date: { gte: startDate } },
    orderBy: { date: "asc" },
    select: { date: true, total_amount: true },
  })

  const grouped = new Map<string, { revenue: number; orders: number }>()

  for (const row of rows) {
    if (!row.date) continue
    const key = row.date.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit" })
    const entry = grouped.get(key) ?? { revenue: 0, orders: 0 }
    entry.revenue += Number(row.total_amount ?? 0)
    entry.orders += 1
    grouped.set(key, entry)
  }

  const data: RevenuePoint[] = Array.from(grouped, ([date, { revenue, orders }]) => ({
    date,
    revenue,
    orders,
  }))

  return NextResponse.json({ success: true, data } satisfies ApiResponse<RevenuePoint[]>)
}
