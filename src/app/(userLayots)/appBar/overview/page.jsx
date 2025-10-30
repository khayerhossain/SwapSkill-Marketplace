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
import { useSession } from "next-auth/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RLLineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function Overview() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appliedTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState([]);
  const isDark = appliedTheme === "dark";
  const { data: session } = useSession();

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
    if (!session?.user?.email) return; // 

    const fetchData = async () => {
      try {
        const [paymentRes, userRes, skillsRes] = await Promise.all([
          axiosInstance.get("/user-payment"),
          axiosInstance.get("/coin-earn"),
          axiosInstance.get("/current-skills"),
        ]);

        setPayments(paymentRes.data?.payments || []);
        if (userRes.data.success) setUserData(userRes.data.data);

       
        const allSkills = skillsRes.data?.skills || skillsRes.data || [];
        const userSkills = allSkills.filter(
          (skill) => skill?.contactInfo?.email === session?.user?.email
        );
        setSkills(userSkills);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session?.user?.email]);

  const stats = [
    {
      icon: <FaGlobe />,
      color: "from-blue-500 to-blue-700",
      label: "Skills Shared",
      value: skills?.length || 0,
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
          {/* Modern Progress Growth BarChart */}
          <div className={`rounded-xl p-6 border ${isDark ? "bg-[#111111] border-gray-800" : "bg-white border-gray-300"}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Progress Growth</h3>
              <LineChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.progressData}>
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ background: isDark ? '#222' : '#fff', borderRadius: '8px', color: isDark ? '#fff':'#222' }} />
                  <Bar dataKey="progress" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Modern Activity Overview LineChart */}
          <div className={`rounded-xl p-6 border ${isDark ? "bg-[#111111] border-gray-800" : "bg-white border-gray-300"}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Activity Overview</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RLLineChart data={analytics.activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ background: isDark ? '#222' : '#fff', borderRadius: '8px', color: isDark ? '#fff':'#222' }} />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="activity" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                </RLLineChart>
              </ResponsiveContainer>
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
