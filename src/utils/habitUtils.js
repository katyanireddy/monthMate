import { dateToKey } from './dateUtils.js'

// habit.days holds JS getDay() values (0 = Sunday ... 6 = Saturday).
// Empty or full (7 values) both mean "every day".
export function isScheduledOnDate(habit, date) {
  if (!habit.days || habit.days.length === 0 || habit.days.length >= 7) return true
  return habit.days.includes(date.getDay())
}

/**
 * Walks backward from `today`, counting consecutive *scheduled* days that
 * were completed. Today itself is allowed to be "not yet done" without
 * breaking the streak (so marking it later today keeps the streak alive),
 * but any earlier scheduled-and-missed day stops the count.
 */
export function computeStreak(habit, today = new Date()) {
  const todayKey = dateToKey(today)
  let streak = 0
  const cursor = new Date(today)

  for (let i = 0; i < 366; i++) {
    if (isScheduledOnDate(habit, cursor)) {
      const key = dateToKey(cursor)
      const done = habit.completedDates.includes(key)
      if (done) {
        streak++
      } else if (key !== todayKey) {
        break
      }
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function last7Days(today = new Date()) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days
}
