// src/components/CreditImproveModal.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AVAILABLE_SLOTS = [
  
  '2025-10-18T10:00:00',
  '2025-10-18T16:00:00',
  '2025-10-19T11:00:00',
  '2025-10-21T14:00:00',
];

export const CreditImproveModal: React.FC<Props> = ({ open, onClose }) => {
  const { user } = useAuth();
  const { addAppointment } = useAppointments();

  
  const [step, setStep] = useState(1);

  
  const [income, setIncome] = useState<number | ''>('');
  const [hasLoans, setHasLoans] = useState<'yes'|'no'|'unknown'>('unknown');
  const [missedPayments, setMissedPayments] = useState<'yes'|'no'>('no');
  const [goal, setGoal] = useState('');

  
  const [debtsText, setDebtsText] = useState(''); 
  const [strategy, setStrategy] = useState<'snowball'|'avalanche'|'balanced'>('snowball');
  const [extraMonthly, setExtraMonthly] = useState<number | ''>('');

  
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    const answers = {
      income,
      hasLoans,
      missedPayments,
      goal,
      debtsText,
      strategy,
      extraMonthly,
    };

    addAppointment({
      userId: user?.id ?? null,
      userName: user?.name ?? null,
      preferredDate: selectedSlot ?? null,
      answers,
    });

    // success UX
    setStep(4);
    setTimeout(() => {
      onClose();
      // reset internal state for next time
      setStep(1);
      setIncome('');
      setHasLoans('unknown');
      setMissedPayments('no');
      setGoal('');
      setDebtsText('');
      setStrategy('snowball');
      setExtraMonthly('');
      setSelectedSlot(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card-dark w-full h-full overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Improve Your Credit Score</h2>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">Step {Math.min(step,3)} of 3</div>
                <Button onClick={onClose} variant="secondary">Close</Button>
              </div>
            </div>

            {step === 1 && (
              <>
                <h3 className="font-semibold mb-2">Your Credit Profile</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input id="income" label="Monthly Income (₦)" type="number" value={income} onChange={e => setIncome(Number(e.target.value))} />
                  <div>
                    <label className="block text-sm font-medium mb-1">Do you currently have any loans?</label>
                    <div className="flex gap-2">
                      <Button onClick={() => setHasLoans('yes')} className={hasLoans==='yes'? 'ring-2 ring-primary-green':''}>Yes</Button>
                      <Button onClick={() => setHasLoans('no')} className={hasLoans==='no'? 'ring-2 ring-primary-green':''}>No</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Missed payments before?</label>
                    <div className="flex gap-2">
                      <Button onClick={() => setMissedPayments('yes')} className={missedPayments==='yes'? 'ring-2 ring-primary-green':''}>Yes</Button>
                      <Button onClick={() => setMissedPayments('no')} className={missedPayments==='no'? 'ring-2 ring-primary-green':''}>No</Button>
                    </div>
                  </div>
                  <Input id="goal" label="Main goal (e.g., loan approval, mortgage)" type="text" value={goal} onChange={e => setGoal(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setStep(2)}>Next</Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="font-semibold mb-2">Debts & Strategy</h3>
                <p className="text-sm text-gray-500 mb-2">Quickly list your debts (one per line): <span className="text-xs text-gray-400">Name - ₦Amount - %Interest</span></p>
                <textarea value={debtsText} onChange={e => setDebtsText(e.target.value)} className="w-full p-3 border rounded mb-3 h-32" />
                <div className="mb-3">
                  <label className="block text-sm mb-1">Preferred strategy</label>
                  <div className="flex gap-2">
                    <Button onClick={() => setStrategy('snowball')} className={strategy==='snowball' ? 'ring-2 ring-primary-green' : ''}>Snowball</Button>
                    <Button onClick={() => setStrategy('avalanche')} className={strategy==='avalanche' ? 'ring-2 ring-primary-green' : ''}>Avalanche</Button>
                    <Button onClick={() => setStrategy('balanced')} className={strategy==='balanced' ? 'ring-2 ring-primary-green' : ''}>Balanced</Button>
                  </div>
                </div>
                <Input id="extra" label="Extra monthly you can pay toward debt (₦)" type="number" value={extraMonthly} onChange={e => setExtraMonthly(Number(e.target.value))} />
                <div className="flex justify-between gap-2 mt-4">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Next</Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-semibold mb-2">Book Consultation</h3>
                <p className="text-sm text-gray-500 mb-4">Select a preferred slot. Admin manages final approvals.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_SLOTS.map(slot => {
                    const nice = new Date(slot).toLocaleString();
                    return (
                      <div key={slot} className={`p-3 border rounded ${selectedSlot === slot ? 'border-primary-green bg-green-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div>{nice}</div>
                          <Button onClick={() => setSelectedSlot(slot)} className={selectedSlot===slot ? 'ring-2 ring-primary-green' : ''}>Select</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between gap-2 mt-4">
                  <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={handleSubmit} className="bg-primary-green text-white">Submit & Book</Button>
                </div>
              </>
            )}

            {step === 4 && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4">Booking submitted!</h3>
                <p className="mb-6">Your appointment request has been saved. Admin will review and contact you if needed.</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
