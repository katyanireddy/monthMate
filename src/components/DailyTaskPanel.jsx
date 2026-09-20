import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MoreVertical, Pencil, CalendarRange, CheckCheck, Trash2, PartyPopper, Star } from 'lucide-react'
import { formatLongDate, keyToDate } from '../utils/dateUtils.js'

const QUOTES = [
  'Good things happen when you stay consistent. ♡',
  'One task at a time, one step closer. ♡',
  "You're building the life you imagined. ♡",
  'Small wins today, big wins this month. ♡',
]

function TaskRow({ task, onToggle, onEdit, onDelete, onMoveDate, onImportant }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="flex items-center gap-3 rounded-xl2 border border-plum/5 bg-card px-3.5 py-3 shadow-card"
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors
          ${task.completed ? 'border-primary bg-primary' : 'border-plum/20 hover:border-primary/50'}`}
      >
        {task.completed && <CheckCheck size={12} className="text-white" strokeWidth={3} />}
      </button>

      <span className={`flex-1 truncate text-sm ${task.completed ? 'text-muted line-through' : 'text-plum'}`}>
        {task.title}
      </span>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-full p-1 text-muted hover:bg-lavender hover:text-plum"
          aria-label="Task options"
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
              className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl2 bg-card py-1 shadow-lift"
            >
              <button
                onClick={() => { onEdit(task); setMenuOpen(false) }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-plum hover:bg-lavender"
              >
                <Pencil size={14} /> Edit task
              </button>
              <button
                onClick={() => { onMoveDate(task); setMenuOpen(false) }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-plum hover:bg-lavender"
              >
                <CalendarRange size={14} /> Change date
              </button>
              <button
                onClick={() => { onToggle(task.id); setMenuOpen(false) }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-plum hover:bg-lavender"
              >
                <CheckCheck size={14} /> {task.completed ? 'Mark pending' : 'Mark completed'}
              </button>
              <button
                onClick={() => { onImportant(task.id); setMenuOpen(false) }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-plum hover:bg-lavender"
              >
                <Star size={14} className={task.important ? 'fill-primary text-primary' : ''} /> {task.important ? 'Remove important' : 'Mark important'}
              </button>
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false) }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-primary hover:bg-primary-soft"
              >
                <Trash2 size={14} /> Delete task
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function DailyTaskPanel({
  selectedKey,
  tasksForDay,
  onQuickAdd,
  onToggle,
  onEdit,
  onDelete,
  onMoveDate,
  onImportant,
}) {
  const [draft, setDraft] = useState('')
  const date = keyToDate(selectedKey)
  const quote = QUOTES[date.getDate() % QUOTES.length]

  const total = tasksForDay.length
  const completed = tasksForDay.filter((t) => t.completed).length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  function submit() {
    if (!draft.trim()) return
    onQuickAdd(draft.trim())
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col rounded-xl3 border border-plum/5 bg-card p-5 shadow-card">
      <h3 className="font-display text-lg text-plum">{formatLongDate(date)}</h3>
      <p className="mt-1.5 text-sm leading-snug text-muted">{quote}</p>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-plum/10 bg-bg px-3.5 py-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="+ Add a new task..."
          className="flex-1 bg-transparent text-sm text-plum placeholder:text-muted focus:outline-none"
        />
        <button
          onClick={submit}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark"
          aria-label="Add task"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        <AnimatePresence initial={false}>
          {tasksForDay.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted">
              <PartyPopper size={26} className="text-primary/50" />
              <p className="text-sm">Nothing planned yet — add your first task ♡</p>
            </div>
          ) : (
            tasksForDay.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onMoveDate={onMoveDate}
                onImportant={onImportant}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 rounded-xl2 bg-lavender p-4">
        <p className="text-sm font-semibold text-plum">
          {total === 0 ? 'Ready when you are!' : pct === 100 ? "You're all done! 🎉" : "You're doing great!"}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {completed}/{total} tasks completed
        </p>
        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-card">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-semibold text-primary">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
