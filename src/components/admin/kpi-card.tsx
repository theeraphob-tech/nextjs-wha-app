import type { ReactNode } from "react"

type KpiCardProps = {
  label: string
  value: string
  icon: ReactNode
  loading?: boolean
}

function KpiCardSkeleton() {
  return (
    <div data-slot="kpi-card-skeleton" className="flex flex-col gap-3 rounded-4xl bg-card p-6 shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      <div className="size-10 animate-pulse rounded-3xl bg-muted" />
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-3xl bg-muted" />
        <div className="h-7 w-28 animate-pulse rounded-3xl bg-muted" />
      </div>
    </div>
  )
}

function KpiCard({ label, value, icon, loading }: KpiCardProps) {
  if (loading) return <KpiCardSkeleton />

  return (
    <div data-slot="kpi-card" className="flex flex-col gap-3 rounded-4xl bg-card p-6 shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      <div className="flex size-10 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export { KpiCard, KpiCardSkeleton }
