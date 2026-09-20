const TASKS_KEY = 'monthmate.tasks.v1'
const THEME_KEY = 'monthmate.theme.v1'
const HABITS_KEY = 'monthmate.habits.v1'

export function loadTasks(userId, fallback = []) {
  if (!userId) return []

  try {
    const key = `${TASKS_KEY}.${userId}`
    const raw = window.localStorage.getItem(key)

    if (!raw) return fallback

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return fallback

    return parsed
  } catch (err) {
    console.error('MonthMate: failed to read tasks', err)
    return fallback
  }
}

export function saveTasks(userId, tasks) {
  if (!userId) return

  try {
    const key = `${TASKS_KEY}.${userId}`
    window.localStorage.setItem(key, JSON.stringify(tasks))
  } catch (err) {
    console.error('MonthMate: failed to save tasks', err)
  }
}

export function loadTheme(fallback = 'light') {
  try {
    return window.localStorage.getItem(THEME_KEY) || fallback
  } catch {
    return fallback
  }
}

export function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch (err) {
    console.error('MonthMate: failed to save theme to LocalStorage', err)
  }
}

export function loadHabits(userId, fallback = []) {
  if (!userId) return []

  try {
    const key = `${HABITS_KEY}.${userId}`
    const raw = window.localStorage.getItem(key)

    if (!raw) return fallback

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return fallback

    return parsed
  } catch (err) {
    console.error('MonthMate: failed to read habits', err)
    return fallback
  }
}

export function saveHabits(userId, habits) {
  if (!userId) return

  try {
    const key = `${HABITS_KEY}.${userId}`
    window.localStorage.setItem(key, JSON.stringify(habits))
  } catch (err) {
    console.error('MonthMate: failed to save habits', err)
  }
}

const USERS_KEY = 'monthmate.users.v1'
const SESSION_KEY = 'monthmate.session.v1'

export function loadUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

export function saveUsers(users) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('MonthMate: failed to save users', err)
  }
}

export function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSession(user) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch (err) {
    console.error('MonthMate: failed to save session', err)
  }
}

export function deleteSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch (err) {
    console.error('MonthMate: failed to delete session', err)
  }
}

export function loadLoginDays() {
  try {
    const raw = window.localStorage.getItem('monthmate.logindays.v1')
    if (!raw) return []
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

export function saveLoginDays(days) {
  try {
    window.localStorage.setItem('monthmate.logindays.v1', JSON.stringify(days))
  } catch {}
}

