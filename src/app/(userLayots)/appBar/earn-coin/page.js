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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
    setCurrentQuestionIndex(0);

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Earn Coins Quiz 
          </h1>
          <p className="text-gray-400 text-lg">Test your knowledge and earn coins!</p>
        </div>

        <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-600/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Coins className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-500">
              {userData?.coinsEarned ?? "0"} Coins
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-950/30 border-b border-red-600/50">
                  <th className="text-left px-6 py-4 text-white font-bold text-lg">Category</th>
                  <th className="text-center px-6 py-4 text-white font-bold text-lg">Questions</th>
                  <th className="text-center px-6 py-4 text-white font-bold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((quiz, index) => (
                  <tr
                    key={quiz._id}
                    className={`border-b border-red-600/20 hover:bg-red-950/20 transition-colors ${
                      index % 2 === 0 ? 'bg-black/30' : 'bg-black/10'
                    }`}
                  >
                    <td className="px-6 py-5 text-white font-semibold text-lg">
                      {quiz.category}
                    </td>
                    <td className="px-6 py-5 text-center text-gray-400">
                      {quiz.questions?.length || 0}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => loadQuiz(quiz.category)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-red-500/30 inline-flex items-center gap-2"
                      >
                        Start Quiz
                        <Zap className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-950/30 border border-red-500 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );

  const renderWelcomeScreen = () => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Earn Coins Quiz 
          </h1>
          <p className="text-gray-400 text-lg">Test your knowledge and earn coins!</p>
        </div>

        <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-600/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Coins className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-500">
              {userData?.coinsEarned ?? "0"} Coins
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/50 rounded-3xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <Zap className="w-20 h-20 text-red-500" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Ready to Test Your Skills?
          </h2>
          <p className="text-gray-400 text-center mb-10 text-lg">
            Answer 5 questions correctly to earn coins!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-black border border-red-600/30 rounded-2xl p-6 text-center">
              <RxStopwatch className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-xl font-bold text-white mb-1">30 seconds</p>
              <p className="text-gray-400 text-sm">per question</p>
            </div>

            <div className="bg-black border border-red-600/30 rounded-2xl p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-xl font-bold text-white mb-1">Up to 10 coins</p>
              <p className="text-gray-400 text-sm">based on score</p>
            </div>

            <div className="bg-black border border-red-600/30 rounded-2xl p-6 text-center">
              <RefreshCw className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-xl font-bold text-white mb-1">Unlimited tries</p>
              <p className="text-gray-400 text-sm">practice anytime</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-950/30 border border-red-500 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setQuizStage("category")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-12 py-4 rounded-xl transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading />
              ) : (
                "Start Quiz"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    const isAnswered = userAnswers[currentQuestion.id] !== undefined;
    const selectedIndex = userAnswers[currentQuestion.id];

    return (
      <div className="min-h-screen bg-black p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Earn Coins Quiz 
            </h1>
            <p className="text-gray-400 text-lg">Test your knowledge and earn coins!</p>
          </div>

          <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-600/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Coins className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-yellow-500">
                {userData?.coinsEarned ?? "0"} Coins
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/50 rounded-3xl p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-lg">
                Question {currentQuestionIndex + 1} of {NUMBER_OF_QUESTIONS}
              </span>
              <span className="text-red-500 text-xl font-bold">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="w-full bg-black rounded-full h-3 mb-6">
              <div
                className="bg-red-600 h-3 rounded-full transition-all duration-300 shadow-lg shadow-red-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-center mb-8">
              <div className="bg-black border border-red-500 rounded-full px-6 py-3 flex items-center gap-2 shadow-lg shadow-red-500/30">
                <RxStopwatch className="w-6 h-6 text-red-500" />
                <span className="text-red-500 font-bold text-2xl">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}s
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`block bg-black border-2 rounded-xl p-5 cursor-pointer transition-all hover:bg-gray-900 ${
                    selectedIndex === optionIndex
                      ? "border-red-500 bg-red-950/20 shadow-lg shadow-red-500/20"
                      : "border-red-600/30"
                  }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, optionIndex)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg font-medium">{option}</span>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={selectedIndex === optionIndex}
                      onChange={() => {}}
                      className="w-5 h-5 accent-red-600"
                      disabled={isLoading}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={!isAnswered}
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30"
                  disabled={isLoading || answeredCount < NUMBER_OF_QUESTIONS}
                >
                  {isLoading ? <Loading /> : "Submit Quiz"}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-500 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResultScreen = () => {
    if (!resultData) return null;
    const { score, coinsEarned } = resultData;
    const isPerfect = score === NUMBER_OF_QUESTIONS;

    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-black">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Quiz Completed! 🎉
            </h1>
            <p className="text-gray-400 text-lg">Here are your results</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/50 rounded-3xl p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <Trophy className="w-24 h-24 text-yellow-500" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              {isPerfect ? "Perfect Score! " : "Keep practicing! "}
            </h2>

            <p className="text-center mb-8">
              <span className="text-5xl md:text-6xl font-black text-red-500">
                {score}/{NUMBER_OF_QUESTIONS}
              </span>
              <br />
              <span className="text-gray-400 text-lg">Correct Answers</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-black border border-red-600/30 rounded-2xl p-6 text-center">
                <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-4xl font-bold text-yellow-500 mb-1">+{coinsEarned}</p>
                <p className="text-gray-400 text-sm">Coins Earned</p>
              </div>

              <div className="bg-black border border-red-600/30 rounded-2xl p-6 text-center">
                <Zap className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-4xl font-bold text-white mb-1">{userData?.coinsEarned ?? 0}</p>
                <p className="text-gray-400 text-sm">Total Coins</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setQuizStage("category")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-500/30"
              >
                Try Again
              </button>
              <button
                onClick={() => setQuizStage("welcome")}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg px-8 py-3 rounded-xl transition-colors shadow-lg"
              >
                Go to Overview
              </button>
            </div>

            {error && (
              <div className="mt-6 bg-red-950/30 border border-red-500 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      {quizStage === "welcome" && renderWelcomeScreen()}
      {quizStage === "category" && renderCategoryScreen()}
      {quizStage === "quiz" && renderQuiz()}
      {quizStage === "result" && renderResultScreen()}
    </div>
  );
}