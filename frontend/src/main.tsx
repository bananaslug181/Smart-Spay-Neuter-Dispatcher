import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CalendarView from './CalendarView'
import ProfileView from './ProfileView'

//import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalendarView />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
