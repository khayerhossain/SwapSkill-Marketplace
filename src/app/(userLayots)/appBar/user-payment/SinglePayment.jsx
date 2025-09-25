import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  const COLORS = ["#ef4444", "#27272a"]; // Red for remaining, dark gray for used

  // Glow effect class based on percentage remaining
  const getGlowClass = (percentage) => {
    if (percentage > 50) return "shadow-red-500/50";
    if (percentage > 20) return "shadow-yellow-500/50";
    return "shadow-green-500/50";
  };

  console.log("aaaa", payment.data);

  return (
    <motion.div
      className={` border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between ${getGlowClass(
        percentageRemaining
      )}`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Left Column: Time Left & Progress */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative md:border-r md:border-zinc-800 md:pr-8">
        <h3 className="text-xl font-bold  mb-2 pb-2 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-0.5 after:bg-red-500">
          Time Left
        </h3>
        {timeLeft && (
          <div className="text-center mb-6">
            <p className="text-6xl font-extrabold text-red-500">
              {timeLeft.days}
              <span className="text-2xl font-light text-gray-400">d</span>
            </p>
            <p className="text-sm text-gray-400 font-light mt-1">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </p>
          </div>
        )}

        <div className="w-full h-48 flex-shrink-0 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                paddingAngle={0}
                startAngle={90}
                endAngle={-270}
                animationDuration={1500}
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
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-4xl text-black font-bold">
              {percentageRemaining.toFixed(0)}%
            </p>
            <p className="text-gray-400 text-sm font-light mt-1">remaining</p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Payment Details */}
      <div className="w-full md:w-1/2 flex-1 space-y-4 mt-8 md:mt-0 md:pl-8">
        <h3 className="text-xl font-bold  mb-4 pb-2 relative after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-red-500">
          Payment Details
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <FaBolt className="text-red-500" />
            <p className="">
              Plan:{" "}
              <span className="font-semibold text-red-500">
                {payment.planName}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <FaTag className="text-gray-400" />
            <p className="">
              Price: <span className="font-bold">{payment.price}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <FaCalendarAlt className="text-gray-400" />
            <p className="">
              Date:{" "}
              <span className="font-bold">
                {new Date(payment.date).toLocaleString()}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <FaUserCircle className="text-gray-400" />
            <p className="">
              User Name: <span className="font-bold">{payment.userName}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <FaEnvelope className="text-gray-400" />
            <p className="t">
              Email:{" "}
              <span className="font-bold">{payment.email}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <FaReceipt className="text-gray-400" />
            <p className="">
              Transaction ID:{" "}
              <span className="font-bold">
                {payment.transactionId}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
