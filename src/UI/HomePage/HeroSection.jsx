"use client";
import Container from "@/components/shared/Container";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "Swap Your Skills, Level Up Your Life",
    subtitle: "Connect. Learn. Grow.",
    description:
      "Join a global skill-sharing network where you can teach, learn, and grow with others. Trade your talents, earn points, and unlock new levels on the leaderboard.",
    button: "Get Started",
    bg: "https://i.ibb.co.com/MkvDHWYX/Whats-App-Image-2025-10-18-at-14-33-00-d9c32ec4.jpg",
  },
  {
    id: 2,
    title: "Build Your Network Through Knowledge",
    subtitle: "Chat. Collaborate. Create.",
    description:
      "From live chat to community groups — share your ideas, collaborate with others, and make learning more fun than ever. SwapSkill turns teamwork into success.",
    button: "Join Community",
    bg: "https://i.ibb.co.com/YBMDTBcJ/Whats-App-Image-2025-10-18-at-14-32-35-8e300291.jpg",
  },
  {
    id: 3,
    title: "Earn Points. Gain Respect.",
    subtitle: "Climb the Leaderboard.",
    description:
      "Show off your consistency, creativity, and collaboration. Earn rewards and rise through the ranks as a top skill exchanger in the SwapSkill world.",
    button: "View Leaderboard",
    bg: "https://i.ibb.co.com/QvRGz42J/Whats-App-Image-2025-10-18-at-14-31-57-cb27ed33.jpg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      <Container>
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={slide.bg}
              alt="background"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-white/70 dark:bg-black/70 transition-colors duration-500" />
          </motion.div>
        </AnimatePresence>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col justify-center h-full mt-40 text-center md:text-left">
          <motion.div
            key={slide.id + "-text"}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto md:mx-0"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-black dark:text-white transition-colors duration-500">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-2 text-red-600 dark:text-red-500 font-semibold tracking-wide">
              {slide.subtitle}
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">
              {slide.description}
            </p>
            <button className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition">
              {slide.button}
            </button>
          </motion.div>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                i === current ? "bg-red-600" : "bg-black/40 dark:bg-white/40"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
