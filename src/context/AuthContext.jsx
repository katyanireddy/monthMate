import { createContext, useContext, useState, useEffect } from 'react'
import { loadUsers, saveUsers, loadSession, saveSession, deleteSession, loadLoginDays, saveLoginDays } from '../utils/storage.js'
import { dateToKey } from '../utils/dateUtils.js'

const AuthContext = createContext(null)

function hashPassword(pw) {
  return btoa(unescape(encodeURIComponent(pw)))
}

const AVATAR_COLORS = [
  '#ED4F86', '#7C6FE0', '#3FA9A0', '#5FA8E8', '#E8A23F', '#C77DD9',
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession())

  // Track login days for "Consistent" badge
  useEffect(() => {
    if (!user) return
    const todayKey = dateToKey(new Date())
    const days = loadLoginDays()
    if (!days.includes(todayKey)) {
      saveLoginDays([...days, todayKey])
    }
  }, [user])

  function signup({ name, email, password }) {
    const users = loadUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists.' }
    }
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      avatarColor: randomColor,
      joinedAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    const sessionUser = { ...newUser, passwordHash: undefined }
    saveSession(sessionUser)
    setUser(sessionUser)
    return { success: true }
  }

  function login({ email, password }) {
    const users = loadUsers()
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!found) return { error: 'No account found with that email.' }
    if (found.passwordHash !== hashPassword(password)) return { error: 'Incorrect password.' }
    const sessionUser = { ...found, passwordHash: undefined }
    saveSession(sessionUser)
    setUser(sessionUser)
    return { success: true }
  }

  function logout() {
    deleteSession()
    setUser(null)
  }

  function updateUser(changes) {
    const users = loadUsers()
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, ...changes } : u
    )
    saveUsers(updated)
    const updatedSession = { ...user, ...changes }
    saveSession(updatedSession)
    setUser(updatedSession)
  }

  function resetPassword({ email, newPassword }) {
    const users = loadUsers()
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (idx === -1) return { error: 'No account found with that email.' }
    users[idx] = { ...users[idx], passwordHash: hashPassword(newPassword) }
    saveUsers(users)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateUser, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
