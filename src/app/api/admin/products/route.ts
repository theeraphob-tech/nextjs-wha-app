import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { ApiResponse, AdminProduct } from "@/types/admin"

async function checkAdmin(): Promise<Response | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" } satisfies ApiResponse<never>, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" } satisfies ApiResponse<never>, { status: 403 })
  }
  return null
}

export async function GET(request: Request) {
  const guard = await checkAdmin()
  if (guard) return guard

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = 10
  const skip = (page - 1) * limit

  const where = search
    ? { name: { contains: search } }
    : {}

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      include: { categories: { select: { id: true, name: true } } },
      orderBy: { id: "desc" },
    }),
    prisma.products.count({ where }),
  ])

  const data: AdminProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name ?? "",
    description: p.description,
    price: Number(p.price),
    categoryId: p.category_id ?? 0,
    categoryName: p.categories?.name ?? "",
  }))

  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  } satisfies ApiResponse<AdminProduct[]> & { total: number; page: number; totalPages: number })
}

export async function POST(request: Request) {
  const guard = await checkAdmin()
  if (guard) return guard

  const body = await request.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" } satisfies ApiResponse<never>, { status: 400 })
  }

  const product = await prisma.products.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      category_id: parsed.data.categoryId,
    },
    include: { categories: { select: { id: true, name: true } } },
  })

  const data: AdminProduct = {
    id: product.id,
    name: product.name ?? "",
    description: product.description,
    price: Number(product.price),
    categoryId: product.category_id ?? 0,
    categoryName: product.categories?.name ?? "",
  }

  return NextResponse.json({ success: true, data } satisfies ApiResponse<AdminProduct>, { status: 201 })
}
