import React, { useState } from 'react';
import { useLessons } from '../../context/LessonsContext';  
import { Card } from '../../components/ui/Card';

const LearnPage: React.FC = () => {
    const { lessons } = useLessons();  
    const [selectedLesson, setSelectedLesson] = useState(null);

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Lessons</h2>
                <div className="space-y-4">
                    {lessons.map(lesson => (
                        <div
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)} 
                            className={`p-4 rounded-lg cursor-pointer transition-all ${
                                selectedLesson?.id === lesson.id
                                    ? 'bg-primary-blue text-white shadow-lg'
                                    : 'bg-card-light dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <h3 className="font-bold">{lesson.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2">
                <Card className="min-h-[60vh]">
                    {selectedLesson ? (
                        <div>
                            <h2 className="text-3xl font-bold mb-4">{selectedLesson.title}</h2>
                            <p className="text-lg leading-relaxed mb-6">
                                {selectedLesson.content}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl text-gray-500">Select a lesson to begin.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default LearnPage;
