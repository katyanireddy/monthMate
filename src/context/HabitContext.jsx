import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import { loadHabits, saveHabits } from '../utils/storage.js'
import { useAuth } from './AuthContext.jsx'

const HabitContext = createContext(null)

function genId() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// Fresh default habits for each new user
function createSeedHabits() {
  return [
    {
      id: genId(),
      title: 'Drink 2L water',
      color: '#5FA8E8',
      days: [0, 1, 2, 3, 4, 5, 6],
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: genId(),
      title: 'Read 15 mins',
      color: '#7C6FE0',
      days: [0, 1, 2, 3, 4, 5, 6],
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: genId(),
      title: 'Gym',
      color: '#ED4F86',
      days: [1, 3, 5],
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
  ]
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_HABITS':
      return action.payload

    case 'ADD_HABIT': {
      const habit = {
        id: genId(),
        title: action.payload.title.trim(),
        color: action.payload.color || '#ED4F86',
        days:
          action.payload.days && action.payload.days.length
            ? action.payload.days
            : [0, 1, 2, 3, 4, 5, 6],
        completedDates: [],
        createdAt: new Date().toISOString(),
      }

      return [habit, ...state]
    }

    case 'UPDATE_HABIT':
      return state.map((habit) =>
        habit.id === action.payload.id
          ? { ...habit, ...action.payload.changes }
          : habit
      )

    case 'DELETE_HABIT':
      return state.filter((habit) => habit.id !== action.payload.id)

    case 'TOGGLE_DATE':
      return state.map((habit) => {
        if (habit.id !== action.payload.id) return habit

        const has = habit.completedDates.includes(action.payload.date)

        const completedDates = has
          ? habit.completedDates.filter((date) => date !== action.payload.date)
          : [...habit.completedDates, action.payload.date]

        return {
          ...habit,
          completedDates,
        }
      })

    default:
      return state
  }
}

export function HabitProvider({ children }) {
  const { user } = useAuth()

  const [habits, dispatch] = useReducer(
    reducer,
    [],
    () => []
  )

  const [isLoaded, setIsLoaded] = useState(false)

  // Load habits for the logged-in user
  useEffect(() => {
    setIsLoaded(false)

    if (!user?.id) {
      dispatch({
        type: 'LOAD_HABITS',
        payload: [],
      })

      setIsLoaded(true)
      return
    }

    const savedHabits = loadHabits(user.id, createSeedHabits())

    dispatch({
      type: 'LOAD_HABITS',
      payload: savedHabits,
    })

    setIsLoaded(true)
  }, [user?.id])

  // Save habits for the current user
  useEffect(() => {
    if (!user?.id || !isLoaded) return

    saveHabits(user.id, habits)
  }, [habits, user?.id, isLoaded])

  const api = useMemo(
    () => ({
      habits,

      addHabit: (payload) =>
        dispatch({
          type: 'ADD_HABIT',
          payload,
        }),

      updateHabit: (id, changes) =>
        dispatch({
          type: 'UPDATE_HABIT',
          payload: { id, changes },
        }),

      deleteHabit: (id) =>
        dispatch({
          type: 'DELETE_HABIT',
          payload: { id },
        }),

      toggleDate: (id, date) =>
        dispatch({
          type: 'TOGGLE_DATE',
          payload: { id, date },
        }),
    }),
    [habits]
  )

  return (
    <HabitContext.Provider value={api}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const ctx = useContext(HabitContext)

  if (!ctx) {
    throw new Error('useHabits must be used within a HabitProvider')
  }

  return ctx
}