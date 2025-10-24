
import React from 'react';
import { Card } from '../../components/ui/Card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const lessonEngagementData = [
  { name: 'Lesson 1', views: 1200, completions: 950 },
  { name: 'Lesson 2', views: 1100, completions: 900 },
  { name: 'Lesson 3', views: 900, completions: 650 },
  { name: 'Lesson 4', views: 750, completions: 400 },
];

const scoreImprovementData = [
    { month: 'Jan', avgImprovement: 5 },
    { month: 'Feb', avgImprovement: 8 },
    { month: 'Mar', avgImprovement: 12 },
    { month: 'Apr', avgImprovement: 10 },
    { month: 'May', avgImprovement: 15 },
    { month: 'Jun', avgImprovement: 18 },
];

const AnalyticsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">User Analytics</h1>
            <Card>
                <h2 className="text-2xl font-bold mb-4">Lesson Engagement</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={lessonEngagementData}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" barSize={20} fill="#007bff" />
                        <Line type="monotone" dataKey="completions" stroke="#1db954" />
                    </ComposedChart>
                </ResponsiveContainer>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-4">Average Credit Score Improvement</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={scoreImprovementData}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Points Improved', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgImprovement" stroke="#ff7300" />
                    </ComposedChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AnalyticsPage;
