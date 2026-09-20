import { BarChart3 } from 'lucide-react'

export default function MonthlyStats({ completed, activeDays, pending }) {
  const stats = [
    { label: 'Tasks completed', value: completed },
    { label: 'Days active', value: activeDays },
    { label: 'Tasks pending', value: pending },
  ]

  return (
    <div className="rounded-xl3 border border-plum/5 bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-plum">
        <BarChart3 size={16} className="text-primary" />
        This Month
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-2xl text-plum">{s.value}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
