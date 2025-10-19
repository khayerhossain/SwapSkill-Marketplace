"use client";
import Container from "@/components/shared/Container";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaGlobeAmericas,
  FaLightbulb,
  FaUsers,
} from "react-icons/fa";

export default function WhyChooseUs() {
  const cards = [
    {
      icon: <FaChalkboardTeacher className="text-4xl text-indigo-400 mb-5" />,
      title: "Learn by Teaching",
      desc: "Share what you know and discover what you don’t. Every session helps you grow faster and smarter.",
      delay: 0.2,
    },
    {
      icon: <FaGlobeAmericas className="text-4xl text-emerald-400 mb-5" />,
      title: "Global Skill Exchange",
      desc: "Collaborate with people across the world and gain fresh perspectives with every swap.",
      delay: 0.4,
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-400 mb-5" />,
      title: "Ignite Your Potential",
      desc: "Step into a cycle of learning that inspires creativity, curiosity, and self-improvement.",
      delay: 0.6,
    },
    {
      icon: <FaUsers className="text-4xl text-pink-400 mb-5" />,
      title: "Supportive Community",
      desc: "Join a community that uplifts you, celebrates your wins, and helps you achieve more together.",
      delay: 0.8,
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-gray-200 overflow-hidden">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Why <span className="text-indigo-400">Skill Swap</span> Stands Out
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Not just a platform — it’s a movement where skills meet passion and
            learners become teachers.npm
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              {card.icon}
              <h3 className="text-xl font-semibold mb-3 text-white">
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Subtle gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
    </section>
  );
}
