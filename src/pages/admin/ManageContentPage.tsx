
import React, { useState } from 'react';
import { MOCK_LESSONS } from '../../../constants';
import { Lesson } from '../../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ManageContentPage: React.FC = () => {
    const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    const handleEdit = (lesson: Lesson) => {
        setEditingLesson({ ...lesson });
    };

    const handleSave = () => {
        if (!editingLesson) return;
        const index = lessons.findIndex(l => l.id === editingLesson.id);
        if (index > -1) {
            const newLessons = [...lessons];
            newLessons[index] = editingLesson;
            setLessons(newLessons);
        } else { // This is a new lesson
            setLessons([...lessons, { ...editingLesson, id: `lesson-${Date.now()}` }]);
        }
        setEditingLesson(null);
    };

    const handleNew = () => {
        setEditingLesson({ id: '', title: '', content: '', quizId: '' });
    };

    const handleDelete = (id: string) => {
        setLessons(lessons.filter(l => l.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Content</h1>
                <Button onClick={handleNew}>Add New Lesson</Button>
            </div>

            {editingLesson && (
                <Card>
                    <h2 className="text-2xl font-bold mb-4">{editingLesson.id ? 'Edit Lesson' : 'Add New Lesson'}</h2>
                    <div className="space-y-4">
                        <Input
                            id="title"
                            label="Title"
                            value={editingLesson.title}
                            onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                        />
                         <Input
                            id="quizId"
                            label="Quiz ID"
                            value={editingLesson.quizId}
                            onChange={(e) => setEditingLesson({ ...editingLesson, quizId: e.target.value })}
                        />
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium">Content</label>
                            <textarea
                                id="content"
                                rows={5}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm bg-card-light dark:bg-card-dark"
                                value={editingLesson.content}
                                onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleSave}>Save</Button>
                            <Button onClick={() => setEditingLesson(null)} variant="secondary">Cancel</Button>
                        </div>
                    </div>
                </Card>
            )}

            <Card>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Title</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map(lesson => (
                            <tr key={lesson.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="p-4">{lesson.title}</td>
                                <td className="p-4 space-x-2">
                                    {/* Fix: Removed unsupported 'size' prop and used className for styling. */}
                                    <Button onClick={() => handleEdit(lesson)} className="px-2 py-1 text-sm">Edit</Button>
                                    {/* Fix: Removed unsupported 'size' prop and used className for styling. */}
                                    <Button onClick={() => handleDelete(lesson.id)} variant="secondary" className="bg-red-600 hover:bg-red-700 px-2 py-1 text-sm">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default ManageContentPage;
