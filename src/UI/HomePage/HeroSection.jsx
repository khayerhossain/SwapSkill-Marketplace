"use client";
import Chatbot from "@/app/(landingArea)/chatbot/chat";
import Container from "@/components/shared/Container";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    subtag: "Popular Courses",
    title: "Grow Through Skills <span class='text-red-500'>Life</span>",
    description: "Join a global network to teach, learn, and grow. Trade talents and unlock new levels.",
    buttonPrimary: "Get Started",
    buttonSecondary: "More Info",
    image: "https://i.ibb.co.com/YBGRD23h/Inspirac-a-o-de-Marketing-Sorriso-Genui-no-e-Uso-de-Celular-para-Campanhas-de-Apps-Photoroom.png",
  },
  {
    id: 2,
    subtag: "Community Growth",
    title: "Share & <span class='text-red-500'>Grow</span>",
    description: "Share ideas, collaborate, and make learning fun. SwapSkill turns teamwork into success.",
    buttonPrimary: "Join Now",
    buttonSecondary: "Features",
    image: "https://i.ibb.co.com/nsNBgtzy/A-Happy-Cheerful-Lady-On-Casual-Outfit-In-A-Studio-Premium-aesthetic-Image-Photoroom.png",
  },
  {
    id: 3,
    subtag: "Rewards",
    title: "Earn Points. Gain <span class='text-red-500'>Respect.</span>",
    description: "rise through the ranks as a top skill exchanger. Earn rewards for your consistency.",
    buttonPrimary: "Explore",
    buttonSecondary: "Leaderboard",
    image: "https://i.ibb.co.com/x8C2KJJY/Smiling-Young-Man-Comfortably-Working-on-Laptop-in-Relaxed-Setting-Photoroom.png",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[95vh] md:h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full border border-white/10 animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-red-500/10 to-transparent blur-3xl opacity-50" />
      </div>

      <Container className="h-full">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full pt-20 lg:pt-0">
          {/* Left Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-content"}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
              >
                <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 block drop-shadow-sm">
                  {slide.subtag}
                </span>
                <h1 
                  className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] mb-8"
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                />
                <p className="text-gray-400 text-lg md:text-xl xl:text-2xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                  {slide.description}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                  <button className="group bg-red-600 hover:bg-red-700 text-white font-extrabold px-10 py-5 rounded-md text-lg md:text-xl uppercase tracking-wider transition-all duration-500 shadow-[0_20px_40px_rgba(220,38,38,0.2)] hover:shadow-[0_20px_50px_rgba(220,38,38,0.4)] flex items-center gap-3 active:scale-95 border border-red-500/20">
                    {slide.buttonPrimary}
                    <FiArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-5 rounded-md text-lg md:text-xl uppercase tracking-wider transition-all duration-500 shadow-xl active:scale-95 border border-white/10 backdrop-blur-md">
                    {slide.buttonSecondary}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Image */}
          <div className="relative h-full flex items-center justify-center order-1 lg:order-2 overflow-hidden py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-image"}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1.1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2, y: -30 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-[400px] md:h-[600px] lg:h-[800px] flex items-center justify-center transform lg:translate-x-10"
              >
                {/* Visual Accent behind image */}
                <div className="absolute w-[100%] h-[100%] bg-red-600/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute w-[70%] h-[70%] bg-yellow-500/5 rounded-full blur-[100px] -bottom-10 -right-10" />
                
                <Image
                  src={slide.image}
                  alt="hero image"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-4 hidden md:flex items-center z-30">
          <button 
            onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="p-3 text-white/30 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 hidden md:flex items-center z-30">
          <button 
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="p-3 text-white/30 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-red-500 w-8" : "bg-white/20 w-3 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <Chatbot />
      </Container>
    </section>
  );
}
