import {UserData, ReservationData, AppointmentData, PatientDetails} from '../types/dispatcher';

/////////////////////// PROFILE ROUTES ////////////////////////////
export const saveProfile = async (profile: UserData): Promise<void> => {
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

export const getProfile = async (profile: UserData): Promise<UserData> => {
  const response = await fetch('${API_BASE_URL}/profile/${userId}');

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get profile' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};

////////////////////// APPOINTMENT ROUTES //////////////////////////////
export const addAppointment = async (profile: AppointmentData): Promise<void> => {
  const response = await fetch('{API_BASE_URL}/appointments', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to add an appointment' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

export const getAppointment = async (profile: UserData): Promise<AppointmentData> => {
  const response = await fetch('${API_BASE_URL}/appointments/${appointmentID}');

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get appointment' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};

/////////////////////////// RESERVATION ROUTES ////////////////////////////
export const addReservation = async (profile: ReservationData): Promise<void> => {
  const response = await fetch('{API_BASE_URL}/reservations', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to add a reservation' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
};

export const getReservation = async (profile: UserData): Promise<ReservationData> => {
  const response = await fetch('${API_BASE_URL}/appointments/${reservationID}');

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get reservation' }));
    throw new Error(error.detail || `Error: ${response.statusText}`);
  }
  return response.json()
};
