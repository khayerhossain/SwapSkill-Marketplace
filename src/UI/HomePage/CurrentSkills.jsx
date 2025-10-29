"use client";

import { Badge } from "@/components/Badge";
import Container from "@/components/shared/Container";
import { motion } from "framer-motion";

const skillsData = [
  {
    name: "Coding",
    logo: "/assets/marquee/coding-5-64.png",
    students: "15.2k",
    subSkills: ["JavaScript", "Python", "React"],
  },
  {
    name: "Hand Writing",
    logo: "/assets/marquee/hand-writing.png",
    students: "9.8k",
    subSkills: ["Cursive", "Calligraphy", "Note Taking"],
  },
  {
    name: "Archer",
    logo: "/assets/marquee/archer.png",
    students: "6.3k",
    subSkills: ["Bow", "Crossbow", "Target Practice"],
  },
  {
    name: "Chef",
    logo: "/assets/marquee/chef-49.png",
    students: "8.4k",
    subSkills: ["Cooking", "Baking", "Food Styling"],
  },
  {
    name: "Dance",
    logo: "/assets/marquee/Dance.png",
    students: "7.9k",
    subSkills: ["Hip Hop", "Ballet", "Salsa"],
  },
  {
    name: "Design",
    logo: "/assets/marquee/designer-2-69.png",
    students: "12.8k",
    subSkills: ["UI/UX", "Graphic Design", "Figma"],
  },
  {
    name: "Driving",
    logo: "/assets/marquee/driving.png",
    students: "5.4k",
    subSkills: ["Car", "Bike", "Truck"],
  },
  {
    name: "Music",
    logo: "/assets/marquee/music-27.png",
    students: "6.7k",
    subSkills: ["Piano", "Guitar", "Music Theory"],
  },
];

export default function CurrentSkillsPage() {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#1a1a1a]">
      {/* ✨ Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

      <Container>
        {/* Title Section */}
        <div className="relative z-10 text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Discover{" "}
            <span className="bg-red-500 bg-clip-text text-transparent">
              Skill Categories
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore trending skills and connect with passionate learners &
            mentors from around the world.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {skillsData.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 hover:scale-[1.03] transition-all duration-500 shadow-lg shadow-black/30"
            >
              {/* Top Row */}
              <div className="flex justify-between items-center mb-5">
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-xs font-medium text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {skill.students} students
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-white mb-3">
                {skill.name}
              </h2>

              {/* Subskills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.subSkills.map((s, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-gray-300 border-white/20 hover:border-red-500/40 transition"
                  >
                    {s}
                  </Badge>
                ))}
              </div>

              {/* Bottom info */}
              <p className="text-sm text-gray-500">
                More skills coming soon...
              </p>

              {/* Glow border animation */}
              <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-red-500/20 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}


