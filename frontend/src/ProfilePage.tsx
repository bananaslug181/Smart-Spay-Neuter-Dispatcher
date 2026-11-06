import { editProfile } from './services/dispatcherAPI'
import { addProfile } from './services/dispatcherAPI'
import { useState } from 'react';
import { ProfileData } from './types/dispatcher'

// credit: https://www.geeksforgeeks.org/typescript/how-to-get-value-of-input-in-typescript/

function ProfilePage() {

  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNameChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setName(e.target.value);
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
    
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);

    const payload: ProfileData = {name, phone, email, address}

    try {
      // send the to the backend
      await addProfile(payload);
      setSuccess(true);
    } catch (err) {
      setError("Failed to upload profile data.");
    }
  };
  
  return (
    <>
    <form onSubmit={handleUpload}>
      <div>
          <input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            placeholder="Enter your name" 
          />
          <p>Name: {name}</p>
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
          <p>Name: {address}</p>
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
    <button type="submit">Save Profile</button>
    </form>
  </>
  );
};
export default ProfilePage;
