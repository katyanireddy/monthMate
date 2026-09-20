import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  
} from 'react'

import { loadTasks, saveTasks } from '../utils/storage.js'
import { CATEGORIES } from '../data/categories.js'
import { useAuth } from './AuthContext.jsx'

const TaskContext = createContext(null)

function genId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TASKS':
      return action.payload

    case 'ADD_TASK': {
      const randomCategory =
        CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id

      const task = {
        id: genId(),
        title: action.payload.title.trim(),
        date: action.payload.date,
        time: action.payload.time || '',
        category: action.payload.category || randomCategory,
        priority: action.payload.priority || 'medium',
        notes: action.payload.notes || '',
        completed: false,
        important: action.payload.important || false,
        createdAt: new Date().toISOString(),
      }

      return [task, ...state]
    }

    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.changes }
          : task
      )

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload.id)

    case 'TOGGLE_COMPLETE':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      )

    case 'MOVE_DATE':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, date: action.payload.date }
          : task
      )

    case 'TOGGLE_IMPORTANT':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, important: !task.important }
          : task
      )

    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const { user } = useAuth()

  const [tasks, dispatch] = useReducer(
    reducer,
    [],
    () => []
  )

  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks for current user
  useEffect(() => {
    setIsLoaded(false)

    if (!user?.id) {
      dispatch({
        type: 'LOAD_TASKS',
        payload: [],
      })

      setIsLoaded(true)
      return
    }

    const savedTasks = loadTasks(user.id, [])

    dispatch({
      type: 'LOAD_TASKS',
      payload: savedTasks,
    })

    setIsLoaded(true)
  }, [user?.id])

  // Save only after tasks have loaded
  useEffect(() => {
    if (!user?.id || !isLoaded) return

    saveTasks(user.id, tasks)
  }, [tasks, user?.id, isLoaded])

  const api = useMemo(
    () => ({
      tasks,

      addTask: (payload) =>
        dispatch({ type: 'ADD_TASK', payload }),

      updateTask: (id, changes) =>
        dispatch({
          type: 'UPDATE_TASK',
          payload: { id, changes },
        }),

      deleteTask: (id) =>
        dispatch({
          type: 'DELETE_TASK',
          payload: { id },
        }),

      toggleComplete: (id) =>
        dispatch({
          type: 'TOGGLE_COMPLETE',
          payload: { id },
        }),

      moveDate: (id, date) =>
        dispatch({
          type: 'MOVE_DATE',
          payload: { id, date },
        }),

      toggleImportant: (id) =>
        dispatch({
          type: 'TOGGLE_IMPORTANT',
          payload: { id },
        }),
    }),
    [tasks]
  )

  return (
    <TaskContext.Provider value={api}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)

  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider')
  }

  return ctx
}