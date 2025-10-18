"use client";

import Container from "@/components/shared/Container";
import { ThemeContext } from "@/context/ThemeProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  FaBook,
  FaClock,
  FaCoins,
  FaGlobe,
  FaLock,
  FaTrophy,
} from "react-icons/fa";
import { SinglePaymentCard } from "./SinglePayment";

export default function Overview() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appliedTheme } = useContext(ThemeContext);
  const isDark = appliedTheme === "dark";
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user-payment");
        setPayments(res.data?.payments || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/coin-earn");
        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <Container>
      <div
        className={`min-h-screen p-6 transition-colors duration-300 ${
          isDark
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
        }`}
      >
        {/* 🌟 Header */}
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-tight">
          Your Dashboard Overview
        </h1>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              icon: <FaGlobe />,
              color: "text-blue-500",
              label: "Skills Shared",
              value: "25",
            },
            {
              icon: <FaBook />,
              color: "text-green-500",
              label: "Skills Booked",
              value: payments.length,
            },
            {
              icon: <FaCoins />,
              color: "text-yellow-500",
              label: "Earning Points",
              value: userData?.coinsEarned || 0,
            },
            {
              icon: <FaClock />,
              color: "text-purple-500",
              label: "Overall Progress",
              value: "75%",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-5 flex flex-col items-center justify-center shadow`}
            >
              <div className={`z-10 text-3xl mb-2 ${item.color}`}>
                {item.icon}
              </div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 🏅 Badges Section */}
        <div
          className={`${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } rounded-2xl p-6 shadow border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } mb-10`}
        >
          <h2 className="text-lg font-semibold mb-5 text-center">
            Your Achievements
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Earned Badges */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm shadow-md">
              <FaTrophy /> Pro Learner
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-sm shadow-md">
              <FaTrophy /> Master Mentor
            </div>

            {/* Locked Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-300 font-semibold text-sm shadow-inner">
              <FaLock /> Top Contributor
            </div>
          </div>
        </div>

        {/* 💳 Subscription Details */}
        <div
          className={`${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } rounded-2xl p-6 border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`} // ← removed shadow + hover shadow here
        >
          <h2 className="text-xl font-bold text-center mb-6">
            Subscription Details
          </h2>

          {loading ? (
            <p
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Loading payments...
            </p>
          ) : payments.length === 0 ? (
            <p
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
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
      </div>
    </Container>
  );
}
