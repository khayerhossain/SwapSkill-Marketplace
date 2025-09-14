"use client";
import Marquee from "react-fast-marquee";
import Container from "../shared/Container";

function SkillMarquee() {
  const marqueeLogo = [
    { logo: "/assets/marquee/coding-5-64.png", skillName: "Coding" },
    { logo: "/assets/marquee/hand-writing.png", skillName: "Hand Writing" },
    { logo: "/assets/marquee/archer.png", skillName: "Archer" },
    { logo: "/assets/marquee/chef-49.png", skillName: "Chef" },
    { logo: "/assets/marquee/Dance.png", skillName: "Dance" },
    { logo: "/assets/marquee/designer-2-69.png", skillName: "Design" },
    { logo: "/assets/marquee/driving.png", skillName: "Driving" },
  ];

  const marqueeLogo2 = [
    { logo: "/assets/marquee/fishing-40.png", skillName: "Fishing" },
    { logo: "/assets/marquee/music-27.png", skillName: "Music" },
    { logo: "/assets/marquee/running-90.png", skillName: "Running" },
    { logo: "/assets/marquee/startup-1-97.png", skillName: "Startup" },
    { logo: "/assets/marquee/swimming-29.png", skillName: "Swimming" },
    { logo: "/assets/marquee/team-work-1-75.png", skillName: "Team Work" },
    { logo: "/assets/marquee/video-call-81.png", skillName: "Video Call" },
  ];

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

        <Marquee gradient={false} speed={75} pauseOnHover loop={0}>
          {marqueeLogo?.map((item, index) => (
            <div
              key={index}
              className="mx-12 flex flex-col items-center py-10  "
            >
              <img
                src={item.logo}
                alt={item.skillName}
                className="  w-25 h-25"
              />
              <h1 className="font-bold">{item.skillName}</h1>
            </div>
          ))}
        </Marquee>
        <Marquee
          direction="right"
          gradient={false}
          speed={75}
          pauseOnHover
          loop={0}
        >
          {marqueeLogo2?.map((item, index) => (
            <div
              key={index}
              className="mx-12 flex flex-col items-center py-10  "
            >
              <img
                src={item.logo}
                alt={item.skillName}
                className=" w-25 h-25"
              />
              <h1 className="font-bold">{item.skillName}</h1>
            </div>
          ))}
        </Marquee>
      </div>
    </Container>
  );
}

export default SkillMarquee;
