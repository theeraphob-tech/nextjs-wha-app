import { Suspense } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
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
  if (!session) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "admin") {
    redirect("/")
  }

  return <DashboardClient />
}
