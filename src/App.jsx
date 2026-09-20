import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Calendar from './components/Calendar/Calendar.jsx'
import DailyTaskPanel from './components/DailyTaskPanel.jsx'
import TaskModal from './components/TaskModal.jsx'
import MonthlyStats from './components/MonthlyStats.jsx'
import QuickAdd from './components/QuickAdd.jsx'
import UpcomingTasks from './components/UpcomingTasks.jsx'
import MotivationalBanner from './components/MotivationalBanner.jsx'
import HabitsView from './components/Habits/HabitsView.jsx'
import ProfileModal from './components/ProfileModal.jsx'
import AuthPage from './pages/AuthPage.jsx'
import { getCategory } from './data/categories.js'

import { useTasks } from './context/TaskContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { dateToKey, keyToDate, formatShortDate } from './utils/dateUtils.js'
import { loadTheme, saveTheme } from './utils/storage.js'

const TODAY = new Date()
const TODAY_KEY = dateToKey(TODAY)
// The reference dashboard is anchored on today's date.
const INITIAL_YEAR = TODAY.getFullYear()
const INITIAL_MONTH = TODAY.getMonth()

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, moveDate, toggleImportant } = useTasks()
  const { user } = useAuth()

  const [view, setView] = useState({ year: INITIAL_YEAR, month: INITIAL_MONTH })
  const [selectedKey, setSelectedKey] = useState(TODAY_KEY)
  const [activeNav, setActiveNav] = useState('calendar')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => loadTheme('light'))
  const [modal, setModal] = useState({ open: false, initial: null })
  const [toast, setToast] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const tasksByDate = useMemo(() => {
    const map = new Map()
    for (const t of tasks) {
      if (!map.has(t.date)) map.set(t.date, [])
      map.get(t.date).push(t)
    }
    return map
  }, [tasks])

  const tasksForSelectedDay = useMemo(
    () => (tasksByDate.get(selectedKey) || []).slice().sort((a, b) => Number(a.completed) - Number(b.completed)),
    [tasksByDate, selectedKey],
  )

  const monthTasks = useMemo(
    () =>
      tasks.filter((t) => {
        const d = keyToDate(t.date)
        return d.getFullYear() === view.year && d.getMonth() === view.month
      }),
    [tasks, view],
  )

  const monthStats = useMemo(() => {
    const completed = monthTasks.filter((t) => t.completed).length
    const pending = monthTasks.length - completed
    const activeDays = new Set(monthTasks.map((t) => t.date)).size
    return { completed, pending, activeDays }
  }, [monthTasks])

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && t.date >= TODAY_KEY)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6),
    [tasks],
  )

  const filteredView = useMemo(() => {
    if (activeNav === 'today') {
      return { title: 'Today', items: (tasksByDate.get(TODAY_KEY) || []) }
    }
    if (activeNav === 'upcoming') {
      return { title: 'Upcoming', items: tasks.filter((t) => !t.completed && t.date >= TODAY_KEY).sort((a, b) => a.date.localeCompare(b.date)) }
    }
    if (activeNav === 'important') {
      return { title: 'Important', items: tasks.filter((t) => t.important) }
    }
    if (activeNav === 'completed') {
      return { title: 'Completed', items: tasks.filter((t) => t.completed).sort((a, b) => b.date.localeCompare(a.date)) }
    }
    return null
  }, [activeNav, tasks, tasksByDate])

  function jumpToKey(key) {
    const d = keyToDate(key)
    setView({ year: d.getFullYear(), month: d.getMonth() })
    setSelectedKey(key)
    setActiveNav('calendar')
    setSidebarOpen(false)
  }

  function handlePrevMonth() {
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }))
  }
  function handleNextMonth() {
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }))
  }
  function handleToday() {
    setView({ year: TODAY.getFullYear(), month: TODAY.getMonth() })
    setSelectedKey(TODAY_KEY)
  }

  function openNewTaskModal(dateKey = selectedKey) {
    setModal({ open: true, initial: { date: dateKey } })
  }
  function openEditModal(task) {
    setModal({ open: true, initial: task })
  }
  function openMoveDateModal(task) {
    setModal({ open: true, initial: task })
  }

  function handleSaveTask(form) {
    if (form.id) {
      updateTask(form.id, form)
      setToast('Task updated ♡')
    } else {
      addTask(form)
      setToast('Task added ♡')
    }
    setModal({ open: false, initial: null })
  }

  function handleQuickAddOnDay(title) {
    addTask({ title, date: selectedKey })
    setToast('Task added ♡')
  }

  function handleQuickAddCard({ title, date }) {
    addTask({ title, date })
    setSelectedKey(date)
    setToast('Task added ♡')
  }

  // Auth gate — MUST be after all hooks
  if (!user) return <AuthPage />

  return (
    <div className="flex min-h-screen bg-bg font-body text-plum">
      <Sidebar
        activeView={activeNav}
        onNavigate={(id) => {
          setActiveNav(id)
          setSidebarOpen(false)
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:mx-auto xl:max-w-[1400px]">
        <Header
          tasks={tasks}
          onJumpToTask={(t) => jumpToKey(t.date)}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onOpenMenu={() => setSidebarOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {filteredView ? (
          <FilteredListView
            title={filteredView.title}
            items={filteredView.items}
            onBack={() => setActiveNav('calendar')}
            onToggle={toggleComplete}
            onJump={(t) => jumpToKey(t.date)}
            onImportant={toggleImportant}
          />
        ) : activeNav === 'habits' ? (
          <HabitsView />
        ) : activeNav === 'notes' ? (
          <ComingSoon label="Notes" />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
              <Calendar
                year={view.year}
                month={view.month}
                tasksByDate={tasksByDate}
                selectedKey={selectedKey}
                todayKey={TODAY_KEY}
                onSelectDate={setSelectedKey}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                onAddTask={openNewTaskModal}
              />

              <DailyTaskPanel
                selectedKey={selectedKey}
                tasksForDay={tasksForSelectedDay}
                onQuickAdd={handleQuickAddOnDay}
                onToggle={toggleComplete}
                onEdit={openEditModal}
                onDelete={deleteTask}
                onMoveDate={openMoveDateModal}
                onImportant={toggleImportant}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <MonthlyStats {...monthStats} />
              <QuickAdd defaultDate={selectedKey} onAdd={handleQuickAddCard} />
              <UpcomingTasks
                tasks={upcomingTasks}
                onJump={(t) => jumpToKey(t.date)}
                onViewAll={() => setActiveNav('upcoming')}
              />
            </div>

            <MotivationalBanner name={user?.name?.split(' ')[0] || 'you'} />
          </>
        )}
      </div>

      <TaskModal
        open={modal.open}
        initial={modal.initial}
        onClose={() => setModal({ open: false, initial: null })}
        onSave={handleSaveTask}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[60] flex items-center gap-2 rounded-full bg-plum px-5 py-3 text-sm font-medium text-white shadow-lift"
          >
            <CheckCircle2 size={16} className="text-primary-soft" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilteredListView({ title, items, onBack, onToggle, onJump }) {
  return (
    <div className="rounded-xl3 border border-plum/5 bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-plum">{title}</h2>
        <button onClick={onBack} className="text-sm font-semibold text-primary hover:underline">
          Back to calendar
        </button>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Nothing here yet ♡</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((t) => {
            const cat = getCategory(t.category)
            return (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl2 border border-plum/5 px-3.5 py-3"
              >
                <button
                  onClick={() => onToggle(t.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2
                    ${t.completed ? 'border-primary bg-primary' : 'border-plum/20 hover:border-primary/50'}`}
                  aria-label="Toggle complete"
                >
                  {t.completed && <CheckCircle2 size={13} className="text-white" />}
                </button>
                <button onClick={() => onJump(t)} className="flex flex-1 items-center gap-2 text-left">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.dot }} />
                  <span className={`truncate text-sm ${t.completed ? 'text-muted line-through' : 'text-plum'}`}>
                    {t.title}
                  </span>
                </button>
                <span className="shrink-0 text-xs font-medium text-muted">
                  {formatShortDate(keyToDate(t.date))}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl3 border border-plum/5 bg-card p-16 text-center shadow-card">
      <p className="font-display text-xl text-plum">{label}</p>
      <p className="mt-2 max-w-xs text-sm text-muted">
        This section is on the roadmap — for now, keep slaying your tasks from the calendar ♡
      </p>
    </div>
  )
}
