import { editUser } from './services/dispatcherAPI'
import { addUser } from './services/dispatcherAPI'
import {getUser} from './services/dispatcherAPI'
import { useState, useEffect } from 'react';
import { UserData } from './types/dispatcher'

function UserPage() {

  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // set the states
  const [error, setError] = useState<string | null>(null);
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
  useEffect(() => {
  // reference: https://blog.logrocket.com/useeffect-react-hook-complete-guide/ 
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        // get from the backend
        const data: UserData = await getUser(payload);
        // put the data on the page MAKE SURE DATA EXISTS, if no data then go to edit/add user
        if ((data.firstName || data.lastName) && data.status === 200) {
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setEmail(data.email);
          setPhone(data.email);
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
      };

      useEffect(() => {
        fetchUser();
      })
    }
  }, []);

  // ADD USER
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);

    const payload: UserData = {name, phone, email, address}

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
    <>
      {!isEditing ? (
        // VIEW PROFILE
        <div style={{display: 'flex'}}>
          <h1>View Your Profile</h1>
          <div>
              <input 
                type="text" 
                value={firstName} 
              />
              <p>First Name: {firstName}</p>
          </div>
          <div>
              <input 
                type="text" 
                value={lastName} 
              />
              <p>Last Name: {lastName}</p>
          </div>
          <div>
            <input 
              type="text" 
              value={phone} 
            />
            <p>Phone: {phone}</p>
        </div>
          <div>
              <input 
                type="text" 
                value={email} 
              />
              <p>Email: {email}</p>
          </div>
          <div>
              <input 
                type="text" 
                value={address} 
              />
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
                value={firstName} 
                onChange={handleFirstNameChange} 
                placeholder="Enter your first name" 
              />
              <p>First Name: {firstName}</p>
          </div>
          <div>
            <input 
              type="text" 
              value={lastName} 
              onChange={handleLastNameChange} 
              placeholder="Enter your last name" 
            />
            <p>Last Name: {lastName}</p>
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
        <button type="submit" onClick={() => setIsEditing(false)}>
            Submit</button>
        </form>
        )
      }
    </>
  );
};
export default UserPage;