// src/pages/admin/AdminAppointmentsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { Card } from '../../components/ui/Card';

const statusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>;
    case 'approved':
      return <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">Approved</span>;
    case 'rejected':
      return <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800">Rejected</span>;
    case 'completed':
      return <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800">Completed</span>;
    default:
      return <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">{status}</span>;
  }
};

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

              <div className="flex items-center gap-3">
                <div>{statusBadge(appt.status)}</div>
                <Link to={`/admin/appointments/${appt.id}`} className="px-3 py-1 bg-primary-blue text-white rounded">
                  View
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
