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
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
    {
      id: 2,
      title: "Running",
      description:
        "Boost endurance and cardiovascular health while tracking speed and distance.",
      image: "https://i.ibb.co.com/j9ZR690B/running-90.png",
    },
    {
      id: 3,
      title: "Swimming",
      description:
        "Strengthen your whole body and relax your mind while mastering various strokes.",
      image: "https://i.ibb.co.com/PZxVYBf4/swimming-29.png",
    },
    {
      id: 4,
      title: "Writing",
      description:
        "Express ideas clearly through stories, articles, poetry, or reports.",
      image: "https://i.ibb.co.com/yc4nhrX8/hand-writing.png",
    },
  ];

  return (
    <Container>
      <div className="mx-auto px-4 py-20">
        <motion.h2
          className="text-3xl font-bold mb-1 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Popular Skills
        </motion.h2>
        <p className="text-gray-700 text-center mb-16">
          Explore these popular skills that everyone is trying to learn and
          master today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {skillsData.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="relative bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between hover:shadow-lg transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="absolute -top-6 -right-6">
                <img
                  src={skill.image}
                  alt={skill.title}
                  className="w-20 h-20 rounded-full object-contain border-4 border-white shadow-lg bg-gray-100"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <button className="w-full bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default PopularSkills;
