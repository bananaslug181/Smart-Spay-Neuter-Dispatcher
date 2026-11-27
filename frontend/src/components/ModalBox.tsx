// components/ModalBox.tsx
// credit: https://dev.to/theedgebreaker/creating-a-simple-modal-component-in-react-with-typescript-for-beginners-42ac
import React from "react";
import { useState, useEffect } from 'react'

import CalendarPage from "../CalendarPage";
// @ts-expect-error
import '../index.css'


interface ModalProps {
  onClose: () => void;
}

export default function ModalBox({ onClose }: ModalProps) {

    const [appointmentId, setAppointmentId] = useState<string>('');
    const [patientName, setPatientName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [age, setAge] = useState<number>();
    const [underweightStatus, setUnderweightStatus] = useState<string>('');
    const [earTipStatus, setEarTipStatus] = useState<string>('');
    const [longDistanceTravel, setLongDistanceTravel] = useState<string>('');
    const [distanceFromClinic, setDistanceFromClinic] = useState<string>('');

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
            </div>
      </div>
    </div>
  );
};
