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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await checkAdmin()
  if (guard) return guard

  const { id } = await params
  const productId = Number(id)
  if (!productId) {
    return NextResponse.json({ success: false, error: "ID ไม่ถูกต้อง" } satisfies ApiResponse<never>, { status: 400 })
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" } satisfies ApiResponse<never>, { status: 404 })
  }

  const body = await request.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" } satisfies ApiResponse<never>, { status: 400 })
  }

  const product = await prisma.products.update({
    where: { id: productId },
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

  return NextResponse.json({ success: true, data } satisfies ApiResponse<AdminProduct>)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await checkAdmin()
  if (guard) return guard

  const { id } = await params
  const productId = Number(id)
  if (!productId) {
    return NextResponse.json({ success: false, error: "ID ไม่ถูกต้อง" } satisfies ApiResponse<never>, { status: 400 })
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" } satisfies ApiResponse<never>, { status: 404 })
  }

  const orderCount = await prisma.order_items.count({ where: { product_id: productId } })
  if (orderCount > 0) {
    return NextResponse.json({ success: false, error: `ไม่สามารถลบได้ สินค้านี้มีคำสั่งซื้อ ${orderCount} รายการ` } satisfies ApiResponse<never>, { status: 409 })
  }

  await prisma.products.delete({ where: { id: productId } })

  return NextResponse.json({ success: true, data: null } satisfies ApiResponse<null>)
}
