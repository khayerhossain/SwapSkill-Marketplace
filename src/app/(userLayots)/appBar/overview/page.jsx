"use client";

import Container from "@/components/shared/Container";
import { ThemeContext } from "@/context/ThemeProvider";
import axiosInstance from "@/lib/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { FaBook, FaClock, FaCoins, FaGlobe, FaTrophy } from "react-icons/fa";
import { LineChart, Activity } from "lucide-react";
import { SinglePaymentCard } from "./SinglePayment";
import Loading from "@/app/loading";
import { motion } from "framer-motion";

export default function Overview() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appliedTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const isDark = appliedTheme === "dark";

  // Demo analytics data
  const analytics = {
    progressData: [
      { week: "W1", progress: 30 },
      { week: "W2", progress: 45 },
      { week: "W3", progress: 55 },
      { week: "W4", progress: 70 },
      { week: "W5", progress: 90 },
    ],
    activityData: [
      { day: "Mon", activity: 5 },
      { day: "Tue", activity: 8 },
      { day: "Wed", activity: 6 },
      { day: "Thu", activity: 9 },
      { day: "Fri", activity: 7 },
      { day: "Sat", activity: 10 },
      { day: "Sun", activity: 4 },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentRes, userRes] = await Promise.all([
          axiosInstance.get("/api/user-payment"),
          axiosInstance.get("/api/coin-earn"),
        ]);
        setPayments(paymentRes.data?.payments || []);
        if (userRes.data.success) setUserData(userRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      icon: <FaGlobe />,
      color: "from-blue-500 to-blue-700",
      label: "Skills Shared",
      value: userData?.skillsShared || 0,
    },
    {
      icon: <FaBook />,
      color: "from-green-500 to-green-700",
      label: "Skills Booked",
      value: payments.length,
    },
    {
      icon: <FaCoins />,
      color: "from-yellow-400 to-amber-500",
      label: "Earning Points",
      value: userData?.coinsEarned || 0,
    },
    {
      icon: <FaClock />,
      color: "from-purple-500 to-indigo-600",
      label: "Overall Progress",
      value: `${userData?.progress || 0}%`,
    },
  ];

  return (
    <div
      className={`min-h-screen mt-2 transition-colors duration-300 overflow-y-auto scrollbar-hide ${
        isDark ? "bg-[#0d0d0d] text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Container>
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center mb-10 tracking-tight bg-clip-text text-red-500">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 flex flex-col items-center justify-center rounded-2xl border border-gray-700 shadow-lg bg-gradient-to-br ${item.color} bg-opacity-10 backdrop-blur-md hover:scale-105 hover:shadow-xl transition-transform`}
            >
              <div className="z-10 text-3xl mb-2 text-white drop-shadow-lg">
                {item.icon}
              </div>
              <p className="text-sm opacity-80">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* === Progress & Activity Charts === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Progress Chart */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-[#111111] border-gray-800"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Progress Growth</h3>
              <LineChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2 overflow-x-auto scrollbar-hide">
              {analytics.progressData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.progress / 100) * 200}px` }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t w-8 mb-2 transition-all duration-500"></div>
                  <span className="text-xs text-gray-400">{item.week}</span>
                  <span className="text-xs text-gray-300">
                    {item.progress}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-[#111111] border-gray-800"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Activity Overview</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2 overflow-x-auto scrollbar-hide">
              {analytics.activityData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.activity / 10) * 200}px` }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-gradient-to-t from-emerald-500 to-lime-400 rounded-t w-8 mb-2 transition-all duration-500"></div>
                  <span className="text-xs text-gray-400">{item.day}</span>
                  <span className="text-xs text-gray-300">{item.activity}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div
          className={`rounded-2xl p-6 mb-12 border ${
            isDark ? "border-gray-700 bg-[#151515]" : "border-gray-300 bg-white"
          } backdrop-blur-md`}
        >
          <h2 className="text-xl font-semibold mb-6 text-center text-red-500">
            Your Achievements
          </h2>

          {userData?.achievements?.length ? (
            <div className="flex flex-wrap justify-center gap-4">
              {userData.achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-sm shadow-md`}
                >
                  <FaTrophy /> {ach}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No achievements yet.</p>
          )}
        </div>

        {/* Subscription Details */}
        <div
          className={`rounded-2xl p-6 border ${
            isDark ? "border-gray-700 bg-[#151515]" : "border-gray-300 bg-white"
          } backdrop-blur-md`}
        >
          <h2 className="text-xl font-bold text-center mb-6 text-red-500">
            Subscription Details
          </h2>

          {loading ? (
            <Loading />
          ) : payments.length === 0 ? (
            <p className="text-center text-gray-400">
              No payment data available.
            </p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <SinglePaymentCard key={index} payment={payment} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
