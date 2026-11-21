import { editUser } from './services/dispatcherAPI'
import { addUser } from './services/dispatcherAPI'
import {getUser} from './services/dispatcherAPI'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserData } from './types/dispatcher'
import { UserSession } from './types/dispatcher'
import './index.css'
const API_BASE_URL = (import.meta as ImportMeta & { readonly env: { readonly VITE_API_URL?: string } }).env.VITE_API_URL || 'http://localhost:8001';

function UserPage() {

  // set the states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [first_name, setFirstName] = useState<UserData | null>(null);
  const [last_name, setLastName] = useState<UserSession | null>(null);
  const [email, setEmail] = useState<UserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  

  // get the user, credit: https://testdriven.io/blog/flask-spa-auth/
  useEffect( () => {
    fetch(`${API_BASE_URL}/api/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setCurrentUser({
        login: true,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);


  // credit: https://testdriven.io/blog/flask-spa-auth/
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/getsession`, { // could put this in dispatcherapi.ts
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data: UserSession) => {
      console.log(data);
      if (data.login == true) {
      setCurrentUser({
        login: true,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
      } else {
        setIsAuthenticated: false;
        //csrf();
      }
    })
    .catch((err) => {
      console.log("FAILED TO FETCH SESSION", err);
    });
  }, []);

  
  return (
    // reference: https://www.w3schools.com/css/css_navbar.asp 
    <>
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Day View</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
    
    <form>
      <h1>View Your Profile</h1>
      <div>
          <p>First Name: {currentUser?.first_name}</p>
      </div>
      <div>
        <p>Last Name: {currentUser?.last_name}</p>
      </div>
      <div>
          <p>Email: {currentUser?.email}</p>
      </div>
    </form>
    </>
  );
}
export default UserPage;
