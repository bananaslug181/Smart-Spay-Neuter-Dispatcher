import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CalendarView from './CalendarPage'
import UserView from './UserPage'
import DayView from './DayPage'

//import { userEditorPopup } from './components'
//import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DayView />} />
        <Route path="/users" element={<UserView />} />
        <Route path="/users/:userID" element={<UserView />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
