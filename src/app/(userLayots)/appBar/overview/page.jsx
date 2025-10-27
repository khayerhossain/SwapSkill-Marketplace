"use client";

import Container from "@/components/shared/Container";
import { ThemeContext } from "@/context/ThemeProvider";
import axiosInstance from "@/lib/axiosInstance";
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
        const res = await axiosInstance.get("/api/user-payment");
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
        const res = await axiosInstance.get("/api/coin-earn");
        if (res.data.success) setUserData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);


  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 bg-black/60 ${
        isDark ? "bg-[#111111] text-white" : ""
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
            color: "text-blue-400",
            label: "Skills Shared",
            value: "25",
          },
          {
            icon: <FaBook />,
            color: "text-green-400",
            label: "Skills Booked",
            value: payments.length,
          },
          {
            icon: <FaCoins />,
            color: "text-yellow-400",
            label: "Earning Points",
            value: userData?.coinsEarned || 0,
          },
          {
            icon: <FaClock />,
            color: "text-purple-400",
            label: "Overall Progress",
            value: "75%",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="relative p-5 flex flex-col items-center justify-center rounded-2xl border border-gray-700 bg-black backdrop-blur-md"
          >
            <div className={`z-10 text-3xl mb-2 ${item.color}`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <div className="rounded-2xl p-6 mb-10 border border-gray-700 bg-black/50 backdrop-blur-md text-white">
        <h2 className="text-lg font-semibold mb-5 text-center">
          Your Achievements
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 font-semibold text-sm">
            <FaTrophy /> Pro Learner
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 font-semibold text-sm">
            <FaTrophy /> Master Mentor
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 backdrop-blur-md  text-gray-300 font-semibold text-sm">
            <FaLock /> Top Contributor
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="rounded-2xl p-6 border border-gray-700 bg-black/50 backdrop-blur-md text-white">
        <h2 className="text-xl font-bold text-center mb-6">
          Subscription Details
        </h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading payments...</p>
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
    </div>
  );
}
