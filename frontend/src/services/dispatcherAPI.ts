import {ProfileData, ReservationData, AppointmentData, PatientDetails} from '../types/dispatcher';

/////////////////////// PROFILE ROUTES ////////////////////////////

// add profile
export const addProfile = async (profile: ProfileData): Promise<void> => {
  const response = await fetch('{API_BASE_URL}/profile', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to save profile' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// edit profile
export const editProfile = async (userID: string | number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to edit profile' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// get profile
export const getProfile = async (userID: string | number): Promise<ProfileData> => {
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get profile' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};

////////////////////// APPOINTMENT ROUTES //////////////////////////////

// add appointment
export const addAppointment = async (profile: AppointmentData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to add an appointment' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// get appointment
export const getAppointment = async (profile: AppointmentData): Promise<AppointmentData> => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentID}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get appointment' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};

/////////////////////////// RESERVATION ROUTES ////////////////////////////

// add reservation
export const addReservation = async (profile: ReservationData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to add a reservation' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

// get reservation
export const getReservation = async (profile: ReservationData): Promise<ReservationData> => {
  const response = await fetch(`${API_BASE_URL}/appointments/${reservationID}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get reservation' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};
