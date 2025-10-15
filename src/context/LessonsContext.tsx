import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Lesson } from '../../types';
import { MOCK_LESSONS } from '../../constants';

type LessonsContextType = {
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id'>) => Lesson; // returns created lesson (with id)
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (id: string) => void;
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
};

const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

const LOCALSTORAGE_KEY = 'app_lessons_v1';

export const LessonsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Lesson[];
        // Basic validation fallback
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // ignore and fallback to MOCK_LESSONS
    }
    return MOCK_LESSONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(lessons));
    } catch (e) {
      // ignore quota errors
      // optionally: console.error('Failed to save lessons to localStorage', e);
    }
  }, [lessons]);

  const addLesson = (lesson: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = { ...lesson, id: `lesson-${Date.now()}` };
    setLessons(prev => [...prev, newLesson]);
    return newLesson;
  };

  const updateLesson = (lesson: Lesson) => {
    setLessons(prev => prev.map(l => (l.id === lesson.id ? lesson : l)));
  };

  const deleteLesson = (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  return (
    <LessonsContext.Provider value={{ lessons, addLesson, updateLesson, deleteLesson, setLessons }}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => {
  const ctx = useContext(LessonsContext);
  if (!ctx) throw new Error('useLessons must be used within LessonsProvider');
  return ctx;
};
