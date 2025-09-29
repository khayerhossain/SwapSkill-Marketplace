import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeProvider";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// React Icons Imports
import {
  FaBolt,
  FaCalendarAlt,
  FaEnvelope,
  FaReceipt,
  FaTag,
  FaUserCircle,
} from "react-icons/fa";

// Mock data. In a real application, you would fetch this from an API.

// A separate component to render the redesigned card and chart for each payment
export function SinglePaymentCard({ payment }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const { appliedTheme } = useContext(ThemeContext);
  const isDark = appliedTheme === "dark";

  useEffect(() => {
    // Assuming a 30-day subscription for simplicity
    const subscriptionDuration = 30 * 24 * 60 * 60 * 1000;
    const paymentTimestamp = new Date(payment.date).getTime();
    const expirationTimestamp = paymentTimestamp + subscriptionDuration;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expirationTimestamp - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [payment.date]);

  // Calculate percentage for the chart
  const oneDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor((new Date() - new Date(payment.date)) / oneDay);
  const daysRemaining = Math.max(0, 30 - daysPassed);
  const percentageRemaining = Math.max(0, 100 - (daysPassed / 30) * 100);

  const pieChartData = [
    { name: "Remaining", value: percentageRemaining },
    { name: "Used", value: 100 - percentageRemaining },
  ];

  // Colors for the pie chart
  const COLORS = isDark ? ["#ef4444", "#1f2937"] : ["#ef4444", "#e5e7eb"]; // adjust ring color for theme

  // Glow effect class based on percentage remaining
  const getGlowClass = (percentage) => {
    if (percentage > 50) return "shadow-red-500/50";
    if (percentage > 20) return "shadow-yellow-500/50";
    return "shadow-green-500/50";
  };

  console.log("aaaa", payment.data);

  return (
   <motion.div
  className={`rounded-xl p-4 md:p-6 hover:shadow-lg flex flex-col md:flex-row items-center justify-between transition-all duration-300 hover:border-red-500 ${
    isDark ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border"
  } ${getGlowClass(percentageRemaining)}`}
  whileHover={{ scale: 1.01 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  {/* Left Column */}
  <div className={`w-full md:w-1/2 flex flex-col items-center justify-center relative md:border-r md:pr-6 ${isDark ? "md:border-zinc-700" : "md:border-zinc-200"}`}>
    <h3 className="text-lg font-semibold mb-2 pb-1 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-red-500">
      Time Left
    </h3>
    {timeLeft && (
      <div className="text-center mb-4">
        <p className="text-4xl font-extrabold text-red-500">
          {timeLeft.days}
          <span className="text-lg font-light text-gray-400">d</span>
        </p>
        <p className="text-xs text-gray-400 font-light mt-1">
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      </div>
    )}

    <div className="w-36 h-36 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={60}
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
            animationDuration={1200}
            isAnimationActive={true}
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                stroke="none"
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
          {percentageRemaining.toFixed(0)}%
        </p>
        <p className={`text-xs font-light mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>remaining</p>
      </motion.div>
    </div>
  </div>

  {/* Right Column */}
  <div className="w-full md:w-1/2 flex-1 space-y-3 mt-6 md:mt-0 md:pl-6">
    <h3 className="text-lg font-semibold mb-3 pb-1 relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500">
      Payment Details
    </h3>
    <div className="grid grid-cols-1 gap-2 text-sm">
      <div className="flex items-center space-x-2">
        <FaBolt className="text-red-500" />
        <p>
          Plan: <span className="font-semibold text-red-500">{payment.planName}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <FaTag className="text-gray-400" />
        <p>
          Price: <span className="font-bold">{payment.price}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <FaCalendarAlt className="text-gray-400" />
        <p>
          Date:{" "}
          <span className="font-bold">
            {new Date(payment.date).toLocaleString()}
          </span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <FaUserCircle className="text-gray-400" />
        <p>
          User: <span className="font-bold">{payment.userName}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <FaEnvelope className="text-gray-400" />
        <p>
          Email: <span className="font-bold">{payment.email}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <FaReceipt className="text-gray-400" />
        <p>
          Txn ID: <span className="font-bold">{payment.transactionId}</span>
        </p>
      </div>
    </div>
  </div>
</motion.div>

  );
}
