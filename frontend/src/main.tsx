import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CalendarView from './CalendarPage'
import UserView from './UserPage'
import DayView from './DayPage'
import LoginView from './LoginPage'

//import { userEditorPopup } from './components'
//import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/day" element={<DayView />} />
        <Route path="/profile" element={<UserView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
