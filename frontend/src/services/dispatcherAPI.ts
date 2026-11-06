import {UserData, ReservationData, AppointmentData, PatientDetails} from '../types/dispatcher'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
/////////////////////// PROFILE ROUTES ////////////////////////////

// add user
export const addUser = async (user: UserData): Promise<void> => {
  const response = await fetch('{API_BASE_URL}/user', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to save user' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// edit user
export const editUser = async (userID: string | number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(userID),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to edit user' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// get user
export const getUser = async (userID: string | number): Promise<UserData> => {
  const response = await fetch(`${API_BASE_URL}/user/${userID}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get user' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};

////////////////////// APPOINTMENT ROUTES //////////////////////////////

// add appointment
export const addAppointment = async (user: AppointmentData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to add an appointment' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// get appointment
export const getAppointment = async (appointmentID: string | number): Promise<AppointmentData> => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentID}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get appointment' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};

/////////////////////////// RESERVATION ROUTES ////////////////////////////

// add reservation
export const addReservation = async (user: ReservationData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to add a reservation' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// get reservation
export const getReservation = async (reservationID: string | number): Promise<ReservationData> => {
  const response = await fetch(`${API_BASE_URL}/appointments/${reservationID}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get reservation' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};
