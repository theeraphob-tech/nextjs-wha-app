import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse, CategoryOption } from "@/types/admin"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" } satisfies ApiResponse<never>, { status: 401 })
  }

  const categories = await prisma.categories.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  const data: CategoryOption[] = categories.map((c) => ({
    id: c.id,
    name: c.name ?? "",
  }))

  return NextResponse.json({ success: true, data } satisfies ApiResponse<CategoryOption[]>)
}
