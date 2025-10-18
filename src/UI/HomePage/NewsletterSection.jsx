"use client";
import Container from "@/components/shared/Container";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/subscribers", { email });
      if (res.data?.success) {
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        setMessage("Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#111111] text-gray-200 overflow-hidden">
      <Container>
        <div className=" mx-auto relative z-10">
          {/* Glass card */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-12 md:p-16 text-center">
            {/* Rocket icon */}
            <div className="flex justify-center mb-6">
              <svg
                width="200"
                height="80"
                viewBox="0 0 240 80"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <path
                  d="M10 60 C80 10, 160 10, 230 40"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <g transform="translate(210,22) rotate(-10)">
                  <path d="M2 10 L28 0 L18 30 L10 22 L2 10 Z" fill="#EF4444" />
                  <path d="M2 10 L10 22 L12 14 Z" fill="#B91C1C" />
                  <circle cx="16" cy="12" r="2" fill="#fff" />
                </g>
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-red-500 mb-3">
              SUBSCRIBE<span className="text-white">.</span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Get the latest updates and offers delivered straight to your inbox.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center"
            >
              <div className="w-full sm:w-2/3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/20 placeholder-gray-400 text-white px-4 py-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "SUBSCRIBE"}
              </motion.button>
            </form>

            {message && (
              <p className="mt-6 text-sm text-gray-300">{message}</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
