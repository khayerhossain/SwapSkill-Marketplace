"use client";
import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";

const PopularSkills = () => {
  const skillsData = [
    {
      id: 1,
      title: "Coding",
      description:
        "Build software, apps, and algorithms while solving complex logic challenges.",
      image: "https://i.ibb.co/R42ZQRkn/coding-5-64.png",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      title: "Running",
      description:
        "Boost endurance and cardiovascular health while tracking speed and distance.",
      image: "https://i.ibb.co/j9ZR690B/running-90.png",
      color: "from-pink-500 to-rose-400",
    },
    {
      id: 3,
      title: "Swimming",
      description:
        "Strengthen your whole body and relax your mind while mastering various strokes.",
      image: "https://i.ibb.co/PZxVYBf4/swimming-29.png",
      color: "from-sky-500 to-teal-400",
    },
    {
      id: 4,
      title: "Writing",
      description:
        "Express ideas clearly through stories, articles, poetry, or reports.",
      image: "https://i.ibb.co/yc4nhrX8/hand-writing.png",
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-gray-200 overflow-hidden">
      <Container>
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Popular <span className="text-red-500">Skills</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore trending skills that are shaping the world — level up, share
            your passion, and inspire others.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillsData.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/10 hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Icon */}
              <div
                className={`w-20 h-20 mb-5 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-lg shadow-black/30`}
              >
                <img
                  src={skill.image}
                  alt={skill.title}
                  className="w-10 h-10 object-contain drop-shadow-md"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-white">
                {skill.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {skill.description}
              </p>

              {/* Button */}
              <button className="bg-black/60 text-white text-sm font-medium px-12 py-2 rounded-xl cursor-pointer">
                View More
              </button>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Soft glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default PopularSkills;
