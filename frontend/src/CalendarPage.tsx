//import { editAppointment } from './services/dispatcherAPI'
import { addAppointment, addReservation } from './services/dispatcherAPI'
import {getAppointment} from './services/dispatcherAPI'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppointmentData, ReservationData } from './types/dispatcher'
import { UserSession, UserData } from './types/dispatcher'
import FullCalendar from "@fullcalendar/react";
import ModalBox from "./components/ModalBox";
import {
  EventApi,
  DateSelectInfo,
  EventClickInfo,
  EventDisplayInfo,
  formatDate,
} from '@fullcalendar/react'

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

const API_BASE_URL = (import.meta as ImportMeta & { readonly env: { readonly VITE_API_URL?: string } }).env.VITE_API_URL || 'http://localhost:8001';

function CalendarPage() {
  // get the user ID from the URL
  //const {userID} = useParams<{userID: string}>();
  const [time, setTime] = useState<string>('');
  const [total_slots, setTotalSlots] = useState<number>(0);
  const [slots_available, setSlotsAvailable] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [weekends, setWeekends] = useState(true);


  // reference: https://www.geeksforgeeks.org/typescript/how-to-get-value-of-input-in-typescript/ 
  // HANDLE CHANGES
  const handleDateChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setDate(e.target.value);
      };
    const handleTimeChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setTime(e.target.value);
      };
  const handleTotalSlotsChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setTotalSlots(Number(e.target.value));
      };
  
  // ADD APPOINTMENT
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);
    setIsEditing(true); 

    const payload: AppointmentData = {
      clinic_id: currentUser?.user_id ?? '', // the clinic id is just the user_id, cuz only clinics are allowed to allocate appointments 
      date: date,
      time: time,
      total_slots: total_slots,
      slots_available: slots_available
      }
      try {
        // send the to the backend
        const newAppointmentData = await addAppointment(payload);
        // TODO: append the new data?? to what? i forget - future me
      } catch (error) {
        setError("Failed to create new appointment.");
      }
  };

  // ADD RESERVATION
  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);
    setIsEditing(true); 

    const payload: ReservationData = {
      user_id: Number(currentUser?.user_id ?? ''),
      appointment_id: null,
      patient_details: {
        'name': 'Unnamed',
        'distance_from_clinic': null,
        'ear_tipped': null,
        'gender': null,
        'long_distance_travel': null,
        'months_old': null,
        'underweight': null,
      },
      status: ''
      }
      try {
        // send the to the backend
        const newReservationData = await addReservation(payload);
        // TODO: append the new data??
      } catch (error) {
        setError("Failed to create new reservation.");
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
  

  // RESERVATION SCHEDULE POPUP
  // credit: https://dev.to/theedgebreaker/creating-a-simple-modal-component-in-react-with-typescript-for-beginners-42ac 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleShowModal = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  /// GET THE CURRENT USER
    // credit: https://testdriven.io/blog/flask-spa-auth/
    useEffect(() => {
      fetch(`${API_BASE_URL}/api/data`, { // could put this in dispatcherapi.ts
        credentials: "include",
      })
      .then((res) => res.json())
      .then((data: UserData) => {
        console.log(data);
        if (data.user_id) {
        setCurrentUser({
          login: true,
          user_id: data.user_id,
          role: data.role
        });
        } else {
          setIsAuthenticated: false; // TODO should be ()?
          //csrf();
        }
      })
      .catch((err) => {
        console.log("FAILED TO FETCH SESSION", err);
      });
    }, []);

    
  // FETCH THE APPOINTMENTS
  // get the appointments, credit: https://testdriven.io/blog/flask-spa-auth/
  useEffect( () => {
    // dont fetch until there is a user id to fetch with
    if (!currentUser?.user_id) return;

    fetch(`${API_BASE_URL}/appointments/${currentUser?.user_id}`, {// could put this in dispatcherapi.ts
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // delete?
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Event data: ", data);      
      setEvents(data); // set the event array to the appointment data
    })
    .catch((err) => {
      console.log(err);
    });
  }, [currentUser]); // run again when there is a current user


  // credit: https://github.com/fullcalendar/fullcalendar-examples/blob/main/react19/src/DemoApp.tsx 
  function handleEventClick(clickInfo: EventClickInfo) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      console.log("EVENT ID: ", clickInfo.event.id)
      //clickInfo.event.remove()
      // open up a reservation window/page/popup 
    }
  }


  return (
    // references: https://www.w3schools.com/css/css_navbar.asp
    // https://dev.to/theedgebreaker/creating-a-simple-modal-component-in-react-with-typescript-for-beginners-42ac
  <>
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/day">Day View</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  
    {currentUser?.role == 'client' ?(
    <form onSubmit={handleUpload}>
      <h1>Reserve an Appointment Slot</h1>
      <div>
        <p>Date: (Enter the date in yyyy-mm-dd format (with dashes)): {date}</p>
        <input 
          type="text" 
          value={date} 
          onChange={handleDateChange} 
          placeholder="Enter the date" 
        />
      </div>
      <div>
        <p>Time- (Enter the time in 00:00 military time format): {time}</p>
        <input 
          type="text" 
          value={time} 
          onChange={handleTimeChange} 
          placeholder="Enter the time" 
        />
      </div>

      <div className="relative"> 
      <button
        className="bg-green-600 hover:bg-green-500 transition duration-150
      text-white px-5 py-2 rounded-md absolute top-4 left-8 transform"
        onClick={handleShowModal}
      >
        Show Modal
      </button>
      {isModalVisible && <ModalBox onClose={handleCloseModal} />}
    </div>

    <button type="submit">
        Submit</button>
    </form>
    
      
    ) : (
    //<button onClick={() => setWeekends(!weekends)}>
      //toggle weekends
    //</button>
    <form onSubmit={handleUpload}>
      <h1>Allocate Appointment Slots</h1>
      <div>
        <p>Date: (Enter the date in yyyy-mm-dd format (with dashes)): {date}</p>
        <input 
          type="text" 
          value={date} 
          onChange={handleDateChange} 
          placeholder="Enter the date" 
        />
      </div>
      <div>
        <p>Time- (Enter the time in 00:00 military time format): {time}</p>
        <input 
          type="text" 
          value={time} 
          onChange={handleTimeChange} 
          placeholder="Enter the time" 
        />
      </div>
      <div>
        <p>Total Slots: {total_slots}</p>
        <input 
          type="text" 
          value={total_slots} 
          onChange={handleTotalSlotsChange} 
          placeholder="Enter the total appointment slot amount" 
        />
      </div>
    
    <div className="relative"> 
      <button
        className="bg-green-600 hover:bg-green-500 transition duration-150
      text-white px-5 py-2 rounded-md absolute top-4 left-8 transform"
        onClick={handleShowModal}
      >
        Show Modal
      </button>
      {isModalVisible && <ModalBox onClose={handleCloseModal} />}
    </div>

    <button type="submit">
        Submit</button>
    </form>
    )}

    <FullCalendar
      // credit: https://fullcalendar.io/docs/react
      colorScheme='dark'
      plugins={[
        themePlugin,
        dayGridPlugin,
        listPlugin,
      ]}
      events={events} 
      // set it to my saved appointment data
      eventContent={renderEventContent}
      dateClick={handleDateClick} // TODO can do something with this instead of my way?
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
      eventClick={handleEventClick}
      //weekends={false}
      //events={[
       // { title: "event 1", date: "2019-04-01" },
       // { title: "event 2", date: "2019-04-02" },
      //]}
    />
  </>
  );
}
export default CalendarPage;
