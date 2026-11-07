import { editUser } from './services/dispatcherAPI'
import { addUser } from './services/dispatcherAPI'
import {getUser} from './services/dispatcherAPI'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserData } from './types/dispatcher'
import './index.css'

function UserPage() {

  const [formData, setFormData] = useState<UserData>({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone: ''
  });

  // get the user ID from the URL
  const {userID} = useParams<{userID: string}>();

  const [first_name, setFirstName] = useState<string>('');
  const [last_name, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // set the states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // reference: https://www.geeksforgeeks.org/typescript/how-to-get-value-of-input-in-typescript/ 
  // SET STUFF
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
    
  // GET PROFILE
  // reference: https://blog.logrocket.com/useeffect-react-hook-complete-guide/ 
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      // get from the backend
      const currentUserID = userID!; // never undefined
      if (!currentUserID) return; // if no user id don't bother getting user
      const data: UserData = await getUser(currentUserID);
      // put the data on the page MAKE SURE DATA EXISTS, if no data then go to edit/add user
      if ((data.first_name || data.last_name)) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        setEmail(data.email);
        setAddress(data.address);
      }
      else {
        // no data or 200 failure, set to edit/make user mode
        setIsEditing(true);
      }
    } catch (error) {
      setError("Failed to get user user.")
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchUser();
    }, []);

  // EDIT USER
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);

    const payload: UserData = {first_name, last_name, phone, email, address}

    // LEFT OFF:
    //
    //
    //
    // MAKE THIS EDIT USER INSTEAD! SINCE IT WOULD NEVER POST A USER WHEN ON THE EDIT USER PAGE
    // SINCE UR EDITING A USER THAT ALREADY EXISTS
    //
    //
    //
    
    try {
      // send the to the backend
      await addUser(payload);
      setSuccess(true);
      setIsEditing(false); // no longer in edit/add mode, go back to viewing
      // return user to the GET User page
      fetchUser();
    } catch (error) {
      setError("Failed to upload user data.");
      setIsEditing(true); // failed, back to edit/add mode
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

      {!isEditing ? (
        // VIEW PROFILE
        <div style={{display: 'flex'}}>
          <h1>View Your Profile</h1>
          <div>
              <p>First Name: {first_name}</p>
          </div>
          <div>
              <p>Last Name: {last_name}</p>
          </div>
          <div>
            <p>Phone: {phone}</p>
        </div>
          <div>
              <p>Email: {email}</p>
          </div>
          <div>
              <p>Address: {address}</p>
          </div>
        <button type="submit" onClick={() => setIsEditing(true)}>
          Edit
          </button>
        </div>

    ) : (
        // EDIT PROFILE
        <form onSubmit={handleUpload}>
          <h1>Edit Your Profile</h1>
          <div>
              <input 
                type="text" 
                value={first_name} 
                onChange={handleFirstNameChange} 
                placeholder="Enter your first name" 
              />
              <p>First Name: {first_name}</p>
          </div>
          <div>
            <input 
              type="text" 
              value={last_name} 
              onChange={handleLastNameChange} 
              placeholder="Enter your last name" 
            />
            <p>Last Name: {last_name}</p>
          </div>
          <div>
              <input 
                type="text" 
                value={email} 
                onChange={handleEmailChange} 
                placeholder="Enter your email" 
              />
              <p>Email: {email}</p>
          </div>
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
            Submit</button>
        </form>
        )
      }
    </>
  );
}
export default UserPage;
