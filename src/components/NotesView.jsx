import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Edit3,
  X,
  Lightbulb,
  BookOpen,
  Brain,
  ListTodo,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'
import { loadNotes, saveNotes } from '../utils/storage.js'

const COLORS = [
  '#FCE4EC',
  '#E8EAFB',
  '#E3F4EF',
  '#FFF3D6',
  '#F1E7FA',
]

const CATEGORIES = [
  { id: 'personal', label: 'Personal', emoji: '💭' },
  { id: 'ideas', label: 'Ideas', emoji: '💡' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'todo', label: 'To-do', emoji: '📝' },
]

const EMPTY_NOTE = {
  title: '',
  content: '',
  category: 'personal',
  color: COLORS[0],
  pinned: false,
}

function getCategory(id) {
  return CATEGORIES.find((category) => category.id === id) || CATEGORIES[0]
}

export default function NotesView() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_NOTE)
  const [prompt, setPrompt] = useState(
    'What are you overthinking today?'
  )

  const prompts = [
    'What are you overthinking today?',
    'What is one idea worth exploring?',
    'What made you smile today?',
    'What do you want to achieve this week?',
    'What did you learn today?',
  ]

  const isLoaded = useRef(false)

  useEffect(() => {
    if (!user?.id) {
      setNotes([])
      isLoaded.current = false
      setLoaded(false)
      return
    }

    isLoaded.current = false
    setLoaded(false)

    const savedNotes = loadNotes(user.id, [])
    setNotes(savedNotes)

    isLoaded.current = true
    setLoaded(true)
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || !isLoaded.current || !loaded) return

    saveNotes(user.id, notes)
  }, [notes, user?.id, loaded])

  function openNewNote(category = 'personal') {
    setEditingId(null)
    setForm({
      ...EMPTY_NOTE,
      category,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
    setEditorOpen(true)
  }

  function openEditNote(note) {
    setEditingId(note.id)
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color,
      pinned: note.pinned,
    })
    setEditorOpen(true)
  }

  function closeEditor() {
    setEditorOpen(false)
    setEditingId(null)
    setForm(EMPTY_NOTE)
  }

  function saveNote() {
    if (!form.title.trim() && !form.content.trim()) return

    if (editingId) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingId
            ? {
                ...note,
                ...form,
                title: form.title.trim() || 'Untitled note',
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      )
    } else {
      const newNote = {
        id: `note-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        ...form,
        title: form.title.trim() || 'Untitled note',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setNotes((current) => [newNote, ...current])
    }

    closeEditor()
  }

  function deleteNote(id) {
    setNotes((current) => current.filter((note) => note.id !== id))
  }

  function togglePin(id) {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      )
    )
  }

  function changePrompt() {
    const next = prompts[Math.floor(Math.random() * prompts.length)]
    setPrompt(next)
  }

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase())

        const matchesFilter =
          filter === 'all' || note.category === filter

        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned)

        return new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      })
  }, [notes, search, filter])

  const pinnedNotes = filteredNotes.filter((note) => note.pinned)
  const regularNotes = filteredNotes.filter((note) => !note.pinned)

  function NoteCard({ note }) {
  const category = getCategory(note.category)

  return (
    <div
      className="group relative rounded-xl3 border border-black/5 p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
      style={{ backgroundColor: note.color }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#4B3045]">
          {category.emoji} {category.label}
        </span>

        <button
          onClick={() => togglePin(note.id)}
          className="rounded-full p-1.5 text-[#4B3045]/60 transition hover:bg-white/70 hover:text-[#4B3045]"
          title={note.pinned ? 'Unpin note' : 'Pin note'}
        >
          {note.pinned ? <Pin size={15} /> : <PinOff size={15} />}
        </button>
      </div>

      <h3 className="mb-2 font-display text-lg text-[#4B3045]">
        {note.title}
      </h3>

      <p className="min-h-16 whitespace-pre-wrap text-sm leading-6 text-[#4B3045]/75">
        {note.content || 'No content yet...'}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#4B3045]/60">
          {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
        </span>

        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => openEditNote(note)}
            className="rounded-full p-2 text-[#4B3045] hover:bg-white/70"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={() => deleteNote(note.id)}
            className="rounded-full p-2 text-[#4B3045] hover:bg-white/70"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-display text-3xl text-plum">
            Notes ✨
          </h1>

          <p className="mt-1 text-sm text-muted">
            Your little corner of thoughts
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl2 border border-plum/5 bg-card px-4 py-3 text-sm text-plum shadow-card">
          💡 {prompt}

          <button
            onClick={changePrompt}
            className="ml-2 text-muted hover:text-plum"
            title="New prompt"
          >
            ↻
          </button>
        </div>
      </div>

      <div className="rounded-xl3 border border-primary/10 bg-card p-5 shadow-card">
        <p className="mb-4 text-sm font-medium text-muted">
          What's on your mind?
        </p>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => openNewNote(category.id)}
              className="rounded-full border border-plum/10 px-4 py-2 text-sm font-medium text-plum transition hover:-translate-y-0.5 hover:bg-primary-soft"
            >
              {category.emoji} {category.label}
            </button>
          ))}

          <button
            onClick={() => openNewNote()}
            className="ml-auto flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-plum/10 bg-card px-4 py-3">
          <Search size={17} className="text-muted" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your notes..."
            className="w-full bg-transparent text-sm text-plum outline-none placeholder:text-muted"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-full border border-plum/10 bg-card px-4 py-3 text-sm text-plum outline-none"
        >
          <option value="all">All notes</option>

          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {pinnedNotes.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Pin size={17} className="text-primary" />

            <h2 className="font-display text-xl text-plum">
              Pinned
            </h2>

            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs text-primary">
              {pinnedNotes.length}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-plum">
            All Notes
          </h2>

          <span className="text-sm text-muted">
            {regularNotes.length} notes
          </span>
        </div>

        {regularNotes.length === 0 && pinnedNotes.length === 0 ? (
          <div className="rounded-xl3 border border-dashed border-primary/30 bg-card p-14 text-center">
            <div className="mx-auto mb-3 text-4xl">🌷</div>

            <h3 className="font-display text-xl text-plum">
              Your thoughts live here
            </h3>

            <p className="mt-2 text-sm text-muted">
              Start writing your ideas, plans, and random thoughts.
            </p>

            <button
              onClick={() => openNewNote()}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </section>

      {editorOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum/30 p-4 backdrop-blur-sm">
    <div className="w-full max-w-lg rounded-xl3 border border-plum/10 bg-card p-6 text-plum shadow-lift dark:border-white/10 dark:text-white">

      {/* Modal Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl text-plum dark:text-white">
          {editingId ? 'Edit Note ✨' : 'New Note ✨'}
        </h2>

        <button
          onClick={closeEditor}
          className="rounded-full p-2 text-muted transition hover:bg-primary-soft"
        >
          <X size={18} />
        </button>
      </div>

      {/* Title */}
      <input
        value={form.title}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            title: event.target.value,
          }))
        }
        placeholder="Note title..."
        className="mb-3 w-full rounded-xl2 border border-plum/10 bg-bg px-4 py-3 font-display text-lg text-plum outline-none focus:border-primary dark:border-white/10 dark:bg-[#252131] dark:text-white dark:placeholder:text-white/40"
      />

      {/* Content */}
      <textarea
        value={form.content}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            content: event.target.value,
          }))
        }
        placeholder="Write whatever is on your mind..."
        rows={7}
        className="w-full resize-none rounded-xl2 border border-plum/10 bg-bg px-4 py-3 text-sm leading-6 text-plum outline-none focus:border-primary dark:border-white/10 dark:bg-[#252131] dark:text-white dark:placeholder:text-white/40"
      />

      {/* Categories */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              setForm((current) => ({
                ...current,
                category: category.id,
              }))
            }
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              form.category === category.id
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-plum/10 text-muted dark:border-white/10'
            }`}
          >
            {category.emoji} {category.label}
          </button>
        ))}
      </div>

      {/* Colors */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-muted">Color</span>

        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() =>
              setForm((current) => ({
                ...current,
                color,
              }))
            }
            className={`h-7 w-7 rounded-full border-2 ${
              form.color === color
                ? 'border-plum dark:border-white'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            aria-label="Select note color"
          />
        ))}
      </div>

      {/* Pin */}
      <label className="mt-4 flex items-center gap-2 text-sm text-plum dark:text-white">
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              pinned: event.target.checked,
            }))
          }
        />
        Pin this note
      </label>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={closeEditor}
          className="rounded-full border border-plum/10 px-5 py-2.5 text-sm font-medium text-plum dark:border-white/10 dark:text-white"
        >
          Cancel
        </button>

        <button
          onClick={saveNote}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white"
        >
          {editingId ? 'Save Changes' : 'Create Note'}
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  )
}