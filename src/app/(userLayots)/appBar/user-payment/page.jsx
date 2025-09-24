"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { SinglePaymentCard } from "./SinglePayment";
export default function PaymentDetails() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user-payment");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPayments(data.payments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
  console.log("payments PaymentDetails asche", payments);

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
         Payment History &  Access Timer
        </h2>
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <SinglePaymentCard key={index} payment={payment} />
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
