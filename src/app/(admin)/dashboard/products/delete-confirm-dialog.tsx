"use client"

import { useState } from "react"
import { toast } from "sonner"
import { RiLoader2Line } from "@remixicon/react"
import type { AdminProduct } from "@/types/admin"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type DeleteConfirmDialogProps = {
  target: AdminProduct | null
  onClose: () => void
  onSuccess: () => void
}

function DeleteConfirmDialog({ target, onClose, onSuccess }: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!target) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${target.id}`, { method: "DELETE" })
      const body = await res.json()
      if (body.success) {
        toast.success("ลบสินค้าสำเร็จ")
        onSuccess()
      } else {
        toast.error(body.error ?? "เกิดข้อผิดพลาด")
        onClose()
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ")
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={!!target} onOpenChange={(open) => { if (!open && !deleting) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบ <strong>{target?.name}</strong>? การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={deleting}>ยกเลิก</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting && <RiLoader2Line className="size-4 animate-spin" />}
              ลบสินค้า
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteConfirmDialog }
