"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiSolidMessageAltError } from 'react-icons/bi';
import { MdError } from 'react-icons/md';

export default function QuizComponent({ profileId, userId, category, onComplete }) {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Start quiz
  useEffect(() => {
    startQuiz();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !result) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizData && !result && !submitting) {
      handleAutoSubmit();
    }
  }, [timeLeft, quizData, result, submitting]);

  const startQuiz = async () => {
    try {
      setError(null);
      const response = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, userId, category })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuizData(data);
        setTimeLeft(data.timeLimit * 60);
        setStartTime(Date.now());
        setLoading(false);
        
        // Load saved answers from localStorage
        const savedAnswers = localStorage.getItem(`quiz_${data.sessionId}`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Quiz start error:', error);
      setError('Failed to start quiz');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedIndex) => {
    const newAnswers = { ...answers, [questionId]: selectedIndex };
    setAnswers(newAnswers);
    
    // Save to localStorage
    if (quizData?.sessionId) {
      localStorage.setItem(`quiz_${quizData.sessionId}`, JSON.stringify(newAnswers));
    }
  };

  const handleAutoSubmit = async () => {
    if (!submitting) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    
    const timeTakenSec = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    const formattedAnswers = quizData.questions.map((q, index) => ({
      questionId: q._id,
      selectedIndex: answers[q._id] !== undefined ? answers[q._id] : -1
    }));

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: quizData.sessionId,
          profileId,
          answers: formattedAnswers,
          timeTakenSec
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
        if (onComplete) onComplete(data.result);
        
        // Clear localStorage
        if (quizData.sessionId) {
          localStorage.removeItem(`quiz_${quizData.sessionId}`);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Quiz submit error:', error);
      setError('Failed to submit answers');
    }
    
    setSubmitting(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(ans => ans !== undefined && ans !== -1).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <div className="text-lg">Loading Quiz...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center items-center">
        <h1 className=" mb-4 text-6xl  text-red-600"><MdError /></h1>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('appBar/share-skills')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Go Back to Skills Form
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
        <div className={`text-6xl mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
          {result.passed ? '🎉' : '😔'}
        </div>
        
        <h2 className="text-2xl font-bold mb-4">
          {result.passed ? 'Congratulations!' : 'Try Again!'}
        </h2>
        
        <div className="mb-4">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {result.score}/{result.totalQuestions}
          </div>
          <div className="text-gray-600">
            {result.percentage}% Score
          </div>
          <div className="text-sm text-gray-500 mt-1">
            You needed {result.passingScore}+ to pass
          </div>
        </div>

        {result.badgeType && (
          <div className="mb-4">
            <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
              result.badgeType === 'Gold' ? 'bg-yellow-500' :
              result.badgeType === 'Silver' ? 'bg-gray-400' :
              'bg-yellow-800'
            }`}>
              {result.badgeType} Badge
            </div>
          </div>
        )}

        <p className="text-gray-700 mb-6">
          {result.message}
        </p>

        <div className="space-x-4">
          <button
            onClick={() => router.push('appBar/share-skills')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Skills Form
          </button>
          
          {!result.passed && (
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const answeredCount = getAnsweredCount();

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Verification Test - {category}
            </h1>
            <div className="text-sm text-gray-600 mt-1">
              {answeredCount}/{quizData.questions.length} questions answered
            </div>
          </div>
          <div className={`text-xl font-mono px-3 py-1 rounded ${
            timeLeft < 300 ? 'text-red-500 bg-red-50' : 'text-gray-600 bg-gray-50'
          }`}>
             {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {quizData.questions.length}
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.question}
        </h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion._id, index)}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion._id] === index
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                value={index}
                checked={answers[currentQuestion._id] === index}
                onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                className="mr-3"
              />
              <span className="flex-1">{option}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          ← Previous
        </button>

        <div className="flex space-x-4">
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
            </button>
          )}
        </div>
      </div>

      {/* Answer Summary */}
      <div className="mt-6 pt-4 border-t">
        <div className="text-sm text-gray-600 mb-2">Question Status:</div>
        <div className="flex flex-wrap gap-2">
          {quizData.questions.map((q, index) => (
            <div
              key={q._id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm cursor-pointer transition-colors ${
                answers[q._id] !== undefined && answers[q._id] !== -1
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } ${
                index === currentQuestionIndex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Warning for unanswered questions */}
      {quizData.questions.length - answeredCount > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
             {quizData.questions.length - answeredCount} questions left unanswered
          </div>
        </div>
      )}
    </div>
  );
}
