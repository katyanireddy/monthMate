// Central source of truth for task categories, their colors, and priorities.
// Keeping this in one file means chips, the modal, and filters never drift apart.

export const CATEGORIES = [
  { id: 'study', label: 'Study', dot: '#7C6FE0', chipBg: '#EEEBFB', chipText: '#5B4FBF' },
  { id: 'work', label: 'Work', dot: '#3FA9A0', chipBg: '#E5F5F3', chipText: '#2D8078' },
  { id: 'personal', label: 'Personal', dot: '#ED4F86', chipBg: '#FCE4EF', chipText: '#C23768' },
  { id: 'health', label: 'Health', dot: '#5FA8E8', chipBg: '#E8F2FD', chipText: '#3B7FC0' },
  { id: 'social', label: 'Social', dot: '#E8A23F', chipBg: '#FBEEDC', chipText: '#B87A22' },
  { id: 'creative', label: 'Creative', dot: '#C77DD9', chipBg: '#F6E9FA', chipText: '#9B4FB0' },
]

export const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#8B7C93' },
  { id: 'medium', label: 'Medium', color: '#E8A23F' },
  { id: 'high', label: 'High', color: '#ED4F86' },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[2]
}

export function getPriority(id) {
  return PRIORITIES.find((p) => p.id === id) || PRIORITIES[0]
}
