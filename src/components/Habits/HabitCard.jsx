import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Pencil, Trash2, Flame, Check } from 'lucide-react'
import { dateToKey } from '../../utils/dateUtils.js'
import { computeStreak, isScheduledOnDate, last7Days } from '../../utils/habitUtils.js'

export default function HabitCard({ habit, onToggleDate, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const today = new Date()
  const todayKey = dateToKey(today)
  const doneToday = habit.completedDates.includes(todayKey)
  const streak = computeStreak(habit, today)
  const week = last7Days(today)

  return (
    <div className="rounded-xl2 border border-plum/5 bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleDate(habit.id, todayKey)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
            style={{ borderColor: habit.color, background: doneToday ? habit.color : 'transparent' }}
            aria-label={doneToday ? 'Mark not done today' : 'Mark done today'}
          >
            {doneToday && <Check size={16} className="text-white" strokeWidth={3} />}
          </button>
          <div>
            <p className="text-sm font-semibold leading-tight text-plum">{habit.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <Flame size={12} className={streak > 0 ? 'text-primary' : 'text-muted/60'} />
              {streak > 0 ? `${streak} day${streak === 1 ? '' : 's'} streak` : 'Start today ♡'}
            </p>
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-1 text-muted hover:bg-lavender hover:text-plum"
            aria-label="Habit options"
          >
            <MoreVertical size={16} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-xl2 bg-card py-1 shadow-lift"
              >
                <button
                  onClick={() => { onEdit(habit); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-plum hover:bg-lavender"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(habit.id); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-primary hover:bg-primary-soft"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-1.5">
        {week.map((d) => {
          const key = dateToKey(d)
          const scheduled = isScheduledOnDate(habit, d)
          const done = habit.completedDates.includes(key)
          const isToday = key === todayKey
          return (
            <button
              key={key}
              disabled={!scheduled}
              onClick={() => scheduled && onToggleDate(habit.id, key)}
              title={d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10.5px] font-medium transition-colors
                ${!scheduled ? 'cursor-default opacity-25' : 'hover:ring-2 hover:ring-primary/25'}
                ${isToday ? 'ring-1 ring-plum/25' : ''}
                ${!done ? 'bg-lavender text-muted' : ''}
              `}
              style={done ? { background: habit.color, color: '#fff' } : {}}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
