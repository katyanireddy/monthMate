import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pencil, Check, Trophy, Flame, Star, Zap, Target, Moon, Sparkles, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { loadTasks } from '../utils/storage.js'
import { loadLoginDays } from '../utils/storage.js'

const AVATAR_COLORS = [
  '#ED4F86', '#7C6FE0', '#3FA9A0', '#5FA8E8', '#E8A23F', '#C77DD9',
]

function computeBadges(user) {
  const tasks = loadTasks([])
  const loginDays = loadLoginDays()

  const completed = tasks.filter((t) => t.completed)
  const important = tasks.filter((t) => t.important)

  // Check if all tasks on any day are completed
  const byDate = {}
  for (const t of tasks) {
    if (!byDate[t.date]) byDate[t.date] = { total: 0, done: 0 }
    byDate[t.date].total++
    if (t.completed) byDate[t.date].done++
  }
  const goalCrusher = Object.values(byDate).some((d) => d.total > 0 && d.done === d.total)

  // Habit streak: check localStorage for habits
  let maxStreak = 0
  try {
    const rawHabits = window.localStorage.getItem('monthmate.habits.v1')
    const habits = rawHabits ? JSON.parse(rawHabits) : []
    for (const h of habits) {
      if (h.completedDates && h.completedDates.length >= 3) {
        // Check for 3 consecutive days
        const sorted = [...h.completedDates].sort()
        let streak = 1
        for (let i = 1; i < sorted.length; i++) {
          const prev = new Date(sorted[i - 1])
          const curr = new Date(sorted[i])
          const diff = (curr - prev) / (1000 * 60 * 60 * 24)
          if (diff === 1) { streak++; if (streak > maxStreak) maxStreak = streak }
          else streak = 1
        }
      }
    }
  } catch {}

  const allBadges = [
    {
      id: 'first_task',
      label: 'First Task',
      desc: 'Added your very first task',
      icon: Sparkles,
      color: '#ED4F86',
      earned: tasks.length >= 1,
    },
    {
      id: 'on_a_roll',
      label: 'On a Roll',
      desc: 'Completed 5 tasks',
      icon: CheckCheck,
      color: '#3FA9A0',
      earned: completed.length >= 5,
    },
    {
      id: 'streak_starter',
      label: 'Streak Starter',
      desc: '3-day habit streak',
      icon: Flame,
      color: '#E8A23F',
      earned: maxStreak >= 3,
    },
    {
      id: 'power_planner',
      label: 'Power Planner',
      desc: '10+ tasks added',
      icon: Trophy,
      color: '#7C6FE0',
      earned: tasks.length >= 10,
    },
    {
      id: 'star_collector',
      label: 'Star Collector',
      desc: 'Marked 3 tasks as important',
      icon: Star,
      color: '#E8A23F',
      earned: important.length >= 3,
    },
    {
      id: 'consistent',
      label: 'Consistent',
      desc: 'Logged in 5 different days',
      icon: Target,
      color: '#5FA8E8',
      earned: loginDays.length >= 5,
    },
    {
      id: 'goal_crusher',
      label: 'Goal Crusher',
      desc: 'Completed all tasks in a day',
      icon: Zap,
      color: '#C77DD9',
      earned: goalCrusher,
    },
    {
      id: 'night_owl',
      label: 'Night Owl',
      desc: 'Always vibing ♡',
      icon: Moon,
      color: '#7C6FE0',
      earned: true, // always unlocked — fun badge
    },
  ]

  return allBadges
}

export default function ProfileModal({ open, onClose }) {
  const { user, updateUser, logout } = useAuth()
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState(user?.name || '')

  const badges = useMemo(() => computeBadges(user), [user, open])
  const earned = badges.filter((b) => b.earned)

  function saveName() {
    if (nameVal.trim()) updateUser({ name: nameVal.trim() })
    setEditingName(false)
  }

  function handleLogout() {
    onClose()
    logout()
  }

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joinDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum/30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-md rounded-xl3 bg-card shadow-lift overflow-hidden"
          >
            {/* Header gradient strip */}
            <div className="relative bg-gradient-to-r from-primary-soft via-lavender to-primary-soft px-6 pt-6 pb-10">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-plum/60 hover:bg-card/50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <h3 className="font-display text-lg text-plum">My Profile</h3>
            </div>

            {/* Avatar floats over the strip */}
            <div className="relative px-6 pb-5">
              <div className="-mt-8 mb-3 flex items-end gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-lift ring-4 ring-card"
                  style={{ background: user.avatarColor || '#ED4F86' }}
                >
                  {initials}
                </div>
                {/* Avatar color pickers */}
                <div className="flex items-center gap-1.5 pb-1">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateUser({ avatarColor: c })}
                      className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        background: c,
                        borderColor: user.avatarColor === c ? '#3A2540' : 'transparent',
                      }}
                      aria-label={`Set avatar color`}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center gap-2">
                {editingName ? (
                  <>
                    <input
                      autoFocus
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      className="rounded-xl2 border border-plum/10 bg-bg px-2.5 py-1.5 text-base font-semibold text-plum focus:border-primary/50 focus:outline-none"
                    />
                    <button
                      onClick={saveName}
                      className="rounded-full bg-primary p-1.5 text-white hover:bg-primary-dark"
                    >
                      <Check size={13} />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-plum">{user.name}</p>
                    <button
                      onClick={() => { setNameVal(user.name); setEditingName(true) }}
                      className="rounded-full p-1 text-muted hover:bg-lavender hover:text-plum"
                      aria-label="Edit name"
                    >
                      <Pencil size={13} />
                    </button>
                  </>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted">{user.email}</p>
              <p className="mt-0.5 text-xs text-muted/70">Member since {joinDate}</p>

              {/* Badges */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-plum">
                    Badges <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">{earned.length}/{badges.length}</span>
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {badges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <div
                        key={badge.id}
                        title={badge.earned ? badge.desc : `🔒 ${badge.desc}`}
                        className={`flex flex-col items-center gap-1.5 rounded-xl2 p-2.5 text-center transition-opacity ${badge.earned ? 'opacity-100' : 'opacity-30'}`}
                        style={{ background: badge.earned ? `${badge.color}18` : undefined }}
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ background: badge.earned ? `${badge.color}25` : '#F2EDFA' }}
                        >
                          <Icon size={18} style={{ color: badge.earned ? badge.color : '#8B7C93' }} />
                        </div>
                        <p className="text-[10px] font-semibold leading-tight text-plum">{badge.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-full border border-primary/30 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft transition-colors"
              >
                Log out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
