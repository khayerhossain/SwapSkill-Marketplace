"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
export default function Checkout() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const planName = searchParams.get("name");
  const price = searchParams.get("price");

  const date = new Date();
  const options = {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  async function handlePay() {
    setLoading(true);

    const payment = {
      planName: planName,
      price: price,
      email: session?.user?.email,
      userName: session?.user?.name,
      transactionId: "",
      date: date.toLocaleString("en-BD", options),
      status: "pending",
    };
    const res = await fetch("/api/sslcommerz/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });

    const response = await res.json();
    console.log(response);

    if (response?.getewayUrl) {
      window.location.href = response?.getewayUrl;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-900 border-white rounded-xl shadow-lg p-6 flex flex-col border-2 space-y-4 hover:border-red-500 transition"
      >
        <h1 className="text-3xl font-bold text-center border-b py-3 text-white mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <span className="text-gray-400 font-medium">Plan Name:</span>
          <span className="text-white font-semibold text-lg text-red-500">
            {planName}
          </span>

          <span className="text-gray-400 font-medium">Price:</span>
          <span className="text-white font-semibold text-lg text-red-500">
            {price}
          </span>

          <span className="text-gray-400 font-medium">User Name:</span>
          <span className="text-gray-400">{session?.user?.name}</span>

          <span className="text-gray-400 font-medium">Email:</span>
          <span className="text-gray-400">{session?.user?.email}</span>

          <span className="text-gray-400 font-medium">Date & Time:</span>
          <span className="text-gray-400">
            {date.toLocaleString("en-BD", options)}
          </span>
        </div>

        <motion.button
          onClick={handlePay}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-6 py-3 w-full rounded-xl font-semibold text-white text-sm transition-all duration-300 ${
            loading
              ? "bg-red-800 cursor-not-allowed"
              : "bg-red-700 hover:bg-red-600"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </motion.button>
      </motion.div>
    </div>
  );
}
