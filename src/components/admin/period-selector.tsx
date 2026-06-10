import type { Period } from "@/types/admin"
import { cn } from "@/lib/utils"

const periods: { label: string; value: Period }[] = [
  { label: "7 วัน", value: "7d" },
  { label: "30 วัน", value: "30d" },
  { label: "90 วัน", value: "90d" },
]

type PeriodSelectorProps = {
  value: Period
  onChange: (period: Period) => void
}

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div
      data-slot="period-selector"
      className="inline-flex items-center gap-1 rounded-4xl bg-muted p-1"
    >
      {periods.map((period) => (
        <button
          key={period.value}
          type="button"
          data-active={period.value === value || undefined}
          className={cn(
            "rounded-3xl px-3 py-1.5 text-sm font-medium transition-colors",
            period.value === value
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

export { PeriodSelector }
