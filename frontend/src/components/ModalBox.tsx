// components/ModalBox.tsx
// credit: https://dev.to/theedgebreaker/creating-a-simple-modal-component-in-react-with-typescript-for-beginners-42ac
import React from "react";
import { useState, useEffect } from 'react'
import { AppointmentData, ReservationData } from '../types/dispatcher'
import CalendarPage from "../CalendarPage";
// @ts-expect-error
import '../index.css'
import { addReservation } from "../services/dispatcherAPI";
import { UserSession, UserData } from '../types/dispatcher'


interface ModalProps {
  onClose: () => void;
  userID: string;
  selectedAppointmentId: string;
}

    export default function ModalBox({ onClose, userID, selectedAppointmentId }: ModalProps) {

    const [appointmentId, setAppointmentId] = useState<string>('');
    const [patientName, setPatientName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [age, setAge] = useState<number>();
    const [underweightStatus, setUnderweightStatus] = useState<string>('');
    const [earTipStatus, setEarTipStatus] = useState<string>('');
    const [longDistanceTravel, setLongDistanceTravel] = useState<string>('');
    const [distanceFromClinic, setDistanceFromClinic] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // HANDLE RESERVATION CHANGES
    const handleAppointmentIdChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setAppointmentId(e.target.value);
      };
    const handlePatientNameChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setPatientName(e.target.value);
      };
    const handleGenderChange = 
      (e: React.ChangeEvent<HTMLInputElement>) => {
          setGender(e.target.value);
      };
    const handleAgeChange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setAge(Number(e.target.value));
    };
    const handleUnderweightStatuschange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnderweightStatus(e.target.value);
    };
    const handleEarTipStatusChange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setEarTipStatus(e.target.value);
    };
    const handlelongDistanceTravelChange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setLongDistanceTravel(e.target.value);
    };
    const handleDistanceFromClinicChange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setDistanceFromClinic(e.target.value);
    };

    // ADD RESERVATION
    const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reloading
    setError(null);
    setSuccess(false);
    
    console.log("CURRENTUSER INSIDE MODAL BOX: ", userID);
    console.log("EVENTID INSIDE MODAL BOX: ", selectedAppointmentId);

    const payload: ReservationData = {
        user_id: userID, // the clinic id is just the user_id, cuz only clinics are allowed to allocate appointments 
        appointment_id: selectedAppointmentId,
        patient_details: {
            'name': patientName,
            'gender': gender,
            'age': age ?? 0,
            'underweight': underweightStatus,
            'ear_tipped': earTipStatus,
            'long_distance_travel': longDistanceTravel,
            'distance_from_clinic': Number(distanceFromClinic)
        },
        status: ''
        }

        try {
            // send the to the backend
            const newReservationData = await addReservation(payload);
            // TODO: append the new data?? to what? i forget - future me
        } catch (error) {
            setError("Failed to create new reservation.");
        }
    };


  return (
    <div className="modal">
        <div className="modal-content">
            <nav className="modal-content">
            <span className="text-lg">Modal</span>
            <button
                className="close"
                onClick={onClose}
            >
                &#10005;
            </button>
            </nav>
            <div className="modal-content">
                <form onSubmit={handleUpload}>

                <h1>Reserve an Appointment Slot</h1>
                    <div>
                        <input 
                        type="text" 
                        value={patientName} 
                        onChange={handlePatientNameChange} 
                        placeholder="Enter the cat's name" 
                        />
                    </div>
                    <div>
                        <input 
                        type="text" 
                        value={gender} 
                        onChange={handleGenderChange} 
                        placeholder="Enter the cat's gender" 
                        />
                    </div>
                    <div>
                        <input 
                        type="text" 
                        value={age} 
                        onChange={handleAgeChange} 
                        placeholder="How old is the cat? Use months/12 format if kitten." 
                        />
                    </div>
                    <div>
                        <input 
                        type="text" 
                        value={underweightStatus} 
                        onChange={handleUnderweightStatuschange} 
                        placeholder="Is the cat underweight? Type yes or no" 
                        />
                    </div>
                    <div>
                        <input 
                        type="text" 
                        value={earTipStatus} 
                        onChange={handleEarTipStatusChange} 
                        placeholder="Is the cat's ear tipped? Type yes or no" 
                        />
                    </div>
                    <div>
                        <input 
                        type="text" 
                        value={longDistanceTravel} 
                        onChange={handlelongDistanceTravelChange} 
                        placeholder="Do you live further than 3 hours away from the clinic? Type yes or no" 
                        />
                    </div>
                    <div>
                        <input 
                        type="text" 
                        value={distanceFromClinic} 
                        onChange={handleDistanceFromClinicChange} 
                        placeholder="How far will the cat be stored from the clinic?" 
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    </div>
  );
};
