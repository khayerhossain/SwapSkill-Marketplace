"use client";

import axiosInstance from "@/lib/axiosInstance";
import { Coins, RefreshCw, Trophy, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { use, useEffect, useMemo, useState } from "react";
import { RxStopwatch } from "react-icons/rx";
// --- Type Definitions (for clarity) ---

/**
 * @typedef {object} Question
 * @property {number} id
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctAnswerIndex
 */

/**
 * @typedef {object} ResultData
 * @property {number} score
 * @property {number} coinsEarned
 * @property {string} date
 */

// --- Quiz Data ---
const quizData = [
  {
    id: 1,
    question: "What is the primary purpose of React?",
    options: [
      "To build user interfaces",
      "To manage databases",
      "To handle server requests",
      "To create animations",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 2,
    question: "Which hook is used to manage state in functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswerIndex: 1,
  },
  {
    id: 3,
    question: "What does JSX stand for?",
    options: [
      "JavaScript XML",
      "Java Syntax Extension",
      "JSON XML",
      "JavaScript Extension",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 4,
    question: "Which method is used to update state in React?",
    options: ["setState", "updateState", "changeState", "modifyState"],
    correctAnswerIndex: 0,
  },
  {
    id: 5,
    question: "What is the virtual DOM?",
    options: [
      "A real DOM element",
      "A JavaScript representation of the DOM",
      "A CSS framework",
      "A database",
    ],
    correctAnswerIndex: 1,
  },
];

export default function EarnCoinQuizPage() {
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  // Fetch user coins on component mount
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserCoins();
    }
  }, [session]);

  const fetchUserCoins = async () => {
    try {
      const response = await axiosInstance.get("/api/coin-earn");
      if (response.data.success) {
        setUserCoins(response.data.data?.coinsEarned || 0);
      }
    } catch (error) {
      console.error("Error fetching user coins:", error);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(30);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    setQuizCompleted(true);
    setQuizStarted(false);

    // Calculate coins earned based on score
    const coinsEarned = Math.floor((score / totalQuestions) * 10);
    const finalScore = selectedAnswer === currentQuestion.correctAnswerIndex ? score + 1 : score;

    const result = {
      score: finalScore,
      coinsEarned: coinsEarned,
      date: new Date().toISOString(),
    };

    setResultData(result);
    setShowResult(true);

    // Save result to database
    await saveQuizResult(finalScore, coinsEarned);
  };

  const saveQuizResult = async (finalScore, coinsEarned) => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    const payload = {
      userEmail: session.user.email,
      score: finalScore,
      coinsEarned: coinsEarned,
      date: new Date().toISOString(),
    };

    try {
      const response = await axiosInstance.post("/api/coin-earn", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response?.data?.success) {
        throw new Error("Failed to save quiz result to the database.");
      }

      // Update user coins
      setUserCoins(prev => prev + coinsEarned);
    } catch (error) {
      console.error("Error saving quiz result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setQuizStarted(false);
    setQuizCompleted(false);
    setShowResult(false);
    setResultData(null);
  };

  const getScoreColor = (score) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreMessage = (score) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    return "Keep practicing! 💪";
  };

  if (showResult && resultData) {
    return (
      <div className="min-h-screen bg-[#111111] text-white p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Quiz Completed! 🎉</h1>
            <p className="text-gray-400">Here are your results</p>
          </div>

          {/* Result Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
            <div className="text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {getScoreMessage(resultData.score)}
                </h2>
                <p className={`text-3xl font-bold ${getScoreColor(resultData.score)}`}>
                  {resultData.score}/{totalQuestions}
                </p>
                <p className="text-gray-400 mt-2">Correct Answers</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-400">
                    +{resultData.coinsEarned}
                  </p>
                  <p className="text-gray-400 text-sm">Coins Earned</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-400">
                    {userCoins + resultData.coinsEarned}
                  </p>
                  <p className="text-gray-400 text-sm">Total Coins</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = "/appBar/overview"}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Go to Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Earn Coins Quiz 🪙</h1>
          <p className="text-gray-400">Test your knowledge and earn coins!</p>
        </div>

        {/* User Coins Display */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">
              {userCoins} Coins
            </span>
          </div>
        </div>

        {!quizStarted && !quizCompleted ? (
          /* Quiz Start Screen */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <Zap className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Ready to Test Your Skills?</h2>
              <p className="text-gray-400 mb-4">
                Answer {totalQuestions} questions correctly to earn coins!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <RxStopwatch className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="font-semibold">30 seconds</p>
                <p className="text-gray-400 text-sm">per question</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="font-semibold">Up to 10 coins</p>
                <p className="text-gray-400 text-sm">based on score</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="font-semibold">Unlimited tries</p>
                <p className="text-gray-400 text-sm">practice anytime</p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          /* Quiz Questions */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-sm text-gray-400">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
                <RxStopwatch className="w-5 h-5 text-green-400" />
                <span
                  className={`text-lg font-bold ${
                    timeLeft <= 10 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="text-center">
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  selectedAnswer === null
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Saving your results...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
