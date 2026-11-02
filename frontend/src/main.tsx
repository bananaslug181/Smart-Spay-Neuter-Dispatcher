import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CalendarView from './CalendarPage'
import ProfileView from './ProfilePage'
import DayView from './DayPage'

//import { ProfileEditorPopup } from './components'
//import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DayView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
