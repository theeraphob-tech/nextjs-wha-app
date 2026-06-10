"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import {
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiTimeLine,
  RiBox3Line,
  RiGroupLine,
  RiRefreshLine,
} from "@remixicon/react"
import type { AdminStats, RevenuePoint, AdminOrderItem, Period } from "@/types/admin"
import { KpiCard } from "@/components/admin/kpi-card"
import { PeriodSelector } from "@/components/admin/period-selector"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RevenueChart = dynamic(
  () => import("@/components/admin/revenue-chart").then((m) => ({ default: m.RevenueChart })),
  { ssr: false },
)

const kpiConfig: {
  label: string
  key: keyof AdminStats
  icon: React.ReactNode
  format?: (value: number) => string
}[] = [
  {
    label: "ยอดขายวันนี้",
    key: "todaySales",
    icon: <RiMoneyDollarCircleLine className="size-5" />,
    format: (v) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(v),
  },
  {
    label: "คำสั่งซื้อวันนี้",
    key: "todayOrders",
    icon: <RiShoppingCartLine className="size-5" />,
  },
  {
    label: "รอดำเนินการ",
    key: "pendingOrders",
    icon: <RiTimeLine className="size-5" />,
  },
  {
    label: "สินค้าทั้งหมด",
    key: "totalProducts",
    icon: <RiBox3Line className="size-5" />,
    format: (v) => v.toLocaleString("th-TH"),
  },
  {
    label: "ผู้ใช้ทั้งหมด",
    key: "totalUsers",
    icon: <RiGroupLine className="size-5" />,
    format: (v) => v.toLocaleString("th-TH"),
  },
]

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div data-slot="error-block" className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RiRefreshLine className="size-4" />
        ลองใหม่
      </Button>
    </div>
  )
}

function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)

  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const doFetchStats = useCallback(async (showLoading: boolean) => {
    if (showLoading) setStatsLoading(true)
    setStatsError(null)
    try {
      const res = await fetch("/api/admin/stats")
      if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลสถิติได้")
      const body = await res.json()
      setStats(body.data ?? body)
    } catch (e) {
      setStatsError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const doFetchOrders = useCallback(async (showLoading: boolean) => {
    if (showLoading) setOrdersLoading(true)
    try {
      const res = await fetch("/api/admin/orders?limit=5")
      if (!res.ok) throw new Error("ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้")
      const body = await res.json()
      setOrders(body.orders ?? body.data ?? [])
    } catch {
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders?limit=5"),
        ])
        if (cancelled) return
        if (statsRes.ok) {
          const body = await statsRes.json()
          setStats(body.data ?? body)
        } else {
          setStatsError("ไม่สามารถโหลดข้อมูลสถิติได้")
        }
        if (ordersRes.ok) {
          const body = await ordersRes.json()
          setOrders(body.orders ?? body.data ?? [])
        } else {
          setOrders([])
        }
      } catch {
        if (!cancelled) setStatsError("ไม่สามารถโหลดข้อมูลสถิติได้")
      } finally {
        if (!cancelled) {
          setStatsLoading(false)
          setOrdersLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const res = await fetch(`/api/admin/revenue?period=${period}`)
      if (cancelled) return
      if (res.ok) {
        const body = await res.json()
        setRevenue(Array.isArray(body) ? body : body.data ?? [])
      }
      setRevenueLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [period])

  useEffect(() => {
    const interval = setInterval(() => {
      doFetchStats(true)
      doFetchOrders(true)
    }, 30_000)
    return () => clearInterval(interval)
  }, [doFetchStats, doFetchOrders])

  return (
    <div data-slot="dashboard" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-medium">แดชบอร์ด</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {statsError ? (
        <ErrorBlock message={statsError} onRetry={() => doFetchStats(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiConfig.map((kpi) => (
            <KpiCard
              key={kpi.key}
              label={kpi.label}
              value={
                stats
                  ? kpi.format
                    ? kpi.format(stats[kpi.key])
                    : stats[kpi.key].toLocaleString("th-TH")
                  : ""
              }
              icon={kpi.icon}
              loading={statsLoading}
            />
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>รายได้</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenue} loading={revenueLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={orders} loading={ordersLoading} />
        </CardContent>
      </Card>
    </div>
  )
}

export { DashboardClient }
