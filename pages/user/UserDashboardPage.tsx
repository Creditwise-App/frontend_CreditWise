
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';

const progressData = [
  { name: 'Jan', score: 550 },
  { name: 'Feb', score: 580 },
  { name: 'Mar', score: 610 },
  { name: 'Apr', score: 600 },
  { name: 'May', score: 630 },
  { name: 'Jun', score: 650 },
];

const Badge: React.FC<{ icon: string; title: string; earned: boolean }> = ({ icon, title, earned }) => (
    <div className={`text-center p-4 rounded-lg ${earned ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700 opacity-50'}`}>
        <span className="text-4xl">{icon}</span>
        <p className="font-semibold mt-2">{title}</p>
    </div>
);


const UserDashboardPage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-blue to-blue-400 text-white">
                    <span className="text-lg font-medium">Current Credit Score</span>
                    <span className="text-5xl font-bold">650</span>
                    <span className="text-sm opacity-80">Updated today</span>
                </Card>
                 <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-green to-green-400 text-white">
                    <span className="text-lg font-medium">Target Credit Score</span>
                    <span className="text-5xl font-bold">750</span>
                    <span className="text-sm opacity-80">Goal in 8 months</span>
                </Card>
                 <Card className="flex flex-col items-center justify-center">
                    <span className="text-lg font-medium">Next Payment Due</span>
                    <span className="text-3xl font-bold text-red-500">₦15,000</span>
                    <span className="text-sm">in 5 days</span>
                </Card>
            </div>
            
            <Card>
                <h2 className="text-2xl font-bold mb-4">Credit Score Progress</h2>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[500, 850]} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}/>
                        <Legend />
                        <Bar dataKey="score" fill="#1db954" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Improvement Tips</h2>
                    <ul className="space-y-3 list-disc list-inside">
                        <li>Pay your bills on time, every time.</li>
                        <li>Keep your credit utilization below 30%.</li>
                        <li>Don't close old credit accounts.</li>
                        <li>Regularly check your credit report for errors.</li>
                    </ul>
                </Card>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <Badge icon="🌱" title="Credit Starter" earned={true} />
                        <Badge icon="🔥" title="Debt Crusher" earned={true} />
                        <Badge icon="🏆" title="700 Club" earned={false} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UserDashboardPage;
