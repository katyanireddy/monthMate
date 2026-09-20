import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import { HabitProvider } from './context/HabitContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <HabitProvider>
          <App />
        </HabitProvider>
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>,
)
