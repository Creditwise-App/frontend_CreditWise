// src/pages/user/ImprovePage.tsx
import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Debt, RepaymentStep, RepaymentStrategy } from '../../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import { useCreditTips } from '../../context/CreditTipsContext';

const RepaymentPlan: React.FC<{ plan: RepaymentStep[]; totalMonths: number }> = ({ plan, totalMonths }) => {
  const chartData = useMemo(() => {
    const data: { month: number; totalDebt: number }[] = [];
    for (let i = 0; i <= totalMonths; i++) {
      const monthPlan = plan.filter(p => p.month === i);
      const totalBalance = monthPlan.reduce((acc, curr) => acc + curr.remainingBalance, 0);
      data.push({ month: i, totalDebt: totalBalance });
    }
    return data;
  }, [plan, totalMonths]);

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Your Repayment Plan</h2>
      <p>
        It will take you <span className="font-bold text-primary-green">{totalMonths} months</span> to become debt-free.
      </p>
      <div className="mt-4" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Total Debt (₦)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="totalDebt" stroke="#1db954" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

function generateSampleSlots() {
  const slots: string[] = [];
  const now = new Date();
  for (let i = 2; i <= 9; i++) {
    const d1 = new Date(now);
    d1.setDate(now.getDate() + i);
    d1.setHours(10, 0, 0, 0);
    slots.push(d1.toISOString());

    const d2 = new Date(now);
    d2.setDate(now.getDate() + i);
    d2.setHours(16, 0, 0, 0);
    slots.push(d2.toISOString());
  }
  return slots;
}

const ImprovePage: React.FC = () => {
  const [income, setIncome] = useState<number>(150000);
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card', amount: 50000, interestRate: 24 },
    { id: '2', name: 'Personal Loan', amount: 200000, interestRate: 18 },
  ]);
  const [strategy, setStrategy] = useState<RepaymentStrategy>(RepaymentStrategy.SNOWBALL);
  const [plan, setPlan] = useState<RepaymentStep[] | null>(null);
  const [totalMonths, setTotalMonths] = useState(0);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [wIncome, setWIncome] = useState<number | ''>('');
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | ''>('');
  const [wHasLoans, setWHasLoans] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [wMissedPayments, setWMissedPayments] = useState<'yes' | 'no'>('no');
  const [debtsText, setDebtsText] = useState('');
  const [wGoal, setWGoal] = useState('');
  const [wExtraMonthly, setWExtraMonthly] = useState<number | ''>('');
  const [wWantAppointment, setWWantAppointment] = useState<'yes' | 'no'>('no');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { getUserPlan } = useCreditTips();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const { appointments, addAppointment } = useAppointments();

  const sampleSlots = useMemo(() => generateSampleSlots(), []);

  const generatePlan = () => {
    const extraPayment = income * 0.2;
    let remainingDebts = JSON.parse(JSON.stringify(debts)) as Debt[];

    if (strategy === RepaymentStrategy.SNOWBALL) {
      remainingDebts.sort((a, b) => a.amount - b.amount);
    } else {
      remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
    }

    const newPlan: RepaymentStep[] = [];
    let month = 0;

    while (remainingDebts.some(d => d.amount > 0)) {
      month++;
      const monthExtraPayment = extraPayment;
      for (const debt of remainingDebts) {
        if (debt.amount <= 0) continue;
        const interest = (debt.amount * (debt.interestRate / 100)) / 12;
        let payment = interest + debt.amount * 0.01;
        if (debt.id === remainingDebts.find(d => d.amount > 0)?.id) {
          payment += monthExtraPayment;
        }
        payment = Math.min(payment, debt.amount + interest);
        debt.amount -= payment - interest;
        newPlan.push({
          month,
          debtName: debt.name,
          payment,
          remainingBalance: Math.max(debt.amount, 0),
        });
      }
      if (month > 240) break;
    }

    setPlan(newPlan);
    setTotalMonths(month);
  };

  const addDebt = () => setDebts([...debts, { id: Date.now().toString(), name: '', amount: 0, interestRate: 0 }]);
  const changeDebt = (index: number, field: keyof Debt, value: string | number) => {
    const copy = [...debts];
    if (field === 'name') copy[index][field] = value as string;
    else copy[index][field] = Number(value);
    setDebts(copy);
  };

  const userHasAppointment = Boolean(user && appointments.some(a => a.userId === user.id));

  const openWizard = () => {
    setWizardOpen(true);
    setStep(1);
    setSubmitMessage(null);
  };
  const closeWizard = () => {
    setWizardOpen(false);
    setStep(1);
    setSelectedSlot(null);
  };

  const parseDebtsTextToDebts = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: Debt[] = lines.map((line, idx) => {
      const parts = line.split(/[-,|]/).map(p => p.trim());
      const name = parts[0] ?? `Debt ${idx + 1}`;
      const amount = Number((parts[1] ?? '0').replace(/[^0-9.-]/g, '')) || 0;
      const rate = Number((parts[2] ?? '0').replace(/[^0-9.-]/g, '')) || 0;
      return { id: `parsed-${idx}-${Date.now()}`, name, amount, interestRate: rate };
    });
    return parsed;
  };

  const submitWizard = () => {
    if (wWantAppointment === 'yes') {
      if (!selectedSlot) {
        setSubmitMessage('Please select a slot for the appointment.');
        return;
      }
      if (userHasAppointment) {
        setSubmitMessage('You already have a booked appointment. Only one appointment per user is allowed.');
        return;
      }
    }

    const answers = {
      monthlyIncome: wIncome,
      monthlyExpenses,
      hasLoans: wHasLoans,
      missedPayments: wMissedPayments,
      debtsText,
      parsedDebts: debtsText ? parseDebtsTextToDebts(debtsText) : undefined,
      goal: wGoal,
      extraMonthly: wExtraMonthly,
      wantsAppointment: wWantAppointment,
    };

    const preferredDate = wWantAppointment === 'yes' ? selectedSlot : null;

    addAppointment({
      userId: user?.id ?? null,
      userName: user?.name ?? null,
      preferredDate,
      answers,
    });

    if (wIncome !== '') setIncome(Number(wIncome));
    if (debtsText.trim()) {
      const parsed = parseDebtsTextToDebts(debtsText);
      if (parsed.length) setDebts(parsed);
    }

    setSubmitMessage('Your answers have been saved. Admin will review them in the Appointments panel.');

    setTimeout(() => {
      closeWizard();
    }, 1200);
  };

  const userPlan = user ? getUserPlan(user.id) : undefined;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Create Your Improvement Plan</h1>

      <div className="flex items-center gap-4">
        <Button onClick={openWizard} className="bg-primary-green text-white px-6 py-3 rounded-lg">
          Improve My Credit Score
        </Button>

        {userHasAppointment && (
          <div className="text-sm text-yellow-700">You already have an appointment — admin will contact you.</div>
        )}
      </div>

      {submitMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800">
          {submitMessage}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Your Personalized Credit Plan</h2>

        {!user ? (
          <Card><div>Please log in to view your credit plan.</div></Card>
        ) : userPlan ? (
          <Card>
            <p className="text-sm whitespace-pre-wrap text-gray-700">
              {userPlan}
            </p>
          </Card>
        ) : (
          <Card>
            <div>No credit plan assigned yet. Please wait for admin to provide one.</div>
          </Card>
        )}
      </div>

      {plan && <RepaymentPlan plan={plan} totalMonths={totalMonths} />}

      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-auto">
          <div className="w-full h-full bg-white dark:bg-card-dark p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Credit Improvement Questionnaire</h2>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">Step {Math.min(step, 4)} of 4</div>
                    <Button onClick={closeWizard} variant="secondary">Close</Button>
                  </div>
                </div>

                {step === 1 && (
                  <>
                    <h3 className="font-semibold mb-2">Income & Monthly Expenses</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input id="w-income" label="Monthly Income (₦)" type="number" value={wIncome} onChange={e => setWIncome(e.target.value === '' ? '' : Number(e.target.value))} />
                      <Input id="w-expenses" label="Monthly Expenses (₦)" type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(e.target.value === '' ? '' : Number(e.target.value))} />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button onClick={() => setStep(2)}>Next</Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="font-semibold mb-2">Debts & Credit Behaviour</h3>
                    <p className="text-sm text-gray-500 mb-2">List your debts quickly (one per line): <span className="text-xs text-gray-400">Name - ₦Amount - %Interest</span></p>
                    <textarea value={debtsText} onChange={e => setDebtsText(e.target.value)} className="w-full p-3 border rounded h-40 mb-3" />
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm mb-1">Have you missed payments before?</label>
                        <div className="flex gap-2">
                          <Button onClick={() => setWMissedPayments('no')} className={wMissedPayments === 'no' ? 'ring-2 ring-primary-green' : ''}>No</Button>
                          <Button onClick={() => setWMissedPayments('yes')} className={wMissedPayments === 'yes' ? 'ring-2 ring-primary-green' : ''}>Yes</Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Do you currently have loans?</label>
                        <div className="flex gap-2">
                          <Button onClick={() => setWHasLoans('yes')} className={wHasLoans === 'yes' ? 'ring-2 ring-primary-green' : ''}>Yes</Button>
                          <Button onClick={() => setWHasLoans('no')} className={wHasLoans === 'no' ? 'ring-2 ring-primary-green' : ''}>No</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 mt-4">
                      <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={() => setStep(3)}>Next</Button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="font-semibold mb-2">Habits & Goals</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input id="w-goal" label="What is your credit goal? (e.g., loan approval, mortgage)" value={wGoal} onChange={e => setWGoal(e.target.value)} />
                      <Input id="w-extra" label="Extra monthly you can pay toward debt (₦)" type="number" value={wExtraMonthly} onChange={e => setWExtraMonthly(e.target.value === '' ? '' : Number(e.target.value))} />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm mb-1">Would you like a 1:1 consultation with our credit advisor?</label>
                      <div className="flex gap-2">
                        <Button onClick={() => setWWantAppointment('no')} className={wWantAppointment === 'no' ? 'ring-2 ring-primary-green' : ''}>No</Button>
                        <Button onClick={() => setWWantAppointment('yes')} className={wWantAppointment === 'yes' ? 'ring-2 ring-primary-green' : ''}>Yes</Button>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 mt-4">
                      <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                      <Button onClick={() => setStep(4)}>Next</Button>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h3 className="font-semibold mb-2">Review & Appointment</h3>

                    {wWantAppointment === 'yes' ? (
                      <>
                        <p className="text-sm text-gray-500 mb-3">Select a preferred slot (admin will see and decide):</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sampleSlots.map(s => {
                            const nice = new Date(s).toLocaleString();
                            const active = selectedSlot === s;
                            return (
                              <div key={s} className={`p-3 border rounded ${active ? 'border-primary-green bg-green-50' : ''}`}>
                                <div className="flex items-center justify-between">
                                  <div>{nice}</div>
                                  <Button onClick={() => setSelectedSlot(s)} className={active ? 'ring-2 ring-primary-green' : ''}>Select</Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 mb-3">You chose not to book a consultation. Admin will still receive your questionnaire answers.</p>
                    )}

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Quick review</h4>
                      <div className="text-sm text-gray-700 mb-2">
                        <div><strong>Income:</strong> {wIncome || '—'}</div>
                        <div><strong>Expenses:</strong> {monthlyExpenses || '—'}</div>
                        <div><strong>Debts (raw):</strong> {debtsText ? <span className="break-words">{debtsText}</span> : '—'}</div>
                        <div><strong>Goal:</strong> {wGoal || '—'}</div>
                        <div><strong>Wants appointment:</strong> {wWantAppointment === 'yes' ? 'Yes' : 'No'}</div>
                        {wWantAppointment === 'yes' && <div><strong>Selected slot:</strong> {selectedSlot ? new Date(selectedSlot).toLocaleString() : 'None'}</div>}
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 mt-4">
                      <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                      <Button onClick={submitWizard}>Submit</Button>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovePage;
