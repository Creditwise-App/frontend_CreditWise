// src/pages/admin/AdminAppointmentsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { Card } from '../../components/ui/Card';

const AdminAppointmentsPage: React.FC = () => {
  const { appointments } = useAppointments();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <div className="space-y-3">
        {appointments.length === 0 && <Card>No appointments yet.</Card>}
        {appointments.map(appt => (
          <Card key={appt.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{appt.userName ?? 'Guest'}</div>
                <div className="text-sm text-gray-500">{new Date(appt.createdAt).toLocaleString()}</div>
                <div className="text-sm mt-1">Preferred: {appt.preferredDate ? new Date(appt.preferredDate).toLocaleString() : 'No preference'}</div>
              </div>
              <div>
                <Link to={`/admin/appointments/${appt.id}`} className="px-3 py-1 bg-primary-blue text-white rounded">View</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
