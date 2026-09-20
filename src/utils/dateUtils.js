// All date helpers work with plain 'YYYY-MM-DD' strings for storage/comparison
// (avoids timezone drift) and native Date objects only for display/math.

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function pad(n) {
  return String(n).padStart(2, '0')
}

export function toKey(year, month, day) {
  // month is 0-indexed
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export function dateToKey(date) {
  return toKey(date.getFullYear(), date.getMonth(), date.getDate())
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInMonth(year, month) {
  // month is 0-indexed
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return lengths[month]
}

// Returns Monday-first weekday index (0 = Monday ... 6 = Sunday)
function mondayIndex(jsDay) {
  return (jsDay + 6) % 7
}

/**
 * Builds a full 6-row (or however many are needed) calendar grid for the
 * given year/month, including the trailing/leading days from adjacent
 * months so every week row has 7 cells.
 */
export function buildCalendarGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const leadingBlanks = mondayIndex(firstOfMonth.getDay())
  const totalDaysThisMonth = daysInMonth(year, month)

  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const totalDaysPrevMonth = daysInMonth(prevYear, prevMonth)

  const cells = []

  for (let i = leadingBlanks; i > 0; i--) {
    const day = totalDaysPrevMonth - i + 1
    cells.push({
      key: toKey(prevYear, prevMonth, day),
      day,
      inMonth: false,
    })
  }

  for (let day = 1; day <= totalDaysThisMonth; day++) {
    cells.push({
      key: toKey(year, month, day),
      day,
      inMonth: true,
    })
  }

  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  let trailingDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      key: toKey(nextYear, nextMonth, trailingDay),
      day: trailingDay,
      inMonth: false,
    })
    trailingDay++
  }

  const rows = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  return rows
}

export function formatLongDate(date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${weekday}, ${pad(day)} ${month} ${year}`
}

export function formatShortDate(date) {
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  return `${pad(day)} ${month}`
}

export function isSameDay(keyA, keyB) {
  return keyA === keyB
}
