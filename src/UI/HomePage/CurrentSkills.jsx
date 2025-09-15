"use client";

import Container from "@/components/shared/Container";

function CurrentSkillsPage() {
  const marqueeLogo = [
    { logo: "/assets/marquee/coding-5-64.png", skillName: "Coding" },
    { logo: "/assets/marquee/hand-writing.png", skillName: "Hand Writing" },
    { logo: "/assets/marquee/archer.png", skillName: "Archer" },
    { logo: "/assets/marquee/chef-49.png", skillName: "Chef" },
    { logo: "/assets/marquee/Dance.png", skillName: "Dance" },
    { logo: "/assets/marquee/designer-2-69.png", skillName: "Design" },
    { logo: "/assets/marquee/driving.png", skillName: "Driving" },
    { logo: "/assets/marquee/fishing-40.png", skillName: "Fishing" },
    { logo: "/assets/marquee/music-27.png", skillName: "Music" },
    { logo: "/assets/marquee/running-90.png", skillName: "Running" },
    { logo: "/assets/marquee/swimming-29.png", skillName: "Swimming" },
    { logo: "/assets/marquee/team-work-1-75.png", skillName: "Team Work" },
  ];

  return (
    <Container>
      <div className="py-10">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Our Skills Overview</h1>
          <p className="md:text-xl text-gray-600">
            A quick look at the diverse skills available from coding and design
            to cooking, music, and more.
          </p>
        </div>

        {/* Static grid layout 2 rows x 6 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-10">
          {marqueeLogo.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white rounded-xl border border-gray-200 shadow-md p-6"
            >
              <img
                src={item.logo}
                alt={item.skillName}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3"
              />
              <h1 className="font-semibold text-sm text-gray-800">
                {item.skillName}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default CurrentSkillsPage;
