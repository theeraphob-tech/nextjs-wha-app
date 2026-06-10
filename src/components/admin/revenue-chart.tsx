"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { RevenuePoint } from "@/types/admin"
import { Spinner } from "@/components/ui/spinner"

type RevenueChartProps = {
  data: RevenuePoint[]
  loading: boolean
}

function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div data-slot="revenue-chart-loading" className="flex h-80 items-center justify-center">
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(value)

  return (
    <div data-slot="revenue-chart" className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            className="text-xs text-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            className="text-xs text-muted-foreground"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              new Intl.NumberFormat("th-TH", {
                notation: "compact",
                currency: "THB",
                style: "currency",
              }).format(v)
            }
          />
          <Tooltip
            contentStyle={{
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
            labelClassName="text-sm font-medium text-foreground"
            formatter={(value) => [formatCurrency(Number(value)), "รายได้"]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export { RevenueChart }
