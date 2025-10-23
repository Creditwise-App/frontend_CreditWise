// src/pages/admin/AdminAppointmentDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { useCreditTips } from '../../context/CreditTipsContext'; // ✅ Import CreditTips
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const AdminAppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAppointment, updateStatus } = useAppointments();
  const { setUserPlan } = useCreditTips(); // ✅ Access CreditTips context
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editedPlan, setEditedPlan] = useState("");
  const [appt, setAppt] = useState<any>(null); // We'll improve typing later
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (id) {
        try {
          const appointment = await getAppointment(id);
          setAppt(appointment);
          setStatus(appointment?.status);
        } catch (error) {
          console.error('Error fetching appointment:', error);
        }
      }
    };
    
    fetchAppointment();
  }, [id, getAppointment]);

  const changeStatus = (newStatus: string) => {
    if (id && appt) {
      updateStatus(id, newStatus as any);
      setStatus(newStatus);
    }
  };

  const generatePlan = () => {
    if (!appt) return;
    
    const plan = `Credit Improvement Plan for ${appt.userName ?? 'User'}:

1️⃣ Payment History:
   - Ensure all bills are paid before due dates.
   - Set up automatic reminders or autopay.

2️⃣ Credit Utilization:
   - Keep credit usage below 30% of your total limit.
   - Avoid maxing out credit cards.

3️⃣ Credit Mix & Accounts:
   - Maintain a mix of credit (cards, loans) responsibly.
   - Do not close old credit accounts suddenly.

4️⃣ Financial Discipline:
   - Create a monthly budget.
   - Avoid unnecessary credit applications.

📌 Tips based on your answers:
${JSON.stringify(appt.answers, null, 2)}

Stay consistent and monitor your credit score monthly.
`;

    setEditedPlan(plan);
    setShowPlanModal(true);
  };

  if (!appt) return <Card>Appointment not found</Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Appointment Details</h1>
        <Button onClick={() => navigate(-1)} variant="secondary">Back</Button>
      </div>

      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div><strong>Booked by:</strong> {appt.userName ?? 'Guest'}</div>
              <div><strong>Email:</strong> {appt.userId && typeof appt.userId === 'object' && appt.userId.email ? appt.userId.email : '—'}</div>
              <div><strong>Created:</strong> {new Date(appt.createdAt).toLocaleString()}</div>
              <div><strong>Preferred slot:</strong> {appt.preferredDate ? new Date(appt.preferredDate).toLocaleString() : 'None'}</div>
            </div>

            <div className="text-right">
              <div className="mb-2"><strong>Status:</strong></div>
              <div>{status}</div>
            </div>
          </div>

          <hr />

          <div>
            <h3 className="font-semibold mb-2">Questionnaire Answers</h3>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
              {JSON.stringify(appt.answers, null, 2)}
            </pre>
          </div>

          <hr />

          <div>
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="flex gap-2">
              <Button onClick={() => changeStatus('approved')}>Approve</Button>
              <Button onClick={() => changeStatus('completed')} className="bg-blue-600 text-white">
                Mark Completed
              </Button>
              <Button onClick={generatePlan} className="bg-green-600 text-white">
                Generate Plan
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Credit Improvement Plan</h2>

            <textarea
              className="w-full h-64 border rounded p-3 bg-gray-50 dark:bg-gray-800 text-sm"
              value={editedPlan}
              onChange={(e) => setEditedPlan(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => setShowPlanModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 text-white"
                onClick={() => {
                  // Check if userId exists and is a string
                  if (appt.userId && typeof appt.userId === 'string') {
                    setUserPlan(appt.userId, editedPlan);
                  } else if (appt.userId && typeof appt.userId === 'object' && appt.userId._id) {
                    // If userId is an object with _id property
                    setUserPlan(appt.userId._id, editedPlan);
                  }
                  setShowPlanModal(false);
                  alert("Credit Plan Saved & Sent to User!");
                }}
              >
                Save Plan
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentDetail;