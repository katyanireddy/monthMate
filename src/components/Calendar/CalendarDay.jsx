import TaskChip from './TaskChip.jsx'

const MAX_VISIBLE = 3

export default function CalendarDay({ cell, tasksForDay, isToday, isSelected, onSelect }) {
  const visible = tasksForDay.slice(0, MAX_VISIBLE)
  const overflow = tasksForDay.length - visible.length

  return (
    <button
      onClick={() => onSelect(cell.key)}
      className={`group relative flex min-h-[92px] flex-col items-start gap-1 rounded-xl2 border p-2 text-left transition-colors sm:min-h-[104px] sm:p-2.5
        ${cell.inMonth ? 'bg-card' : 'bg-card/40'}
        ${isSelected ? 'border-primary/60 ring-1 ring-primary/30' : 'border-plum/5 hover:border-primary/30'}
      `}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
          ${!cell.inMonth ? 'text-muted/50' : isToday ? 'bg-primary text-white' : 'text-plum/80'}
        `}
      >
        {cell.day}
      </span>

      <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
        {visible.map((t) => (
          <TaskChip key={t.id} task={t} />
        ))}
        {overflow > 0 && (
          <span className="pl-0.5 text-[10.5px] font-medium text-muted">+{overflow} more</span>
        )}
      </div>
    </button>
  )
}
