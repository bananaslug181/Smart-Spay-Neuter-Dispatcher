//import { editAppointment } from './services/dispatcherAPI'
import { addAppointment } from './services/dispatcherAPI'
import {getAppointment} from './services/dispatcherAPI'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppointmentData } from './types/dispatcher'
import { UserSession } from './types/dispatcher'
import FullCalendar from "@fullcalendar/react";
import './index.css'
//import themePlugin from "@fullcalendar/themes/monarch"; // YOUR THEME

import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import listPlugin from '@fullcalendar/react/list'

// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE
//import { Calendar } from '@fullcalendar/react'


function CalendarPage() {
  // get the user ID from the URL
  //const {userID} = useParams<{userID: string}>();
  const [clinic_id, setClinicId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [weekends, setWeekends] = useState(false);


  // reference: https://www.geeksforgeeks.org/typescript/how-to-get-value-of-input-in-typescript/ 
  // SET STUFF
  const handleClinicIdChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setClinicId(e.target.value);
      };
  const handleDateChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setDate(e.target.value);
      };
    
  // ADD APPOINTMENT
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);
    setIsEditing(true); 

    const payload: AppointmentData = {
      clinic_id: clinic_id, 
      date}

      try {
        // send the to the backend
        const newAppointmentData = await addAppointment(payload);
        // TODO: append the new data??
      } catch (error) {
        setError("Failed to create new appointment.");
      }
  };
  
  const handleDateClick = (info: { dateStr: string }) => {
      alert(info.dateStr);
  };

  const renderEventContent = (eventInfo: any) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
  
  return (
    // reference: https://www.w3schools.com/css/css_navbar.asp 
  <>
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Day View</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/users">Profile</Link></li>
      </ul>
    </nav>

    <form onSubmit={handleUpload}>
      <h1>Schedule Appointment</h1>
      <div>
          <input 
            type="text" 
            value={clinic_id} 
            onChange={handleClinicIdChange} 
            placeholder="Enter the Clinic's ID" 
          />
          <p>Clinic ID: {clinic_id}</p>
      </div>
      <div>
        <input 
          type="text" 
          value={date} 
          onChange={handleDateChange} 
          placeholder="Enter the date in yyyy-mm-dd format" 
        />
        <p>Date: {date}</p>
      </div>
    <button type="submit">
        Submit</button>
    </form>
      
    <button onClick={() => setWeekends(!weekends)}>
      toggle weekends
    </button>
    
    <FullCalendar
      // credit: https://fullcalendar.io/docs/react
      colorScheme='dark'
      plugins={[
        themePlugin,
        dayGridPlugin,
        listPlugin,
      ]}
      eventContent={renderEventContent}
      dateClick={handleDateClick}
      initialView="dayGridMonth"
      headerToolbar={{
        start: 'add today prev,next title',
        end: 'dayGridMonth,dayGridWeek,listWeek',
      }}
      weekends={weekends}
            buttons={{
        add: {
          text: 'Add Event',
          click() {
            alert('handle add event...')
          },
        }
      }}
      //weekends={false}
      events={[
        { title: "event 1", date: "2019-04-01" },
        { title: "event 2", date: "2019-04-02" },
      ]}
    />
  </>

  );
}
export default CalendarPage;