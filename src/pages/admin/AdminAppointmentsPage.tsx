// src/pages/admin/AdminAppointmentsPage.tsx
import React, { useEffect, useState } from 'react';
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
  const { appointments, loading, error, fetchAppointments } = useAppointments();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch once when the component mounts
    if (!hasFetched) {
      fetchAppointments();
      setHasFetched(true);
    }
  }, [hasFetched, fetchAppointments]);

  const handleRetry = () => {
    setHasFetched(false); // Reset the flag to allow refetching
  };

  if (loading && !hasFetched) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 text-lg mb-2">Error loading appointments</p>
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button 
          onClick={fetchAppointments}
          className="px-4 py-2 bg-primary-blue text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <Card>No appointments yet.</Card>
        ) : (
          <>
            <p className="text-gray-600">Showing {appointments.length} appointments</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;