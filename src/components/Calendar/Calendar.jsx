import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { WEEKDAYS, MONTH_NAMES, buildCalendarGrid, dateToKey } from '../../utils/dateUtils.js'
import CalendarDay from './CalendarDay.jsx'

export default function Calendar({
  year,
  month,
  tasksByDate,
  selectedKey,
  todayKey,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddTask,
}) {
  const rows = buildCalendarGrid(year, month)
  const monthKey = `${year}-${month}`

  return (
    <div className="rounded-xl3 border border-plum/5 bg-card p-4 shadow-card sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="rounded-full p-1.5 text-plum/60 hover:bg-lavender"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="min-w-[170px] text-center font-display text-lg text-plum sm:text-xl">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            onClick={onNextMonth}
            className="rounded-full p-1.5 text-plum/60 hover:bg-lavender"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="rounded-full border border-plum/10 px-3.5 py-1.5 text-sm font-medium text-plum/70 hover:bg-lavender"
          >
            Today
          </button>
          <button
            onClick={() => onAddTask()}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-card hover:bg-primary-dark"
          >
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5 px-0.5 text-center text-[11px] font-semibold tracking-wide text-muted sm:gap-2">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex flex-col gap-1.5 sm:gap-2"
        >
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {row.map((cell) => (
                <CalendarDay
                  key={cell.key}
                  cell={cell}
                  tasksForDay={tasksByDate.get(cell.key) || []}
                  isToday={cell.key === todayKey}
                  isSelected={cell.key === selectedKey}
                  onSelect={onSelectDate}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
