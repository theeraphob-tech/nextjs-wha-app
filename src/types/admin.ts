export type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

export type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}

export type AdminOrderItem = {
  id: number
  date: string
  customer: string
  total: number
  status: "delivered" | "received" | "processing"
}

export type Period = "7d" | "30d" | "90d"
