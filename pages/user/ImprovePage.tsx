
import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Debt, RepaymentStep, RepaymentStrategy } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RepaymentPlan: React.FC<{ plan: RepaymentStep[], totalMonths: number }> = ({ plan, totalMonths }) => {
    
    const chartData = useMemo(() => {
        const data = [];
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
            <p>It will take you <span className="font-bold text-primary-green">{totalMonths} months</span> to become debt-free.</p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Total Debt (₦)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="totalDebt" stroke="#1db954" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
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

    const handleAddDebt = () => {
        setDebts([...debts, { id: Date.now().toString(), name: '', amount: 0, interestRate: 0 }]);
    };

    const handleDebtChange = (index: number, field: keyof Debt, value: string | number) => {
        const newDebts = [...debts];
        // Fix: Use type-safe conditions to assign values, preventing a 'never' type error.
        if (field === 'name') {
            newDebts[index][field] = value as string;
        } else if (field === 'amount' || field === 'interestRate') {
            newDebts[index][field] = Number(value);
        }
        setDebts(newDebts);
    };

    const generatePlan = () => {
        const extraPayment = income * 0.2; // Assuming 20% of income goes to extra debt repayment
        let remainingDebts = JSON.parse(JSON.stringify(debts)) as Debt[];
        
        if (strategy === RepaymentStrategy.SNOWBALL) {
            remainingDebts.sort((a, b) => a.amount - b.amount);
        } else { // AVALANCHE
            remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
        }

        const newPlan: RepaymentStep[] = [];
        let month = 0;
        
        while (remainingDebts.some(d => d.amount > 0)) {
            month++;
            let monthExtraPayment = extraPayment;

            for (const debt of remainingDebts) {
                if(debt.amount <= 0) continue;
                // Minimum payment is interest + small principal
                const interest = (debt.amount * (debt.interestRate / 100)) / 12;
                let payment = interest + (debt.amount * 0.01); // 1% principal
                
                if (debt.id === remainingDebts.find(d => d.amount > 0)?.id) {
                    payment += monthExtraPayment;
                }
                
                payment = Math.min(payment, debt.amount + interest);
                debt.amount -= (payment - interest);

                newPlan.push({ month, debtName: debt.name, payment, remainingBalance: debt.amount < 0 ? 0 : debt.amount });
            }
             if (month > 120) break; // Safety break
        }
        setPlan(newPlan);
        setTotalMonths(month);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Create Your Improvement Plan</h1>
            <Card>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Input id="income" label="Monthly Income (₦)" type="number" value={income} onChange={e => setIncome(Number(e.target.value))} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Debts</h3>
                        {debts.map((debt, index) => (
                            <div key={debt.id} className="grid grid-cols-3 gap-2 mb-2 p-2 border rounded">
                                <Input id={`debt-name-${index}`} label="Name" type="text" value={debt.name} onChange={e => handleDebtChange(index, 'name', e.target.value)} />
                                <Input id={`debt-amount-${index}`} label="Amount (₦)" type="number" value={debt.amount} onChange={e => handleDebtChange(index, 'amount', e.target.value)} />
                                <Input id={`debt-rate-${index}`} label="Interest (%)" type="number" value={debt.interestRate} onChange={e => handleDebtChange(index, 'interestRate', e.target.value)} />
                            </div>
                        ))}
                        <Button onClick={handleAddDebt} variant="secondary">Add Debt</Button>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Choose Strategy</h3>
                         <div className="flex gap-4">
                            <Button onClick={() => setStrategy(RepaymentStrategy.SNOWBALL)} className={strategy === RepaymentStrategy.SNOWBALL ? 'ring-2 ring-offset-2 ring-primary-green' : ''}>
                                🧮 Snowball
                            </Button>
                             <Button onClick={() => setStrategy(RepaymentStrategy.AVALANCHE)} className={strategy === RepaymentStrategy.AVALANCHE ? 'ring-2 ring-offset-2 ring-primary-blue' : ''}>
                                ⚡ Avalanche
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-end">
                         <Button onClick={generatePlan} className="w-full">Generate Plan</Button>
                    </div>
                </div>
            </Card>

            {plan && <RepaymentPlan plan={plan} totalMonths={totalMonths}/>}
        </div>
    );
};

export default ImprovePage;
