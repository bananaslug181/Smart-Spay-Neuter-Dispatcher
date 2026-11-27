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
  user_id: number;
  appointment_id: string | null;
  patient_details: PatientDetails;
  status?: string;
}

export interface PatientDetails {
    name: string | null;
    gender: string | null;
    age: number | null;
    underweight: boolean | null;
    ear_tipped: boolean | null;
    long_distance_travel: number | null;
    distance_from_clinic: number | null;
}