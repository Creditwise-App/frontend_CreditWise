import React, { useState, useEffect, useCallback } from 'react';
import { useLessons } from '../../context/LessonsContext';  
import { Card } from '../../components/ui/Card';
import { Lesson } from '../../../types';

const LearnPage: React.FC = () => {
    const { lessons, loading, error, fetchLessons, likeLesson, dislikeLesson, getUserLessonFeedback } = useLessons();  
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [userFeedback, setUserFeedback] = useState<Record<string, string | null>>({});

    // Use useCallback to prevent unnecessary re-renders
    const fetchLessonsOnce = useCallback(async () => {
        if (!hasFetched) {
            await fetchLessons();
            setHasFetched(true);
        }
    }, [fetchLessons, hasFetched]);

    useEffect(() => {
        fetchLessonsOnce();
    }, [fetchLessonsOnce]);

    // Function to manually refresh lessons
    const handleRefreshLessons = useCallback(() => {
        setHasFetched(false); // Reset the flag to allow refetching
    }, []);

    const handleSelectLesson = async (lesson: Lesson) => {
        setSelectedLesson(lesson);
        
        // Fetch user's feedback for this lesson
        try {
            const feedback = await getUserLessonFeedback(lesson.id);
            setUserFeedback(prev => ({
                ...prev,
                [lesson.id]: feedback
            }));
        } catch (err) {
            console.error('Error fetching user feedback:', err);
        }
    };

    const handleLikeLesson = async (lessonId: string) => {
        try {
            const newFeedback = await likeLesson(lessonId);
            setUserFeedback(prev => ({
                ...prev,
                [lessonId]: newFeedback
            }));
        } catch (err) {
            console.error('Error liking lesson:', err);
        }
    };

    const handleDislikeLesson = async (lessonId: string) => {
        try {
            const newFeedback = await dislikeLesson(lessonId);
            setUserFeedback(prev => ({
                ...prev,
                [lessonId]: newFeedback
            }));
        } catch (err) {
            console.error('Error disliking lesson:', err);
        }
    };

    if (loading && !hasFetched) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading lessons...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 text-lg mb-2">Error loading lessons</p>
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button 
                    onClick={handleRefreshLessons}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-bold">Lessons</h2>
                    <button 
                        onClick={handleRefreshLessons}
                        className="text-sm text-blue-500 hover:text-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {lessons.map(lesson => (
                        <div
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)} 
                            className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all relative ${
                                selectedLesson?.id === lesson.id
                                    ? 'bg-primary-blue text-white shadow-lg'
                                    : 'bg-card-light dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <h3 className="font-bold text-sm md:text-base">{lesson.title}</h3>
                            <div className="flex items-center mt-2 space-x-3 md:space-x-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeLesson(lesson.id);
                                    }}
                                    className="flex items-center text-xs md:text-sm"
                                >
                                    <span className="mr-1 text-base md:text-lg">
                                        {userFeedback[lesson.id] === 'like' ? '👍' : '👍'}
                                    </span>
                                    <span>{lesson.likes || 0}</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDislikeLesson(lesson.id);
                                    }}
                                    className="flex items-center text-xs md:text-sm"
                                >
                                    <span className="mr-1 text-base md:text-lg">
                                        {userFeedback[lesson.id] === 'dislike' ? '👎' : '👎'}
                                    </span>
                                    <span>{lesson.dislikes || 0}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2">
                <Card className="min-h-[50vh] md:min-h-[60vh]">
                    {selectedLesson ? (
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{selectedLesson.title}</h2>
                            <p className="text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                                {selectedLesson.content}
                            </p>
                            <div className="flex space-x-3 md:space-x-4">
                                <button
                                    onClick={() => handleLikeLesson(selectedLesson.id)}
                                    className={`flex items-center text-sm px-2 py-1 md:px-3 md:py-1 rounded ${
                                        userFeedback[selectedLesson.id] === 'like' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <span className="mr-1 text-base md:text-lg">👍</span>
                                    <span>{selectedLesson.likes || 0}</span>
                                </button>
                                <button
                                    onClick={() => handleDislikeLesson(selectedLesson.id)}
                                    className={`flex items-center text-sm px-2 py-1 md:px-3 md:py-1 rounded ${
                                        userFeedback[selectedLesson.id] === 'dislike' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <span className="mr-1 text-base md:text-lg">👎</span>
                                    <span>{selectedLesson.dislikes || 0}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-lg text-gray-500">Select a lesson to begin.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default LearnPage;