"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import type { AdminOrderItem } from "@/types/admin"
import { cn } from "@/lib/utils"

type RecentOrdersTableProps = {
  orders: AdminOrderItem[]
  loading: boolean
}

const statusLabel: Record<string, string> = {
  delivered: "สำเร็จ",
  received: "รับแล้ว",
  processing: "กำลังดำเนินการ",
}

function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
  if (loading) {
    return (
      <div data-slot="recent-orders-loading" className="flex h-40 items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div data-slot="recent-orders-empty" className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        ไม่มีคำสั่งซื้อล่าสุด
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>คำสั่งซื้อ</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead>ยอดรวม</TableHead>
          <TableHead>สถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              {new Date(order.date).toLocaleDateString("th-TH")}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(order.total)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === "delivered"
                    ? "default"
                    : order.status === "processing"
                      ? "secondary"
                      : "outline"
                }
                className={cn(
                  order.status === "delivered" && "bg-green-600/10 text-green-600",
                  order.status === "processing" && "bg-amber-600/10 text-amber-600",
                )}
              >
                {statusLabel[order.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { RecentOrdersTable }
