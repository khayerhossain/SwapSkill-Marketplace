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
  const { theme, appliedTheme } = useContext(ThemeContext);
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
      setLoading(false); // Set loading while fetching user data
      try {
        const res = await axios.get("/api/coin-earn");
        if (res.data.success) {
          setUserData(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch user data");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
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
          isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* User Overview Section */}
        <h1 className="text-2xl font-bold text-center mb-6">User Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`${
              isDark
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border"
            } shadow rounded-xl p-4 flex flex-col items-center`}
          >
            <FaGlobe className="text-blue-500 text-2xl mb-2" />
            <p className="text-sm">Skills Shared</p>
            <p className="text-xl font-bold">25</p>
          </div>

          <div
            className={`${
              isDark
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border"
            } shadow rounded-xl p-4 flex flex-col items-center`}
          >
            <FaBook className="text-green-500 text-2xl mb-2" />
            <p className="text-sm">Skills Booked</p>
            <p className="text-xl font-bold">{payments.length}</p>
          </div>

          <div
            className={`${
              isDark
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border"
            } shadow rounded-xl p-4 flex flex-col items-center`}
          >
            <FaCoins className="text-yellow-500 text-2xl mb-2" />
            <p className="text-sm">Earning Points</p>
            <p className="text-xl font-bold">{userData?.coinsEarned}</p>
          </div>

          <div
            className={`${
              isDark
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border"
            } shadow rounded-xl p-4 flex flex-col items-center`}
          >
            <FaClock className="text-purple-500 text-2xl mb-2" />
            <p className="text-sm">Overall Progress</p>
            <p className="text-xl font-bold">75%</p>
          </div>
        </div>

        {/* Badges Section */}
        <div
          className={`${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } rounded-xl p-4 shadow mb-6`}
        >
          <h2 className="text-lg font-semibold mb-3">Your Badges</h2>
          <div className="flex flex-wrap gap-3">
            {/* Earned badge */}
            <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm">
              <FaTrophy /> Pro Learner
            </div>
            {/* Locked badge */}
            <div className="flex items-center gap-2 bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-sm">
              <FaLock /> Top Contributor
            </div>
            {/* Earned badge */}
            <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm">
              <FaTrophy /> Master Mentor
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <h2 className="text-xl font-bold text-center mb-4">
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
            {payments?.map((payment, index) => (
              <SinglePaymentCard key={index} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
