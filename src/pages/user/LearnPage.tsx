
import React, { useState } from 'react';
import { MOCK_LESSONS, MOCK_QUIZZES } from '../../../constants';
import { Lesson, Quiz } from '../../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const QuizComponent: React.FC<{ quiz: Quiz, onComplete: () => void }> = ({ quiz, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (option: string) => {
        setSelectedOption(option);
        if (option === quiz.questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
        setTimeout(() => {
            if (currentQuestion < quiz.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    if (showResult) {
        return (
            <div>
                <h3 className="text-xl font-bold">Quiz Complete!</h3>
                <p className="my-4">Your score: {score} / {quiz.questions.length}</p>
                <Button onClick={onComplete}>Close Quiz</Button>
            </div>
        )
    }

    const question = quiz.questions[currentQuestion];
    return (
        <div>
            <h3 className="text-xl font-bold mb-4">{quiz.title}</h3>
            <p className="mb-2">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            <p className="text-lg font-semibold mb-4">{question.question}</p>
            <div className="space-y-3">
                {question.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={!!selectedOption}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            selectedOption === option
                                ? (option === question.correctAnswer ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500')
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};


const LearnPage: React.FC = () => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

    const handleSelectLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setActiveQuiz(null);
    }

    const startQuiz = (quizId: string) => {
        const quiz = MOCK_QUIZZES.find(q => q.id === quizId);
        if (quiz) setActiveQuiz(quiz);
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Lessons</h2>
                <div className="space-y-4">
                    {MOCK_LESSONS.map(lesson => (
                        <div key={lesson.id} onClick={() => handleSelectLesson(lesson)} 
                             className={`p-4 rounded-lg cursor-pointer transition-all ${selectedLesson?.id === lesson.id ? 'bg-primary-blue text-white shadow-lg' : 'bg-card-light dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <h3 className="font-bold">{lesson.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2">
                <Card className="min-h-[60vh]">
                    {activeQuiz ? (
                        <QuizComponent quiz={activeQuiz} onComplete={() => setActiveQuiz(null)} />
                    ) : selectedLesson ? (
                        <div>
                            <h2 className="text-3xl font-bold mb-4">{selectedLesson.title}</h2>
                            <p className="text-lg leading-relaxed mb-6">{selectedLesson.content}</p>
                            <Button onClick={() => startQuiz(selectedLesson.quizId)}>
                                Test Your Knowledge
                            </Button>
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
