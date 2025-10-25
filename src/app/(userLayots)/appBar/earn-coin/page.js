"use client";

import Loading from "@/app/loading";
import axios from "axios";
import { Coins, RefreshCw, Trophy, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { RxStopwatch } from "react-icons/rx";

// --- Constants ---
const COINS_PER_CORRECT_ANSWER = 10;
const NUMBER_OF_QUESTIONS = 10;
const MOCK_USER_EMAIL = "user@example.com";

const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function EarnCoinQuizPage() {
  const [userData, setUserData] = useState(null);
  const [quizStage, setQuizStage] = useState("welcome");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: session } = useSession();

  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/quizzes");
        const result = await response.json();

        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/coin-earn");
        if (res.data.success) setUserData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadQuiz = async (category) => {
    setIsLoading(true);
    setError(null);
    setUserAnswers({});
    setResultData(null);
    setQuizStage("quiz");
    setSelectedCategory(category);

    setTimeLeft(300);
    setTimerActive(true);

    try {
      const response = await fetch(`/api/quizzes/${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error("Failed to load quiz data.");
      const result = await response.json();

      if (!result.success) throw new Error(result.error || "Failed to load quiz data.");

      const quizData = result.data;
      const transformedQuestions = quizData.questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
      }));

      const selectedQuestions = shuffleArray(transformedQuestions).slice(0, NUMBER_OF_QUESTIONS);
      setQuestions(selectedQuestions);
    } catch (err) {
      console.error(err);
      setError("Could not load quiz questions. Please try again.");
      setQuizStage("welcome");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      handleSubmitQuiz(new Event("submit"));
      setTimerActive(false);
      return;
    }

    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const handleAnswerChange = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault?.();
    setIsLoading(true);
    setError(null);
    setTimerActive(false);

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) correctCount++;
    });

    const score = correctCount;
    const coinsEarned = score * COINS_PER_CORRECT_ANSWER;

    const payload = {
      userEmail: session?.user?.email || MOCK_USER_EMAIL,
      score,
      coinsEarned,
      date: new Date().toISOString(),
    };

    try {
      const response = await axios.post("/api/coin-earn", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response?.data?.success)
        throw new Error("Failed to save quiz result to the database.");

      setResultData({ score, coinsEarned });
      setQuizStage("result");
    } catch (err) {
      console.error("Submission Error:", err);
      setError("Quiz submitted, but failed to save results. Your score is: " + score);
      setResultData({ score, coinsEarned });
      setQuizStage("result");
    } finally {
      setIsLoading(false);
    }
  };

  const answeredCount = useMemo(() => Object.keys(userAnswers).length, [userAnswers]);
  const progress = (answeredCount / NUMBER_OF_QUESTIONS) * 100;

  const renderCategoryScreen = () => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-black transition-colors duration-500">
      <div className="card w-full max-w-4xl shadow-2xl bg-white dark:bg-black border border-red-500 transition-all">
        <div className="card-body items-center text-center p-8">
          <Zap className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
          <h2 className="card-title text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            Choose a Quiz Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Select a category and answer {NUMBER_OF_QUESTIONS} questions correctly to earn up to{" "}
            {NUMBER_OF_QUESTIONS * COINS_PER_CORRECT_ANSWER} coins!
          </p>
          <p className="flex items-center gap-4 text-gray-800 dark:text-gray-200 mb-6">
            Your Current Coins:{" "}
            <Coins className="w-8 h-8 drop-shadow-md text-yellow-500" />{" "}
            <span className="text-2xl font-black">{userData?.coinsEarned ?? "..."}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
            {categories.map((quiz) => (
              <div
                key={quiz._id}
                className="card bg-base-100 shadow-xl border border-gray-200 dark:border-gray-800 hover:border-red-500 transition-all cursor-pointer transform hover:scale-105 dark:bg-black"
                onClick={() => loadQuiz(quiz.category)}
              >
                <div className="card-body text-center p-6">
                  <h3 className="card-title text-xl font-bold justify-center text-gray-800 dark:text-white">
                    {quiz.category}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Questions: {quiz.questions?.length || 0}</p>
                  </div>
                  <button className="btn mt-4 bg-red-500 hover:bg-red-600 text-white border-none">
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="alert alert-error my-4 bg-red-100 border-red-400 text-red-700 dark:bg-black dark:text-red-100"
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWelcomeScreen = () => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-black transition-colors duration-500">
      <div className="card w-full max-w-lg shadow-2xl bg-white dark:bg-black border border-red-500">
        <div className="card-body items-center text-center p-8">
          <Zap className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
          <h2 className="card-title text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            Do You Want to Earn Coins?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Answer {NUMBER_OF_QUESTIONS} questions correctly to earn up to{" "}
            {NUMBER_OF_QUESTIONS * COINS_PER_CORRECT_ANSWER} coins!
          </p>
          <p className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
            Your Current Coins:{" "}
            <Coins className="w-8 h-8 drop-shadow-md text-yellow-500" />{" "}
            <span className="text-2xl font-black">{userData?.coinsEarned ?? "..."}</span>
          </p>

          {error && (
            <div
              role="alert"
              className="alert alert-error my-4 bg-red-100 border-red-400 text-red-700 dark:bg-black dark:text-red-100"
            >
              {error}
            </div>
          )}
          <div className="card-actions mt-4">
            <button
              onClick={() => setQuizStage("category")}
              className="btn btn-lg shadow-xl bg-red-500 hover:bg-red-600 text-white border-none flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  
                  <Loading></Loading>
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

  const renderQuiz = () => (
    <div className="w-full mx-auto p-4 md:p-8 dark:bg-black text-gray-50 transition-colors duration-500">
      <h1 className="text-4xl font-extrabold text-center text-red-500 mb-6">
        {selectedCategory} Quiz Challenge
      </h1>

      <div className="sticky top-0 z-10 dark:bg-black/95 backdrop-blur-sm p-4 rounded-xl mb-8 border border-red-500 transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
            <RxStopwatch size={50} /> <span className="text-5xl font-extrabold"> {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
  {String(timeLeft % 60).padStart(2, "0")}</span>
          </span>
          <div className="flex gap-4 items-center">
            <span className="text-xl font-bold text-red-500 dark:text-red-400">
              {answeredCount} / {NUMBER_OF_QUESTIONS}
            </span>
          </div>
        </div>
        <progress
          className="progress w-full h-3 transition-all duration-500 bg-gray-300 dark:bg-gray-800"
          value={progress}
          max="100"
          style={{
            backgroundImage: `linear-gradient(to right, #ef4444, #dc2626)`,
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        />
      </div>

      <form onSubmit={handleSubmitQuiz}>
        {questions.map((q, index) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const selectedIndex = userAnswers[q.id];
          return (
            <div
              key={q.id}
              className={`card mb-8 bg-white dark:bg-black transition-all border duration-500 ${
                isAnswered
                  ? "border-green-500 shadow-green-500/20"
                  : "border-gray-300 dark:border-gray-800"
              } rounded-xl`}
            >
              <div className="card-body p-6">
                <h3 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
                  <span className="text-red-500 mr-2">{index + 1}.</span> {q.question}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`label cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 hover:text-black hover:bg-gray-300 ${
                        selectedIndex === optionIndex
                          ? "bg-red-500/10 dark:bg-red-500/20 border-red-500 shadow-red-500/20"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <span className="label-text font-bold flex-1 text-left">{option}</span>
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
        })}

        <div className="text-center mt-10 mb-20">
          {error && (
            <div
              role="alert"
              className="alert alert-error mb-4 bg-red-100 border-red-400 text-red-700 dark:bg-black dark:text-red-100"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-lg w-full bg-red-600 hover:bg-red-700 text-white border-2 border-transparent hover:border-red-300 transition-all duration-300"
            disabled={isLoading || answeredCount < NUMBER_OF_QUESTIONS}
          >
            {isLoading ? (
              <>
                
                <Loading></Loading>
              </>
            ) : (
              <>
                Submit Quiz and Claim Coins <Trophy className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderResultScreen = () => {
    if (!resultData) return null;
    const { score, coinsEarned } = resultData;
    const isPerfect = score === NUMBER_OF_QUESTIONS;

    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-black transition-colors duration-500">
        <div className="card w-full max-w-lg shadow-2xl bg-white dark:bg-black border border-red-500">
          <div className="card-body items-center text-center p-8">
            <Trophy
              className={`w-20 h-20 mb-4 ${
                isPerfect ? "text-yellow-500 animate-pulse" : "text-red-500"
              }`}
            />
            <h2 className="card-title text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
              {isPerfect ? "🌟 Perfect Score! 🌟" : "Quiz Completed!"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              You correctly answered
              <span className="font-extrabold text-red-500 mx-1 text-3xl">{score}</span>
              out of {NUMBER_OF_QUESTIONS} questions.
            </p>

            <div className="stats shadow-lg bg-gray-100 dark:bg-black mb-6">
              <div className="stat place-items-center p-6">
                <div className="stat-title text-gray-600 dark:text-gray-300">Coins Earned</div>
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
                onClick={() => setQuizStage("category")}
                className="btn btn-lg bg-red-500 hover:bg-red-600 text-white border-none flex items-center gap-2"
              >
                Try Another Quiz
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="alert alert-warning mt-4 bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-black dark:text-yellow-100"
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans transition-colors duration-500">
      {quizStage === "welcome" && renderWelcomeScreen()}
      {quizStage === "category" && renderCategoryScreen()}
      {quizStage === "quiz" && renderQuiz()}
      {quizStage === "result" && renderResultScreen()}
    </div>
  );
}
