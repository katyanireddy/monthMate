import { CalendarDays } from 'lucide-react'
import { keyToDate, formatShortDate } from '../utils/dateUtils.js'

export default function UpcomingTasks({ tasks, onJump, onViewAll }) {
  return (
    <div className="rounded-xl3 border border-plum/5 bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-plum">
          <CalendarDays size={16} className="text-primary" />
          Upcoming
        </div>
        <button onClick={onViewAll} className="text-xs font-semibold text-primary hover:underline">
          View all
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Nothing upcoming — enjoy the calm ♡</p>
      ) : (
        <ul className="space-y-2.5">
          {tasks.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onJump(t)}
                className="flex w-full items-center gap-3 rounded-xl2 px-2 py-1.5 text-left hover:bg-lavender"
              >
                <span className="w-14 shrink-0 text-xs font-semibold text-muted">
                  {formatShortDate(keyToDate(t.date))}
                </span>
                <span className="truncate text-sm text-plum">{t.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
