"use client";
import React from "react";
import { motion } from "framer-motion";

const PopularSkills = () => {
  const skillsData = [
    {
      id: 1,
      title: "Coding",
      description: "Develop software, algorithms, and apps. Solve complex logic problems.",
      image: "https://i.ibb.co.com/PzTQG1wd/images.jpg",
    },
    {
      id: 2,
      title: "Running",
      description: "Improve endurance, cardiovascular health. Track distance and speed.",
      image: "https://i.ibb.co.com/HTrxXHxP/download-2.jpg",
    },
    {
      id: 3,
      title: "Swimming",
      description: "Full-body exercise, build strength, relax mind. Learn different strokes.",
      image: "https://i.ibb.co.com/d4gN1C4f/download-3.jpg",
    },
    {
      id: 4,
      title: "Writing",
      description: "Create stories, articles, reports, expert, poetry. Express ideas clearly.",
      image: "https://i.ibb.co.com/SXHvy0xV/pngtree-3d-cartoon-kid-reading-book-on-white-background-png-image-12495623.png",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 bg-gray-50">
      {/* Motion Title */}
      <motion.h2
        className="text-3xl font-bold mb-16 text-center "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Popular Skills
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {skillsData.map((skill, index) => (
          <motion.div
            key={skill.id}
            className="relative bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between hover:shadow-lg transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {/* Right Side Image */}
            <div className="absolute -top-6 -right-6">
              <img
                src={skill.image}
                alt={skill.title}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center mb-16">
                <h3 className="text-lg font-bold text-gray-900">{skill.title}</h3>
              </div>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{skill.description}</p>
            </div>

            {/* Footer: Only Details Button */}
            <div className="flex justify-end mt-auto">
              <button className="bg-purple-100 border border-purple-300 text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-purple-200 transition-colors">
                Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularSkills;
