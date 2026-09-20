import { useState } from 'react'
import { Plus, Flame } from 'lucide-react'
import HabitCard from './HabitCard.jsx'
import HabitModal from './HabitModal.jsx'
import { useHabits } from '../../context/HabitContext.jsx'
import { computeStreak } from '../../utils/habitUtils.js'
import { dateToKey } from '../../utils/dateUtils.js'

export default function HabitsView() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleDate } = useHabits()
  const [modal, setModal] = useState({ open: false, initial: null })

  const todayKey = dateToKey(new Date())
  const doneToday = habits.filter((h) => h.completedDates.includes(todayKey)).length
  const bestStreak = habits.reduce((max, h) => Math.max(max, computeStreak(h)), 0)

  function handleSave(form) {
    if (form.id) updateHabit(form.id, form)
    else addHabit(form)
    setModal({ open: false, initial: null })
  }

  return (
    <div className="rounded-xl3 border border-plum/5 bg-card p-5 shadow-card sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-plum">Habits</h2>
          <p className="mt-1 text-sm text-muted">
            {habits.length === 0
              ? 'Start your first streak ♡'
              : `${doneToday}/${habits.length} done today · best streak ${bestStreak} ${bestStreak === 1 ? 'day' : 'days'}`}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, initial: null })}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-primary-dark"
        >
          <Plus size={15} /> New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <Flame size={28} className="text-primary/40" />
          <p className="text-sm text-muted">No habits yet — add one to start building your streak ♡</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggleDate={toggleDate}
              onEdit={(habit) => setModal({ open: true, initial: habit })}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      <HabitModal
        open={modal.open}
        initial={modal.initial}
        onClose={() => setModal({ open: false, initial: null })}
        onSave={handleSave}
      />
    </div>
  )
}
