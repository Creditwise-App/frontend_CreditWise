import React, { useEffect, useCallback, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useCreditTips } from '../../context/CreditTipsContext';
import { Card } from '../../components/ui/Card';

// In a real application, this would come from an API
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
    console.log('User data in dashboard:', user);
    const { tips, loading: tipsLoading, error: tipsError, fetchTips } = useCreditTips();
    const [hasFetched, setHasFetched] = useState(false);
    
    // Use useCallback to prevent unnecessary re-renders
    const fetchTipsOnce = useCallback(async () => {
        if (!hasFetched) {
            await fetchTips();
            setHasFetched(true);
        }
    }, [fetchTips, hasFetched]);
    
    useEffect(() => {
        fetchTipsOnce();
    }, [fetchTipsOnce]);
    
    // Function to manually refresh tips
    const handleRefreshTips = useCallback(() => {
        setHasFetched(false); // Reset the flag to allow refetching
    }, []);
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-blue to-blue-400 text-white">
                    <span className="text-lg font-medium">Current Credit Score</span>
                    <span className="text-5xl font-bold">
                      {user?.currentCreditScore !== undefined && user?.currentCreditScore !== null 
                        ? user.currentCreditScore 
                        : '—'}
                    </span>
                    <span className="text-sm opacity-80">Updated today</span>
                </Card>
                 <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-green to-green-400 text-white">
                    <span className="text-lg font-medium">Target Credit Score</span>
                    <span className="text-5xl font-bold">
                      {user?.targetCreditScore !== undefined && user?.targetCreditScore !== null 
                        ? user.targetCreditScore 
                        : '—'}
                    </span>
                    <span className="text-sm opacity-80">Goal in 8 months</span>
                </Card>
                 <Card className="flex flex-col items-center justify-center">
                    <span className="text-lg font-medium">Next Payment Due</span>
                    <span className="text-3xl font-bold text-red-500">
                      ₦{user?.extraMonthlyPayment !== undefined && user?.extraMonthlyPayment !== null 
                        ? user.extraMonthlyPayment.toLocaleString() 
                        : '0'}
                    </span>
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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Improvement Tips</h2>
                        <button 
                            onClick={handleRefreshTips}
                            className="text-sm text-blue-500 hover:text-blue-700"
                            disabled={tipsLoading}
                        >
                            {tipsLoading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                    {tipsLoading && !hasFetched ? (
                        <p>Loading tips...</p>
                    ) : tipsError ? (
                        <div>
                            <p className="text-red-500">Error loading tips: {tipsError}</p>
                            <button 
                                onClick={handleRefreshTips}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-3 list-disc list-inside">
                            {tips.map((tip, index) => (
                                <li key={tip.id}>{tip.description}</li>
                            ))}
                        </ul>
                    )}
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