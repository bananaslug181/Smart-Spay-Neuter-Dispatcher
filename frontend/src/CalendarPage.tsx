import { editAppointment } from './services/dispatcherAPI'
import { addAppointment } from './services/dispatcherAPI'
import {getAppointment} from './services/dispatcherAPI'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppointmentData } from './types/dispatcher'
import { UserSession } from './types/dispatcher'

import './index.css'

function CalendarPage() {

  //const [formData, setFormData] = useState<AppointmentData>({
  //  id: '',
  //  clinic_id: 0,
  //  date: '',
  //});

  // get the user ID from the URL
  //const {userID} = useParams<{userID: string}>();

  const [clinic_id, setClinicId] = useState<string>('');
  const [date, setDate] = useState<string>('');

  // set the states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);


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

    const payload: AppointmentData = {clinic_id: clinic_id, date}

    try {
      // send the to the backend
      const newAppointmentData = await addAppointment(payload);
      // TODO: append the new data??
    } catch (error) {
      setError("Failed to create new appointment.");
    }
  };
  
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

    </>
  );
}
export default CalendarPage;