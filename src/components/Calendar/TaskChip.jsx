import { getCategory } from '../../data/categories.js'

export default function TaskChip({ task }) {
  const cat = getCategory(task.category)
  return (
    <span
      className={`flex items-center gap-1.5 truncate rounded-full px-2 py-[3px] text-[10.5px] leading-tight
        ${task.completed ? 'opacity-50' : ''}`}
      style={{ background: cat.chipBg, color: cat.chipText }}
      title={task.title}
    >
      <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: cat.dot }} />
      <span className={`truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
    </span>
  )
}
