// Initial demo tasks so a fresh install of the app visually matches the
// reference dashboard (September 2026). Only used the very first time the
// app runs on a browser — after that, LocalStorage takes over.

let counter = 0
const id = () => `seed-${Date.now()}-${counter++}`

const t = (title, date, category, priority = 'medium', completed = false, notes = '') => ({
  id: id(),
  title,
  date, // 'YYYY-MM-DD'
  time: '',
  category,
  priority,
  notes,
  completed,
  createdAt: new Date().toISOString(),
})

export const SEED_TASKS = [
  t('DSA practice', '2026-09-01', 'study'),
  t('Gym', '2026-09-01', 'health'),
  t('ML assignment', '2026-09-02', 'study'),
  t('Club meeting', '2026-09-03', 'social'),
  t('Submit project', '2026-09-04', 'work', 'high'),
  t('Go out?', '2026-09-05', 'social', 'low'),
  t('Family call', '2026-09-06', 'personal'),
  t('Physics internals', '2026-09-07', 'study', 'high'),
  t('Read book', '2026-09-07', 'personal'),
  t('Design UI', '2026-09-09', 'creative'),
  t('Hackathon prep', '2026-09-11', 'work', 'high'),
  t('Mall with girls', '2026-09-12', 'social'),
  t('Plan content', '2026-09-13', 'creative'),
  t('Quant revision', '2026-09-14', 'study'),
  t('Locly dev', '2026-09-15', 'work'),
  t('Skincare', '2026-09-15', 'personal', 'low'),
  t('Class test', '2026-09-16', 'study'),
  t('Update resume', '2026-09-16', 'work'),
  t('Read 10 pages', '2026-09-16', 'personal', 'medium', true),
  t('Gym', '2026-09-16', 'health'),
  t('Event meeting', '2026-09-18', 'work', 'high'),
  t('Goa plan', '2026-09-19', 'social'),
  t('Relax ♡', '2026-09-20', 'personal', 'low'),
  t('Team sync', '2026-09-21', 'work'),
  t('Portfolio work', '2026-09-22', 'creative'),
  t('Grocery', '2026-09-24', 'personal', 'low'),
  t('Blog / YT', '2026-09-25', 'creative'),
  t('Movie night', '2026-09-26', 'social'),
  t('Review month', '2026-09-28', 'work'),
  t('Plan October', '2026-09-29', 'work'),
]
