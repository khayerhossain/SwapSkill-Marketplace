"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
export default function CoinPayment() {
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
    try {
      setLoading(true);

      const payment = {
        planName: planName,
        price: price,
        email: session?.user?.email,
        userName: session?.user?.name,
        transactionId: "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        paymentMethod: "coin",
        date: date.toLocaleString("en-BD", options),
        status: "success",
      };

      const { data } = await axios.post("/api/coin-payment", payment, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Successful! ",
          text: data.message || "Your payment using coins was successful.",
          confirmButtonColor: "#3085d6",
        });

        window.location.href = "/";
      } else {
        Swal.fire({
          icon: "warning",
          title: "Payment Failed!",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Occurred!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong with the payment.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-900 border-yellow-400 rounded-xl shadow-lg p-6 flex flex-col border-2 space-y-4 hover:border-red-500 transition"
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
            {price * 10} coin
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
          className={`mt-6 py-3 w-full rounded-xl font-semibold text-white text-sm transition-all duration-300 cursor-pointer ${
            loading
              ? "bg-yellow-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400"
          }`}
        >
          {loading ? "Processing..." : `   Pay Now  💰${price * 10} `}
        </motion.button>
      </motion.div>
    </div>
  );
}
