import { useState, useRef, useEffect } from 'react'
import { Search, Sun, Moon, Bell, ChevronDown, Menu, X, User, LogOut } from 'lucide-react'
import { keyToDate, formatShortDate } from '../utils/dateUtils.js'
import { getCategory } from '../data/categories.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header({ tasks, onJumpToTask, theme, onToggleTheme, onOpenMenu, onOpenProfile }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const boxRef = useRef(null)
  const profileRef = useRef(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setFocused(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results =
    query.trim().length > 0
      ? tasks.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
      : []

  const initials = user
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="flex items-center gap-3 px-1">
      <button
        onClick={onOpenMenu}
        className="rounded-xl2 p-2 text-plum/70 hover:bg-lavender lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md" ref={boxRef}>
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="A more organised you, a happier you ♡"
          className="w-full rounded-full border border-transparent bg-card py-2.5 pl-10 pr-9 text-sm text-plum shadow-card placeholder:text-muted/80 focus:border-primary/40 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-plum"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}

        {focused && query.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-80 overflow-y-auto rounded-xl3 bg-card p-2 shadow-lift">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted">
                No tasks match "{query}" — maybe it's time to add one? ♡
              </div>
            ) : (
              results.map((t) => {
                const cat = getCategory(t.category)
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onJumpToTask(t)
                      setFocused(false)
                      setQuery('')
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl2 px-3 py-2.5 text-left text-sm hover:bg-lavender"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cat.dot }} />
                      <span className={`truncate ${t.completed ? 'text-muted line-through' : 'text-plum'}`}>{t.title}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{formatShortDate(keyToDate(t.date))}</span>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onToggleTheme}
          className="rounded-full p-2.5 text-plum/70 hover:bg-lavender"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative rounded-full p-2.5 text-plum/70 hover:bg-lavender" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Profile dropdown */}
        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-lavender"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: user?.avatarColor || '#ED4F86' }}
            >
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-plum sm:inline">
              Hi, {user?.name?.split(' ')[0] || 'there'}
            </span>
            <ChevronDown size={14} className={`hidden text-muted sm:inline transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-44 overflow-hidden rounded-xl2 bg-card py-1 shadow-lift">
              <div className="border-b border-plum/5 px-3.5 py-2.5">
                <p className="text-xs font-semibold text-plum truncate">{user?.name}</p>
                <p className="text-[11px] text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setProfileOpen(false); onOpenProfile() }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-plum hover:bg-lavender"
              >
                <User size={14} /> View profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); logout() }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-primary hover:bg-primary-soft"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
