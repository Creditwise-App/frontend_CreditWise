// src/pages/admin/AdminAppointmentDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const AdminAppointmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAppointment } = useAppointments();
  const appt = id ? getAppointment(id) : undefined;

  if (!appt) return <Card>Appointment not found</Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Appointment Details</h1>
        <Button onClick={() => navigate(-1)} variant="secondary">Back</Button>
      </div>

      <Card>
        <div className="space-y-3">
          <div><strong>Booked by:</strong> {appt.userName ?? 'Guest'}</div>
          <div><strong>Created:</strong> {new Date(appt.createdAt).toLocaleString()}</div>
          <div><strong>Preferred slot:</strong> {appt.preferredDate ? new Date(appt.preferredDate).toLocaleString() : 'None'}</div>

          <hr />

          <div>
            <h3 className="font-semibold mb-2">Questionnaire Answers</h3>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{JSON.stringify(appt.answers, null, 2)}</pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminAppointmentDetail;
