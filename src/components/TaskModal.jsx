import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../data/categories.js'

const emptyForm = { title: '', date: '', category: 'personal', priority: 'medium', notes: '' }

export default function TaskModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id
      const dynamicEmptyForm = { ...emptyForm, category: randomCategory }
      setForm(initial ? { ...dynamicEmptyForm, ...initial } : dynamicEmptyForm)
      setError('')
    }
  }, [open, initial])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Please give your task a title.')
      return
    }
    if (!form.date) {
      setError('Please choose a date.')
      return
    }
    onSave({ ...form, title: form.title.trim() })
  }

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
          <motion.form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-md rounded-xl3 bg-card p-6 shadow-lift"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-plum">
                {initial?.id ? 'Edit task' : 'New task'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-muted hover:bg-lavender hover:text-plum"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">Title</label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Finish DSA assignment"
                  className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">Time (optional)</label>
                  <input
                    type="time"
                    value={form.time || ''}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum focus:border-primary/50 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum focus:border-primary/50 focus:outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Complete arrays and linked lists"
                  rows={3}
                  className="w-full resize-none rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                />
              </div>

              {error && <p className="text-xs font-medium text-primary">{error}</p>}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-plum/70 hover:bg-lavender"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card hover:bg-primary-dark"
              >
                {initial?.id ? 'Save changes' : 'Add task'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
