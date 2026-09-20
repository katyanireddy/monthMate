import { Calendar, CalendarClock, CalendarDays, Star, CheckCircle2, Repeat, NotebookPen, X } from 'lucide-react'
import CatIllustration from './CatIllustration.jsx'

const NAV_ITEMS = [
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'today', label: 'Today', icon: CalendarClock },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
  { id: 'important', label: 'Important', icon: Star },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'habits', label: 'Habits', icon: Repeat },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
]

export default function Sidebar({ activeView, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* mobile scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-plum/30 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-[240px] shrink-0 flex flex-col
          bg-gradient-to-b from-primary-soft via-lavender to-bg
          px-5 pt-6 pb-5 transition-transform duration-300 lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          className="absolute right-4 top-4 rounded-full p-1.5 text-plum/60 hover:bg-card/50 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        <div className="mb-8">
          <h1 className="font-display text-[1.55rem] leading-none text-plum tracking-tight">
            MonthMate <span className="text-primary">♥</span>
          </h1>
          <p className="mt-1.5 text-xs text-muted">Plan it. Do it. Slay it.</p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeView === id
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`group flex items-center gap-3 rounded-xl2 px-3.5 py-2.5 text-sm transition-colors
                  ${active ? 'bg-card text-primary shadow-card font-semibold' : 'text-plum/70 hover:bg-card/60'}`}
              >
                <Icon size={17} strokeWidth={active ? 2.3 : 2} className={active ? 'text-primary' : 'text-plum/50 group-hover:text-plum/70'} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-xl3 bg-card/70 px-4 py-4 shadow-soft">
            <p className="font-display text-[15px] leading-snug text-plum">
              Discipline today,
              <br />
              the life you want
              <br />
              tomorrow <span className="text-primary">♡</span>
            </p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-[11px] leading-tight text-muted">
                Small steps
                <br />
                big progress ♡
              </span>
              <CatIllustration className="h-12 w-16" />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
