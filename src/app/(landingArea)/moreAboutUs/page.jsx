"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  Users,
  Rocket,
  HeartHandshake,
  Globe2,
} from "lucide-react";
import Container from "@/components/shared/Container";

const MoreAboutUs = () => {
  const cards = [
    {
      title: "Our Process",
      desc: "We follow a transparent, structured workflow ensuring smooth collaboration between learners and mentors.",
      icon: <Rocket className="w-6 h-6 text-red-500" />,
      points: [
        "Discover and explore verified profiles.",
        "Connect through secure in-app communication.",
        "Learn, share feedback, and grow together.",
      ],
    },
    {
      title: "Community Guidelines",
      desc: "Our users follow a respectful and value-driven system that encourages positivity and authenticity.",
      icon: <Users className="w-6 h-6 text-red-500" />,
      points: [
        "Be kind and professional in all interactions.",
        "Uphold integrity and provide fair reviews.",
        "Report issues responsibly for a safe space.",
      ],
    },
    {
      title: "Key Features",
      desc: "Our platform integrates cutting-edge tools to make your experience seamless and exciting.",
      icon: <Star className="w-6 h-6 text-red-500" />,
      points: [
        "AI-powered matching algorithm.",
        "Real-time scheduling and messaging.",
        "Secure wallet and payment system.",
      ],
    },
    {
      title: "Our Facilities",
      desc: "We offer exclusive features designed for learners and creators to thrive without limits.",
      icon: <HeartHandshake className="w-6 h-6 text-red-500" />,
      points: [
        "24/7 support and active moderation.",
        "Verified trainers and premium sessions.",
        "Interactive community forums.",
      ],
    },
    {
      title: "Our Mission",
      desc: "We aim to create an open space for learning, where skills become a global currency for growth.",
      icon: <Sparkles className="w-6 h-6 text-red-500" />,
      points: [
        "Democratizing access to quality education.",
        "Empowering individuals through mentorship.",
        "Encouraging collaboration over competition.",
      ],
    },
    {
      title: "Our Vision",
      desc: "To become the world’s most trusted skill-exchange network, connecting millions across borders.",
      icon: <Globe2 className="w-6 h-6 text-red-500" />,
      points: [
        "Global accessibility and inclusivity.",
        "Continuous innovation and community support.",
        "Lifelong learning through connection.",
      ],
    },
  ];

  return (
    <section
      id="more-about-us"
      className="relative w-full py-24 text-gray-100 overflow-hidden bg-[#111111]"
    >
      <Container>
        <div className=" mx-auto relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-4">
              <Sparkles className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-red-500">
             <span className="text-white">More</span> About Us
            </h2>
            <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
              We’re a dynamic platform built for growth, collaboration, and
              skill exchange. Learn how we operate, what drives us, and what
              makes our ecosystem truly next-gen.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -6 }}
                transition={{ type: "spring", stiffness: 180 }}
                className="group relative p-8 rounded-3xl border border-[#222]/70 bg-[#1a1a1a]/70 backdrop-blur-lg shadow-md hover:shadow-lg hover:border-red-500/30 transition-all duration-500"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    {card.icon}
                    <h3 className="text-2xl font-semibold text-red-500">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {card.desc}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    {card.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MoreAboutUs;
