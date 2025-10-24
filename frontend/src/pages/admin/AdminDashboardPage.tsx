import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../../services/api';

const COLORS = ['#1db954', '#007bff', '#FFBB28'];

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [lessonFeedback, setLessonFeedback] = useState<any[]>([]);
    const [filteredLessonFeedback, setFilteredLessonFeedback] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // In a real application, this would come from an API
    const userActivityData = [
      { name: 'Jan', active: 400 },
      { name: 'Feb', active: 300 },
      { name: 'Mar', active: 500 },
      { name: 'Apr', active: 450 },
      { name: 'May', active: 600 },
      { name: 'Jun', active: 700 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch dashboard stats first
                const dashboardData = await adminAPI.getDashboardStats();
                setStats(dashboardData.stats);
                
                // Try to fetch lesson feedback details, but don't fail completely if it doesn't work
                try {
                    const feedbackData = await adminAPI.getLessonFeedbackDetails();
                    setLessonFeedback(feedbackData);
                    setFilteredLessonFeedback(feedbackData);
                } catch (lessonError) {
                    console.error('Failed to fetch lesson feedback details:', lessonError);
                    // Set empty array if we can't fetch lesson feedback
                    setLessonFeedback([]);
                    setFilteredLessonFeedback([]);
                }
                
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch dashboard data');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        // Filter lesson feedback based on search term
        if (searchTerm.trim() === '') {
            setFilteredLessonFeedback(lessonFeedback);
        } else {
            const filtered = lessonFeedback.filter(lesson => 
                lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLessonFeedback(filtered);
        }
    }, [searchTerm, lessonFeedback]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">Error loading dashboard data: {error}</p>
            </div>
        );
    }

    // Prepare feedback data for pie chart
    const feedbackData = [
      { name: 'Likes', value: stats?.totalLikes || 0 },
      { name: 'Dislikes', value: stats?.totalDislikes || 0 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <h3 className="text-lg font-medium">Total Users</h3>
                    <p className="text-4xl font-bold text-primary-blue">{stats?.totalUsers || 0}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-medium">Lessons Published</h3>
                    <p className="text-4xl font-bold text-primary-green">{stats?.totalLessons || 0}</p>
                </Card>
                <Card className="text-center">
                    <div className="flex justify-around items-center">
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Likes</h3>
                            <p className="text-3xl font-bold text-green-500">{stats?.totalLikes || 0}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Dislikes</h3>
                            <p className="text-3xl font-bold text-red-500">{stats?.totalDislikes || 0}</p>
                        </div>
                    </div>
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
                    <h2 className="text-2xl font-bold mb-4">Lesson Feedback Distribution</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={feedbackData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {feedbackData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* New section for detailed lesson feedback */}
            {lessonFeedback.length > 0 && (
                <div className="grid gap-6">
                    <Card>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h2 className="text-2xl font-bold text-primary-green">Lesson Feedback Details</h2>
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search lessons..."
                                    className="w-full px-4 py-2 border border-primary-green rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-green"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-green scrollbar-track-gray-200 dark:scrollbar-track-gray-700 scrollbar-rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lesson Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Likes</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dislikes</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                                    {filteredLessonFeedback.length > 0 ? (
                                        filteredLessonFeedback.map((lesson) => (
                                            <tr key={lesson._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-green">{lesson.likes || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-500">{lesson.dislikes || 0}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No lessons found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;