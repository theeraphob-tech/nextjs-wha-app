import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse, AdminOrderItem } from "@/types/admin"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" } satisfies ApiResponse<never>, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 5, 1), 100)

  const rows = await prisma.orders.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: {
      customers: { select: { name: true } },
    },
  })

  const orders: AdminOrderItem[] = rows.map((row) => ({
    id: row.id,
    date: row.date?.toISOString() ?? "",
    customer: row.customers?.name ?? "(ไม่มีชื่อ)",
    total: Number(row.total_amount ?? 0),
    status: row.status ?? "processing",
  }))

  return NextResponse.json({ success: true, data: orders } satisfies ApiResponse<AdminOrderItem[]>)
}
