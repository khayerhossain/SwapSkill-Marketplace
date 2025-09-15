"use client";

import Container from "@/components/shared/Container";
import AOS from "aos";
import "aos/dist/aos.css";
import Marquee from "react-fast-marquee";

function SkillMarquee() {
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
    { logo: "/assets/marquee/startup-1-97.png", skillName: "Startup" },
    { logo: "/assets/marquee/swimming-29.png", skillName: "Swimming" },
    { logo: "/assets/marquee/team-work-1-75.png", skillName: "Team Work" },
    { logo: "/assets/marquee/video-call-81.png", skillName: "Video Call" },
  ];

  AOS.init({
    duration: 2000,
    once: false,
  });

  return (
   <Container> 


     <div className="py-10">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Our Skill Universe</h1>
          <p className="md:text-xl">
            Showcasing every skill we offer — explore and find the one that
            suits you best
          </p>
        </div>

        <Marquee gradient={false} speed={100} loop={0}>
          {marqueeLogo?.map((item, index) => (
            <div className="py-10">
              <div
                data-aos="flip-right"
                key={index}
                className="mx-4 sm:mx-8 md:mx-12 flex flex-col items-center py-8 px-6 
             bg-white rounded-2xl border border-purple-400 shadow-lg shadow-purple-600
             hover:shadow-2xl hover:scale-105 hover:border-purple-400
             transition-all duration-300 ease-in-out mt-10"
              >
                <img
                  src={item.logo}
                  alt={item.skillName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4"
                />
                <h1 className="font-bold text-xs tracking-wide text-gray-800 hover:text-purple-600 transition-colors">
                  {item.skillName}
                </h1>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
   </Container>
  );
}

export default SkillMarquee;
