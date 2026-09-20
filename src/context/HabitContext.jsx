import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadHabits, saveHabits } from '../utils/storage.js'

const HabitContext = createContext(null)

function genId() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// A couple of starter habits so the view isn't empty on first run —
// zero history, so streaks start honestly at 0.
const SEED_HABITS = [
  { id: genId(), title: 'Drink 2L water', color: '#5FA8E8', days: [0, 1, 2, 3, 4, 5, 6], completedDates: [], createdAt: new Date().toISOString() },
  { id: genId(), title: 'Read 15 mins', color: '#7C6FE0', days: [0, 1, 2, 3, 4, 5, 6], completedDates: [], createdAt: new Date().toISOString() },
  { id: genId(), title: 'Gym', color: '#ED4F86', days: [1, 3, 5], completedDates: [], createdAt: new Date().toISOString() },
]

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_HABIT': {
      const habit = {
        id: genId(),
        title: action.payload.title.trim(),
        color: action.payload.color || '#ED4F86',
        days: action.payload.days && action.payload.days.length ? action.payload.days : [0, 1, 2, 3, 4, 5, 6],
        completedDates: [],
        createdAt: new Date().toISOString(),
      }
      return [habit, ...state]
    }
    case 'UPDATE_HABIT': {
      return state.map((h) => (h.id === action.payload.id ? { ...h, ...action.payload.changes } : h))
    }
    case 'DELETE_HABIT': {
      return state.filter((h) => h.id !== action.payload.id)
    }
    case 'TOGGLE_DATE': {
      return state.map((h) => {
        if (h.id !== action.payload.id) return h
        const has = h.completedDates.includes(action.payload.date)
        const completedDates = has
          ? h.completedDates.filter((d) => d !== action.payload.date)
          : [...h.completedDates, action.payload.date]
        return { ...h, completedDates }
      })
    }
    default:
      return state
  }
}

export function HabitProvider({ children }) {
  const [habits, dispatch] = useReducer(reducer, undefined, () => loadHabits(SEED_HABITS))

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  const api = useMemo(
    () => ({
      habits,
      addHabit: (payload) => dispatch({ type: 'ADD_HABIT', payload }),
      updateHabit: (id, changes) => dispatch({ type: 'UPDATE_HABIT', payload: { id, changes } }),
      deleteHabit: (id) => dispatch({ type: 'DELETE_HABIT', payload: { id } }),
      toggleDate: (id, date) => dispatch({ type: 'TOGGLE_DATE', payload: { id, date } }),
    }),
    [habits],
  )

  return <HabitContext.Provider value={api}>{children}</HabitContext.Provider>
}

export function useHabits() {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits must be used within a HabitProvider')
  return ctx
}
