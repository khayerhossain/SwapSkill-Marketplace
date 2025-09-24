"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SinglePaymentCard } from "./SinglePayment";

export default function PaymentDetails() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user-payment",
          {}
        );
        console.log("payments PaymentDetails asche", res.data);
        setPayments(res.data?.payments || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
  console.log("data  ", payments);
  if (loading) return <p className="text-white">Loading...</p>;

  if (!payments.length)
    return <p className="text-gray-400">No successful payments found.</p>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 sm:p-8 flex items-center justify-center">
      <motion.div
        className="w-full max-w-4xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-4 text-center pb-5">
          Payment History & Access Timer
        </h2>
        {payments.length > 0 ? (
          payments?.map((payment, index) => (
            <SinglePaymentCard
              key={index}
              payment={payment}
            ></SinglePaymentCard>
          ))
        ) : (
          <p className="text-gray-400 text-center text-lg">
            No payment data available.
          </p>
        )}
      </motion.div>
    </div>
  );
}
