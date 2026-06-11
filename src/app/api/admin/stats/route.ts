import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse, AdminStats } from "@/types/admin"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" } satisfies ApiResponse<never>, { status: 401 })
  }

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 86_400_000)

  const [todayOrdersAgg, pendingOrdersCount, totalProducts, totalUsers] = await Promise.all([
    prisma.orders.aggregate({
      _count: { id: true },
      _sum: { total_amount: true },
      where: {
        date: { gte: startOfDay, lt: endOfDay },
      },
    }),
    prisma.orders.count({
      where: { status: "processing" },
    }),
    prisma.products.count(),
    prisma.user.count(),
  ])

  const data: AdminStats = {
    todaySales: Number(todayOrdersAgg._sum.total_amount ?? 0),
    todayOrders: todayOrdersAgg._count.id,
    pendingOrders: pendingOrdersCount,
    totalProducts,
    totalUsers,
  }

  return NextResponse.json({ success: true, data } satisfies ApiResponse<AdminStats>)
}
