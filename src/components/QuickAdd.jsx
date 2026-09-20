import { useState } from 'react'
import { Zap } from 'lucide-react'

export default function QuickAdd({ defaultDate, onAdd }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate)

  function submit() {
    if (!title.trim() || !date) return
    onAdd({ title: title.trim(), date })
    setTitle('')
  }

  return (
    <div className="rounded-xl3 border border-plum/5 bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-plum">
        <Zap size={16} className="text-primary" />
        Quick Add
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="e.g. Finish assignment..."
        className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
      />

      <div className="mt-2.5 flex items-center gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum focus:border-primary/50 focus:outline-none"
        />
        <button
          onClick={submit}
          className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-primary-dark"
        >
          Add
        </button>
      </div>
    </div>
  )
}
