import { Suspense } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { DashboardClient } from "./dashboard-client"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">กำลังโหลด...</div>}>
      <DashboardGate />
    </Suspense>
  )
}

async function DashboardGate() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/")
  }

  return <DashboardClient />
}
