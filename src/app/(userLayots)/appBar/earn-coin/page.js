"use client";

import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
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
 */

// --- Constants ---
const COINS_PER_CORRECT_ANSWER = 10;
const NUMBER_OF_QUESTIONS = 10;
const MOCK_USER_EMAIL = "user@example.com"; // Mock user email for the POST request

/**
 * Utility function to shuffle an array (Fisher-Yates algorithm).
 * @param {Array<T>} array
 * @returns {Array<T>}
 */
const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Main Component ---
export default function EarnCoinQuizPage() {
  const [userData, setUserData] = useState(null);
  const [quizStage, setQuizStage] = useState("welcome"); // 'welcome' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [resultData, setResultData] = useState(
    /** @type {ResultData | null} */ (null)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [timerActive, setTimerActive] = useState(false);

  /**
   * Loads the quiz data, shuffles, and selects 10 questions.
   */
  const loadQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setUserAnswers({});
    setResultData(null);
    setQuizStage("quiz");

    setTimeLeft(60); // reset timer
    setTimerActive(true); // start timer

    try {
      const response = await axiosInstance("/quiz.json");
      if (!response.ok) {
        throw new Error("Failed to load quiz data.");
      }
      const allQuestions = await response.json();

      // Shuffle and select the first 10 questions
      const selectedQuestions = shuffleArray(allQuestions).slice(
        0,
        NUMBER_OF_QUESTIONS
      );

      setQuestions(selectedQuestions);
    } catch (err) {
      console.error(err);
      setError("Could not load quiz questions. Please try again.");
      setQuizStage("welcome");
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      // Auto-submit quiz when timer hits 0
      handleSubmitQuiz(new Event("submit"));
      setTimerActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance("/coin-earn");
        if (res.data.success) setUserData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch immediately
    fetchUserData();

    // Then re-fetch every 5 seconds 🔁
    const interval = setInterval(fetchUserData, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  /**
   * Handles user selecting an option for a question.
   * @param {number} questionId
   * @param {number} optionIndex
   */
  const handleAnswerChange = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  /**
   * Calculates the score and sends results to the backend.
   */
  const handleSubmitQuiz = async (e) => {
    e.preventDefault?.();
    setIsLoading(true);
    setError(null);
    setTimerActive(false); // stop timer

    // 1. Calculate Score
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = correctCount;
    const coinsEarned = score * COINS_PER_CORRECT_ANSWER;

    // 2. Prepare payload and send to MongoDB API
    const payload = {
      userEmail: session?.user?.email || MOCK_USER_EMAIL,
      userName: session?.user?.name || MOCK_USER_NAME,
      score: score,
      coinsEarned: coinsEarned,
      date: new Date().toISOString(),
    };

    try {
      const response = await axios.post("/api/coin-earn", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response?.data?.success) {
        throw new Error("Failed to save quiz result to the database.");
      }

      // 3. Update state and show result
      setResultData({ score, coinsEarned });
      setQuizStage("result");
    } catch (err) {
      console.error("Submission Error:", err);
      setError(
        "Quiz submitted, but failed to save results. Your score is: " + score
      );
      setResultData({ score, coinsEarned });
      setQuizStage("result");
    } finally {
      setIsLoading(false);
    }
  };

  // Check how many questions the user has answered
  const answeredCount = useMemo(
    () => Object.keys(userAnswers).length,
    [userAnswers]
  );
  const progress = (answeredCount / NUMBER_OF_QUESTIONS) * 100;

  // --- Render Components based on Stage ---
  const renderWelcomeScreen = () => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="card w-full max-w-lg shadow-2xl bg-white dark:bg-gray-800 transition-all duration-500 ease-in-out transform hover:scale-[1.02] border border-red-500">
        <div className="card-body items-center text-center p-8">
          <Zap className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
          <h2 className="card-title text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
            Do You Want to Earn Coins?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Answer {NUMBER_OF_QUESTIONS} questions correctly to earn up to{" "}
            {NUMBER_OF_QUESTIONS * COINS_PER_CORRECT_ANSWER} coins!
          </p>
          <p className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
            Your Current Coins:{" "}
            <Coins className="w-8 h-8 drop-shadow-md text-yellow-500" />{" "}
            <span className="text-2xl font-black">
              {userData?.coinsEarned ?? "..."}
            </span>
          </p>
          {error && (
            <div
              role="alert"
              className="alert alert-error my-4 bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-100"
            >
              {error}
            </div>
          )}
          <div className="card-actions mt-4">
            <button
              onClick={loadQuiz}
              className="btn btn-lg shadow-xl transition-all duration-300 transform hover:shadow-red-500/50 hover:-translate-y-1 active:scale-95 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-white"></span>
                  Loading...
                </>
              ) : (
                <>
                  Start Quiz
                  <RefreshCw className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestion = (q, index) => {
    const isAnswered = userAnswers[q.id] !== undefined;
    const selectedIndex = userAnswers[q.id];

    return (
      <div
        key={q.id}
        className={`card  mb-8 bg-white dark:bg-gray-800 transition-all border duration-500 transform  ${
          isAnswered
            ? " border-green-500 dark:border-green-400 shadow-green-500/20"
            : " border-gray-300 dark:border-gray-700"
        } rounded-xl`}
        style={{ animation: "fadeIn 0.5s ease-out" }}
      >
        <div className="card-body p-6">
          <h3 className="card-title text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            <span className="text-red-500 mr-2">{index + 1}.</span> {q.question}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`label cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 hover:text-black  hover:bg-gray-300
                  ${
                    selectedIndex === optionIndex
                      ? "bg-red-500/10 dark:bg-red-500/20 border-red-500 dark:border-red-400 shadow-lg shadow-red-500/20"
                      : "border-gray-200 dark:border-gray-700 "
                  }`}
              >
                <span className="label-text font-bold flex-1 text-left">
                  {option}
                </span>
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={selectedIndex === optionIndex}
                  onChange={() => handleAnswerChange(q.id, optionIndex)}
                  className="radio radio-error ml-4"
                  disabled={isLoading}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => (
    <div className=" w-full mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-center text-red-500 dark:text-red-400 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 dark:from-red-400 dark:to-red-600">
        Coin Quiz Challenge
      </h1>

      {/* Quiz Progress with Sticky Header */}
      <div className="sticky top-0 z-10  dark:bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl  mb-8 border-red-500 dark:border-red-400 transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>

          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
            <RxStopwatch size={50} />{" "}
            <span className="text-5xl font-extrabold">{timeLeft}</span>s
          </span>
          <div className="flex gap-4 items-center">
            <span className="text-xl font-bold text-red-500 dark:text-red-400">
              {answeredCount} / {NUMBER_OF_QUESTIONS}
            </span>
          </div>
        </div>
        <progress
          className="progress w-full h-3 transition-all duration-500 bg-gray-300 dark:bg-gray-700"
          value={progress}
          max="100"
          style={{
            backgroundImage: `linear-gradient(to right, #ef4444, #dc2626)`,
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        />
      </div>

      <form onSubmit={handleSubmitQuiz} className=" mx-auto">
        {questions.map(renderQuestion)}

        <div className="text-center mt-10 mb-20 ">
          {error && (
            <div
              role="alert"
              className="alert alert-error mb-4 bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-100"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-lg w-full shadow-2xl transition-all duration-300 transform hover:shadow-red-500/50 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white border-2 border-transparent hover:border-red-300"
            disabled={isLoading || answeredCount < NUMBER_OF_QUESTIONS}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner text-white"></span>
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz and Claim Coins
                <Trophy className="w-6 h-6" />
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {answeredCount < NUMBER_OF_QUESTIONS
              ? `Answer ${
                  NUMBER_OF_QUESTIONS - answeredCount
                } more questions to submit.`
              : "**All questions answered! Ready to submit!**"}
          </p>
        </div>
      </form>
    </div>
  );

  const renderResultScreen = () => {
    if (!resultData) return null;

    const { score, coinsEarned } = resultData;
    const isPerfect = score === NUMBER_OF_QUESTIONS;

    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="card w-full max-w-lg shadow-2xl bg-white dark:bg-gray-800 transition-all duration-500 ease-in-out transform hover:scale-[1.02] border border-red-500 dark:border-red-400">
          <div className="card-body items-center text-center p-8">
            <Trophy
              className={`w-20 h-20 mb-4 ${
                isPerfect
                  ? "text-yellow-500 dark:text-yellow-400 animate-pulse"
                  : "text-red-500 dark:text-red-400"
              }`}
            />
            <h2 className="card-title text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
              {isPerfect ? "🌟 Perfect Score! 🌟" : "Quiz Completed!"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              You correctly answered
              <span className="font-extrabold text-red-500 dark:text-red-400 mx-1 text-3xl">
                {score}
              </span>
              out of {NUMBER_OF_QUESTIONS} questions.
            </p>

            <div className="stats shadow-lg bg-gray-100 dark:bg-gray-700 mb-6">
              <div className="stat place-items-center p-6">
                <div className="stat-title text-gray-600 dark:text-gray-300">
                  Coins Earned
                </div>
                <div className="stat-value text-red-600 dark:text-red-400 flex items-center gap-2 text-5xl font-black">
                  {coinsEarned}
                  <Coins className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="stat-desc text-sm text-gray-500 dark:text-gray-400">
                  @{COINS_PER_CORRECT_ANSWER} coins per correct answer
                </div>
              </div>
            </div>

            <div className="card-actions justify-center">
              <button
                onClick={() => setQuizStage("welcome")}
                className="btn btn-lg shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Try Another Quiz
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <div
                role="alert"
                className="alert alert-warning mt-4 bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-500">
      {quizStage === "welcome" && renderWelcomeScreen()}
      {quizStage === "quiz" && renderQuiz()}
      {quizStage === "result" && renderResultScreen()}
    </div>
  );
}
