import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CATEGORIES } from '../../data/categories.js'

const DAY_OPTIONS = [
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
  { label: 'S', value: 0 },
]

const SWATCHES = CATEGORIES.map((c) => c.dot)
const emptyForm = { title: '', color: SWATCHES[0], days: [0, 1, 2, 3, 4, 5, 6] }

export default function HabitModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      const randomColor = SWATCHES[Math.floor(Math.random() * SWATCHES.length)]
      const dynamicEmptyForm = { ...emptyForm, color: randomColor }
      setForm(initial ? { ...dynamicEmptyForm, ...initial } : dynamicEmptyForm)
      setError('')
    }
  }, [open, initial])

  function toggleDay(value) {
    setForm((f) => {
      const has = f.days.includes(value)
      const days = has ? f.days.filter((d) => d !== value) : [...f.days, value]
      return { ...f, days }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Give your habit a name.')
      return
    }
    if (form.days.length === 0) {
      setError('Pick at least one day to repeat on.')
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
            className="w-full max-w-sm rounded-xl3 bg-card p-6 shadow-lift"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg text-plum">{initial?.id ? 'Edit habit' : 'New habit'}</h3>
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
                <label className="mb-1.5 block text-xs font-semibold text-muted">Habit name</label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Drink 2L water"
                  className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">Color</label>
                <div className="flex items-center gap-2">
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className="h-7 w-7 rounded-full border-2 transition-transform"
                      style={{ background: c, borderColor: form.color === c ? '#3A2540' : 'transparent' }}
                      aria-label={`Choose color`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">Repeat on</label>
                <div className="flex items-center gap-1.5">
                  {DAY_OPTIONS.map((d) => {
                    const active = form.days.includes(d.value)
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.value)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors
                          ${active ? 'bg-primary text-white' : 'bg-lavender text-plum/50'}`}
                      >
                        {d.label}
                      </button>
                    )
                  })}
                </div>
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
                {initial?.id ? 'Save changes' : 'Add habit'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
