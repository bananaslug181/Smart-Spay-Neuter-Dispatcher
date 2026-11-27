export interface AppointmentData {
  id?: string;
  clinic_id: string;
  date: string;
  time: string;
  total_slots: number;
  slots_available: number;
}


export interface UserSession {
  login: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  user_id?: string;
  role?: string;
}

export interface UserData {
  login: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  user_id?: string;
  role?: string;
}


export interface ReservationData {
  id?: number;
  user_id: string;
  appointment_id: string;
  patient_details: PatientDetails;
  status?: string;
}

export interface PatientDetails {
    name: string;
    gender: string;
    age: number;
    underweight: string; // todo CHANGE THESE TO BOOLEANS LATER
    ear_tipped: string;
    long_distance_travel: string;
    distance_from_clinic: number;
}