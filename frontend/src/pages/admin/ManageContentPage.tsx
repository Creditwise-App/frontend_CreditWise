import React, { useState, useCallback } from 'react';
import { useLessons } from '../../context/LessonsContext'; // ✅ Use global lessons
import { Lesson } from '../../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ManageContentPage: React.FC = () => {
    const { lessons, addLesson, updateLesson, deleteLesson, fetchLessons } = useLessons();
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleEdit = useCallback((lesson: Lesson) => {
        setEditingLesson({ ...lesson });
        setSaveError(null);
    }, []);

    const handleSave = useCallback(async () => {
        if (!editingLesson) return;
        
        setIsSaving(true);
        setSaveError(null);
        
        try {
            if (editingLesson.id) {
                // ✅ Update existing lesson
                await updateLesson(editingLesson);
            } else {
                // ✅ Add new lesson (ID auto-created in context)
                await addLesson({
                    title: editingLesson.title,
                    content: editingLesson.content
                });
            }
            
            // Refetch lessons to ensure consistency
            await fetchLessons();
            
            setEditingLesson(null);
        } catch (err: any) {
            setSaveError(err.message || 'Failed to save lesson');
            console.error('Error saving lesson:', err);
        } finally {
            setIsSaving(false);
        }
    }, [editingLesson, addLesson, updateLesson, fetchLessons]);

    const handleNew = useCallback(() => {
        setEditingLesson({ id: '', title: '', content: '' });
        setSaveError(null);
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await deleteLesson(id);
                // Refetch lessons to ensure consistency
                await fetchLessons();
                
                // If we were editing the deleted lesson, close the editor
                if (editingLesson && editingLesson.id === id) {
                    setEditingLesson(null);
                }
            } catch (err: any) {
                setSaveError(err.message || 'Failed to delete lesson');
                console.error('Error deleting lesson:', err);
            }
        }
    }, [deleteLesson, fetchLessons, editingLesson]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Content</h1>
                <Button onClick={handleNew}>Add New Lesson</Button>
            </div>

            {saveError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Error: {saveError}
                </div>
            )}

            {editingLesson && (
                <Card>
                    <h2 className="text-2xl font-bold mb-4">{editingLesson.id ? 'Edit Lesson' : 'Add New Lesson'}</h2>
                    <div className="space-y-4">
                        <Input
                            id="title"
                            label="Title"
                            value={editingLesson.title}
                            onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                            disabled={isSaving}
                        />
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium">Content</label>
                            <textarea
                                id="content"
                                rows={5}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                           rounded-md shadow-sm focus:outline-none focus:ring-primary-blue 
                                           focus:border-primary-blue sm:text-sm bg-card-light dark:bg-card-dark"
                                value={editingLesson.content}
                                onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button onClick={() => setEditingLesson(null)} variant="secondary" disabled={isSaving}>
                                Cancel
                            </Button>
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
                                    <Button 
                                        onClick={() => handleEdit(lesson)} 
                                        className="px-2 py-1 text-sm"
                                        disabled={isSaving}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        onClick={() => handleDelete(lesson.id)} 
                                        variant="secondary"
                                        className="bg-red-600 hover:bg-red-700 px-2 py-1 text-sm"
                                        disabled={isSaving}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {lessons.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No lessons found. Click "Add New Lesson" to create one.
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ManageContentPage;