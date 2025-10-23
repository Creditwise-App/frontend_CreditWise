// src/context/AppointmentContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appointment, PopulatedAppointment } from '../../types';
import { appointmentsAPI } from '../services/api';
import { adminAPI } from '../services/api';

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  addAppointment: (a: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Promise<Appointment>;
  getAppointment: (id: string) => Promise<Appointment | undefined>;
  updateStatus: (id: string, status: Appointment['status']) => Promise<Appointment | undefined>;
  getPendingCount: () => number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (loading) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use admin API to fetch all appointments
      const data = await adminAPI.getAllAppointments();
      
      // Map the API response to match our Appointment type
      const mappedAppointments = data.map((appt: PopulatedAppointment) => ({
        id: appt._id,
        // Handle the nested userId object from the populated response
        userId: appt.userId ? (typeof appt.userId === 'object' ? appt.userId._id : appt.userId) : null,
        userName: appt.userName || (appt.userId && typeof appt.userId === 'object' ? appt.userId.name : null),
        createdAt: appt.createdAt,
        preferredDate: appt.preferredDate,
        answers: appt.answers,
        status: appt.status
      }));
      
      setAppointments(mappedAppointments);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]); // Add loading as dependency

  // Remove the initial fetch from useEffect
  // We'll let the component decide when to fetch
  
  const addAppointment = async (a: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    try {
      const data = await appointmentsAPI.createAppointment(a);
      
      const newAppointment: Appointment = {
        id: data._id,
        userId: data.userId,
        userName: data.userName,
        createdAt: data.createdAt,
        preferredDate: data.preferredDate,
        answers: data.answers,
        status: data.status
      };
      
      setAppointments(prev => [newAppointment, ...prev]);
      return newAppointment;
    } catch (err: any) {
      // More detailed error handling
      if (err.message) {
        setError(err.message);
      }
      throw new Error(err.message || 'Failed to create appointment');
    }
  };

  const getAppointment = async (id: string) => {
    try {
      const data = await appointmentsAPI.getAppointmentById(id);
      const appointment: any = {
        id: data._id,
        userId: data.userId,
        userName: data.userName || (data.userId && typeof data.userId === 'object' ? data.userId.name : null),
        createdAt: data.createdAt,
        preferredDate: data.preferredDate,
        answers: data.answers,
        status: data.status
      };
      return appointment;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch appointment');
    }
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const data = await appointmentsAPI.updateAppointmentStatus(id, status);
      const updatedAppointment: Appointment = {
        id: data._id,
        userId: data.userId,
        userName: data.userName,
        createdAt: data.createdAt,
        preferredDate: data.preferredDate,
        answers: data.answers,
        status: data.status
      };
      
      setAppointments(prev =>
        prev.map(appt => appt.id === id ? updatedAppointment : appt)
      );
      
      return updatedAppointment;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update appointment status');
    }
  };

  const getPendingCount = () => appointments.filter(a => a.status === 'pending').length;

  const value: AppointmentContextType = {
    appointments,
    loading,
    error,
    fetchAppointments,
    addAppointment,
    getAppointment,
    updateStatus,
    getPendingCount,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = (): AppointmentContextType => {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointments must be used inside AppointmentProvider');
  return ctx;
};