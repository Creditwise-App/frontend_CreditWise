import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Lesson } from '../../types';
import { lessonsAPI } from '../services/api';
import { adminAPI } from '../services/api'; // Import adminAPI for lesson management

type LessonsContextType = {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  fetchLessons: () => Promise<void>;
  addLesson: (lesson: Omit<Lesson, 'id'>) => Promise<Lesson>;
  updateLesson: (lesson: Lesson) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  likeLesson: (id: string) => Promise<string | null>; // Returns new feedback state
  dislikeLesson: (id: string) => Promise<string | null>; // Returns new feedback state
  getUserLessonFeedback: (id: string) => Promise<string | null>; // Returns user's feedback for a lesson
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
};

const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

export const LessonsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Use useCallback to memoize the fetchLessons function
  const fetchLessons = useCallback(async () => {
    // Prevent fetching too frequently (less than 5 minutes)
    const now = Date.now();
    if (now - lastFetchTime < 5 * 60 * 1000) {
      return;
    }
    
    try {
      setLoading(true);
      const data = await lessonsAPI.getAllLessons();
      // Map the API response to match our Lesson type
      const mappedLessons = data.map((lesson: any) => ({
        id: lesson._id,
        title: lesson.title,
        content: lesson.content,
        // Make quizId optional
        quizId: lesson.quizId || undefined,
        likes: lesson.likes || 0,
        dislikes: lesson.dislikes || 0
      }));
      setLessons(mappedLessons);
      setError(null);
      setLastFetchTime(now); // Update the last fetch time
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lessons');
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const addLesson = useCallback(async (lesson: Omit<Lesson, 'id'>) => {
    try {
      // Remove quizId from the lesson data before sending to API
      const { title, content } = lesson;
      const lessonData = { title, content };
      
      const response = await adminAPI.createLesson(lessonData);
      // Map the response to match our Lesson type
      const newLesson: Lesson = {
        id: response._id,
        title: response.title,
        content: response.content,
        // Make quizId optional
        quizId: response.quizId || undefined,
        likes: response.likes || 0,
        dislikes: response.dislikes || 0
      };
      
      // Update the lessons state with the new lesson
      setLessons(prev => [newLesson, ...prev]);
      
      // Force a refetch on next request by resetting the last fetch time
      setLastFetchTime(0);
      
      return newLesson;
    } catch (err: any) {
      setError(err.message || 'Failed to add lesson');
      console.error('Error adding lesson:', err);
      throw err;
    }
  }, []);

  const updateLesson = useCallback(async (lesson: Lesson) => {
    try {
      // Remove quizId from the lesson data before sending to API
      const { title, content } = lesson;
      const lessonData = { title, content };
      
      await adminAPI.updateLesson(lesson.id, lessonData);
      
      // Update the lesson in the state
      setLessons(prev => 
        prev.map(l => l.id === lesson.id ? { ...lesson, quizId: lesson.quizId || undefined } : l)
      );
      
      // Force a refetch on next request by resetting the last fetch time
      setLastFetchTime(0);
    } catch (err: any) {
      setError(err.message || 'Failed to update lesson');
      console.error('Error updating lesson:', err);
      throw err;
    }
  }, []);

  const deleteLesson = useCallback(async (id: string) => {
    try {
      await adminAPI.deleteLesson(id);
      
      // Remove the lesson from the state
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
      
      // Force a refetch on next request by resetting the last fetch time
      setLastFetchTime(0);
    } catch (err: any) {
      setError(err.message || 'Failed to delete lesson');
      console.error('Error deleting lesson:', err);
      throw err;
    }
  }, []);

  const likeLesson = useCallback(async (id: string) => {
    try {
      const response = await lessonsAPI.likeLesson(id);
      
      // Update the lesson in the state
      setLessons(prev => 
        prev.map(lesson => 
          lesson.id === id ? { ...lesson, likes: response.likes, dislikes: response.dislikes } : lesson
        )
      );
      
      return response.userFeedback;
    } catch (err: any) {
      setError(err.message || 'Failed to like lesson');
      console.error('Error liking lesson:', err);
      throw err;
    }
  }, []);

  const dislikeLesson = useCallback(async (id: string) => {
    try {
      const response = await lessonsAPI.dislikeLesson(id);
      
      // Update the lesson in the state
      setLessons(prev => 
        prev.map(lesson => 
          lesson.id === id ? { ...lesson, likes: response.likes, dislikes: response.dislikes } : lesson
        )
      );
      
      return response.userFeedback;
    } catch (err: any) {
      setError(err.message || 'Failed to dislike lesson');
      console.error('Error disliking lesson:', err);
      throw err;
    }
  }, []);

  const getUserLessonFeedback = useCallback(async (id: string) => {
    try {
      const response = await lessonsAPI.getUserLessonFeedback(id);
      return response.userFeedback;
    } catch (err: any) {
      console.error('Error fetching user feedback:', err);
      return null;
    }
  }, []);

  return (
    <LessonsContext.Provider value={{ lessons, loading, error, fetchLessons, addLesson, updateLesson, deleteLesson, likeLesson, dislikeLesson, getUserLessonFeedback, setLessons }}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => {
  const ctx = useContext(LessonsContext);
  if (!ctx) throw new Error('useLessons must be used within LessonsProvider');
  return ctx;
};