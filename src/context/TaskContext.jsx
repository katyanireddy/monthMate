import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadTasks, saveTasks } from '../utils/storage.js'
import { SEED_TASKS } from '../data/seedTasks.js'
import { CATEGORIES } from '../data/categories.js'

const TaskContext = createContext(null)

function genId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id
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
    case 'UPDATE_TASK': {
      return state.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload.changes } : t))
    }
    case 'DELETE_TASK': {
      return state.filter((t) => t.id !== action.payload.id)
    }
    case 'TOGGLE_COMPLETE': {
      return state.map((t) => (t.id === action.payload.id ? { ...t, completed: !t.completed } : t))
    }
    case 'MOVE_DATE': {
      return state.map((t) => (t.id === action.payload.id ? { ...t, date: action.payload.date } : t))
    }
    case 'TOGGLE_IMPORTANT': {
      return state.map((t) => (t.id === action.payload.id ? { ...t, important: !t.important } : t))
    }
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, undefined, () => loadTasks(SEED_TASKS))

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const api = useMemo(
    () => ({
      tasks,
      addTask: (payload) => dispatch({ type: 'ADD_TASK', payload }),
      updateTask: (id, changes) => dispatch({ type: 'UPDATE_TASK', payload: { id, changes } }),
      deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: { id } }),
      toggleComplete: (id) => dispatch({ type: 'TOGGLE_COMPLETE', payload: { id } }),
      moveDate: (id, date) => dispatch({ type: 'MOVE_DATE', payload: { id, date } }),
      toggleImportant: (id) => dispatch({ type: 'TOGGLE_IMPORTANT', payload: { id } }),
    }),
    [tasks],
  )

  return <TaskContext.Provider value={api}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider')
  return ctx
}
