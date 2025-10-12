// src/context/AppointmentContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appointment } from '../../types';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  getAppointment: (id: string) => Appointment | undefined;
  clearAll?: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const STORAGE_KEY = 'creditwise_appointments_v1';

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as Appointment[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (a: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...a,
    };
    setAppointments(prev => [newAppt, ...prev]);
    return newAppt;
  };

  const getAppointment = (id: string) => appointments.find(x => x.id === id);

  const value: AppointmentContextType = { appointments, addAppointment, getAppointment };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = (): AppointmentContextType => {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointments must be used inside AppointmentProvider');
  return ctx;
};
