"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  RiAddLine,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiPencilLine,
  RiDeleteBinLine,
} from "@remixicon/react"
import type { AdminProduct, CategoryOption } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const limit = 10

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/admin/products?${params}`)
      const body = await res.json()
      if (body.success) {
        setProducts(body.data)
        setTotal(body.total)
        setTotalPages(body.totalPages)
      }
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, search])

  const categoriesLoaded = useRef(false)

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set("search", search)

    Promise.all([
      fetch(`/api/admin/products?${params}`).then((r) => r.json()),
      categoriesLoaded.current
        ? Promise.resolve(null)
        : fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([productsBody, categoriesBody]) => {
      if (productsBody.success) {
        setProducts(productsBody.data)
        setTotal(productsBody.total)
        setTotalPages(productsBody.totalPages)
      } else {
        setProducts([])
      }
      if (categoriesBody?.success) {
        setCategories(categoriesBody.data)
        categoriesLoaded.current = true
      }
      setLoading(false)
    })
  }, [page, search])

  return (
    <div data-slot="products-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-medium">จัดการสินค้า</h1>
        <Button onClick={() => { setEditProduct(null); setFormOpen(true) }}>
          <RiAddLine className="size-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <RiSearchLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาสินค้า..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>สินค้าทั้งหมด ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              {search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้า"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead className="w-24 text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-muted-foreground">{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => { setEditProduct(product); setFormOpen(true) }}
                        >
                          <RiPencilLine className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <RiDeleteBinLine className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <RiArrowLeftSLine className="size-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <RiArrowRightSLine className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSuccess={() => { setFormOpen(false); setEditProduct(null); fetchProducts() }}
      />

      <DeleteConfirmDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={() => { setDeleteTarget(null); fetchProducts() }}
      />
    </div>
  )
}

export { ProductsClient }
