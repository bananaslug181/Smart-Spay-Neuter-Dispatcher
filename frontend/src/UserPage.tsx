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

  /*
  const [formData, setFormData] = useState<UserData>({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone: ''
  });
  // get the user ID from the URL- don't need this cuz using credentials + sessions?
  const {userID} = useParams<{userID: string}>();
  const [first_name, setFirstName] = useState<string>('');
  const [last_name, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  */

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
      alert(`Welcome, ${data.first_name}!`);
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


  // reference: https://www.geeksforgeeks.org/typescript/how-to-get-value-of-input-in-typescript/ 
  // SET STUFF
  /*
  const handleFirstNameChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setFirstName(e.target.value);
      };
  const handleLastNameChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setLastName(e.target.value);
      };
  const handleAddressChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setAddress(e.target.value);
      };
  const handlePhoneChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setPhone(e.target.value);
      };
  const handleEmailChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
      };
    */


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

  // ADD USER
  //const handleUpload = async (e: React.FormEvent) => {
  //  e.preventDefault(); // prevent page reloading
  //  setError(null);
  //  setSuccess(false);
  //  setIsEditing(true); 

  //  const payload: UserData = {first_name, last_name, phone, email, address}

  //  try {
      // send the to the backend
  //    const newUserData = await addUser(payload);
  //    setCurrentUser(newUserData);
  //    setSuccess(true);
      // return user to the GET User page
      //fetchUser();
  //  } catch (error) {
  //    setError("Failed to upload user data.");
  //  }
  //};

  
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
    
    <form> {/*onSubmit={handleUpload}>*/}
      <h1>View Your Profile</h1>
      <div>{/*
          <input 
            type="text" 
            value={first_name} 
            onChange={handleFirstNameChange} 
            placeholder="Enter your first name"
          /> 
          */}
          <p>First Name: {currentUser?.first_name}</p>
      </div>
      <div>
        {/*
        <input 
          type="text" 
          value={last_name} 
          onChange={handleLastNameChange} 
          placeholder="Enter your last name" 
        />
        */}
        <p>Last Name: {currentUser?.last_name}</p>
      </div>
      <div>{/*
          <input 
            type="text" 
            value={email} 
            onChange={handleEmailChange} 
            placeholder="Enter your email" 
          />
          */}
          <p>Email: {currentUser?.email}</p>
      </div>
      {/*
      <div>
        
          <input 
            type="text" 
            value={address} 
            onChange={handleAddressChange} 
            placeholder="Enter your address" 
          />
          
          <p>Address: {address}</p>
      </div>
      
    <div>
        <input 
          type="text" 
          value={phone} 
          onChange={handlePhoneChange} 
          placeholder="Enter your phone" 
        />
        <p>Phone: {phone}</p>
    </div>
    <button type="submit">
        Submit
    </button>
    */}
    </form>
    </>
  );
}
export default UserPage;
