"use client";

import { Badge } from "@/components/Badge";
import Container from "@/components/shared/Container";

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
    name: "Fishing",
    logo: "/assets/marquee/fishing-40.png",
    students: "6.2k",
    subSkills: ["River", "Sea", "Fly Fishing"],
  },
  {
    name: "Music",
    logo: "/assets/marquee/music-27.png",
    students: "6.7k",
    subSkills: ["Piano", "Guitar", "Music Theory"],
  },
  {
    name: "Running",
    logo: "/assets/marquee/running-90.png",
    students: "4.9k",
    subSkills: ["Sprint", "Marathon", "Relay"],
  },
  {
    name: "Swimming",
    logo: "/assets/marquee/swimming-29.png",
    students: "5.1k",
    subSkills: ["Freestyle", "Butterfly", "Backstroke"],
  },
  {
    name: "Team Work",
    logo: "/assets/marquee/team-work-1-75.png",
    students: "7.5k",
    subSkills: ["Collaboration", "Leadership", "Communication"],
  },
];

export default function CurrentSkillsPage() {
  return (
    <Container>
      <div className="py-14">
        {/* Title */}
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <h1 className="text-4xl font-bold text-base-content">
            Explore <span className="text-red-500">Skill Categories</span>
          </h1>
          <p className="text-base-content/70">
            Browse through a variety of popular skill categories and connect with
            expert tutors ready to help you grow.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className="relative bg-base-100 border border-base-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              {/* Top row */}
              <div className="flex justify-between items-center mb-4">
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="bg-base-200 text-base-content text-xs px-3 py-1 rounded-full">
                  {skill.students} students
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-base-content mb-3">
                {skill.name}
              </h2>

              {/* Subskills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {skill.subSkills.slice(0, 3).map((s, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-base-content border-base-300"
                  >
                    {s}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="text-base-content/60 border-base-300"
                >
                  +2
                </Badge>
              </div>

              {/* Footer */}
              <p className="text-sm text-base-content/70">
                5 skills available
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
