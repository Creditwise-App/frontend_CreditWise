// src/context/AppointmentContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appointment } from '../../types';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  getAppointment: (id: string) => Appointment | undefined;
  updateStatus: (id: string, status: Appointment['status']) => Appointment | undefined;
  getPendingCount: () => number;
  clearAll?: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const STORAGE_KEY = 'creditwise_appointments_v1';

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Appointment[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to persist appointments', e);
    }
  }, [appointments]);

  const addAppointment = (a: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...a,
    };
    setAppointments(prev => [newAppt, ...prev]);
    return newAppt;
  };

  const getAppointment = (id: string) => appointments.find(x => x.id === id);

  const updateStatus = (id: string, status: Appointment['status']) => {
    let updated: Appointment | undefined;
    setAppointments(prev =>
      prev.map(appt => {
        if (appt.id === id) {
          updated = { ...appt, status };
          return updated;
        }
        return appt;
      })
    );
    // Return updated after setState queued (we return the object we created)
    return updated;
  };

  const getPendingCount = () => appointments.filter(a => a.status === 'pending').length;

  const clearAll = () => {
    setAppointments([]);
  };

  const value: AppointmentContextType = {
    appointments,
    addAppointment,
    getAppointment,
    updateStatus,
    getPendingCount,
    clearAll,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = (): AppointmentContextType => {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointments must be used inside AppointmentProvider');
  return ctx;
};
