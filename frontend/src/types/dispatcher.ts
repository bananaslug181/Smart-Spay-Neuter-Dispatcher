export interface AppointmentData {
  id?: number;
  clinic_id: number;
  date: string;
}

export interface UserData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
}

export interface ReservationData {
  id?: number;
  user_id: number;
  clinic_id: string;
  appointment_id: string;
  patient_details: PatientDetails;
  date: string;
  time: string;
  status?: string;
}

export interface PatientDetails {
    name: string;
    gender: string;
    months_old: number;
    underweight: boolean;
    ear_tipped: boolean;
    long_distance_travel: number;
    distance_from_clinic: number;
}