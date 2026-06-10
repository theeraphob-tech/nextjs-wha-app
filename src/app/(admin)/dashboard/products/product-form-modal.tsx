"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { RiLoader2Line } from "@remixicon/react"
import type { AdminProduct, CategoryOption } from "@/types/admin"
import { productSchema, type ProductFormValues } from "@/lib/validations/product"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: AdminProduct | null
  categories: CategoryOption[]
  onSuccess: () => void
}

function ProductFormModal({ open, onOpenChange, product, categories, onSuccess }: ProductFormModalProps) {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", price: 0, categoryId: 0 },
  })

  const isEdit = !!product

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          categoryId: product.categoryId,
        })
      } else {
        reset({ name: "", description: "", price: 0, categoryId: 0 })
      }
    }
  }, [open, product, reset])

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true)
    try {
      const url = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const body = await res.json()
      if (body.success) {
        toast.success(isEdit ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ")
        onSuccess()
      } else {
        toast.error(body.error ?? "เกิดข้อผิดพลาด")
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลสินค้าให้ครบถ้วน
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อสินค้า</Label>
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">ราคา</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              aria-invalid={!!errors.price}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">หมวดหมู่</Label>
            <Select
              value={String(watch("categoryId"))}
              onValueChange={(v) => setValue("categoryId", Number(v), { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <RiLoader2Line className="size-4 animate-spin" />}
              {isEdit ? "บันทึก" : "เพิ่มสินค้า"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ProductFormModal }
