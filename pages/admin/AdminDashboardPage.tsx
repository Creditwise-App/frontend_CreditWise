
import React from 'react';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const userActivityData = [
  { name: 'Jan', active: 400 },
  { name: 'Feb', active: 300 },
  { name: 'Mar', active: 500 },
  { name: 'Apr', active: 450 },
  { name: 'May', active: 600 },
  { name: 'Jun', active: 700 },
];

const quizCompletionData = [
  { name: 'Completed', value: 400 },
  { name: 'In Progress', value: 300 },
  { name: 'Not Started', value: 300 },
];

const COLORS = ['#1db954', '#007bff', '#FFBB28'];

const AdminDashboardPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <h3 className="text-lg font-medium">Total Users</h3>
                    <p className="text-4xl font-bold text-primary-blue">1,250</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-medium">Lessons Published</h3>
                    <p className="text-4xl font-bold text-primary-green">4</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-medium">Quizzes Completed</h3>
                    <p className="text-4xl font-bold">2,840</p>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Active Users</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userActivityData}>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="active" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Quiz Completion Rate</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={quizCompletionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {quizCompletionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
