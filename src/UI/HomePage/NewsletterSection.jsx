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
        setMessage("🎉 Subscribed successfully!");
        setEmail("");
      } else {
        setMessage("Subscription failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-28 bg-[#0b0c10] text-white overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10"
        >
          {/* Left Side */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Subscribe to our <span className="text-red-500">Newsletter</span>
            </h2>

            <p className="text-gray-300 mb-8 text-lg">
              Get exclusive offers, the latest updates, and new opportunities
              delivered right to your inbox.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-2/3 bg-white/10 placeholder-gray-400 text-white px-5 py-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg transition"
              />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </form>

            {message && <p className="mt-5 text-sm text-gray-300">{message}</p>}
          </motion.div>

          {/* Right Side (Blended Image) */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 flex justify-center relative"
          >
            {/* Soft Glow Behind Image */}
            <div className="absolute -bottom-4 w-[300px] h-[300px] bg-red-500/20 blur-[80px] rounded-full"></div>

            <motion.img
              src="https://i.ibb.co.com/B5RW7znv/transparent-Photoroom-6.png"
              alt="Newsletter illustration"
              className="relative w-80 md:w-[450px] object-contain rounded-lg"
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
