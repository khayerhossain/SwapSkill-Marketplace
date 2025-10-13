"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/shared/Container";

const HeroSection = () => {
  return (
    <section className="w-full bg-background py-12 lg:py-20">
      {/* Full width background */}
      <div className="w-full bg-card shadow-lg">
        <Container>
          {/* Equal height flex layout */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-20 py-12">
            {/* ---------- LEFT CONTENT ---------- */}
            <div className="space-y-8 flex-1 pl-4">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground ">
                  Exchange Your Skills With{" "}
                  <span>
                    <span className="text-pink-500">S</span>
                    <span className="text-purple-500">w</span>
                    <span className="text-indigo-500">a</span>
                    <span className="text-blue-500">p</span>
                    <span className="text-green-500">S</span>
                    <span className="text-yellow-500">k</span>
                    <span className="text-orange-500">i</span>
                    <span className="text-red-500">l</span>
                    <span className="text-rose-600">l</span>
                  </span>
                  !
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-md">
                  A revolutionary platform where you exchange skills with others
                  and earn rewards. SwapSkill lets you showcase your talent,
                  collaborate with learners, and turn your skills into real
                  opportunities for growth and success.
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
                  Join Now
                </button>
                <button className="px-6 py-3 border border-gray-300 bg-white rounded-xl font-medium transition text-black">
                  Learn More
                </button>
              </div>
            </div>

            {/* ---------- RIGHT IMAGE GRID ---------- */}
            <div className="flex-1 flex justify-end items-center">
              <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                {[
                  "https://i.ibb.co.com/wFLb2p50/Gemini-Generated-Image-eanwmheanwmheanw.png",
                  "https://i.ibb.co.com/q34F7pFw/Gemini-Generated-Image-u4wg2iu4wg2iu4wg.png",
                  "https://i.ibb.co.com/8DKTMQ54/Des-webinars-sp-cialements-con-us-pour-les-entrepreneurs-Numbr.jpg",
                  "https://i.ibb.co.com/RTFd75VG/Smart-Professional-Start-Your-Digital-Success-Journey-Today.jpg",
                ].map((src, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="w-full"
                  >
                    <Image
                      src={src}
                      alt={`Hero Image ${index + 1}`}
                      width={200}
                      height={190}
                      className="rounded-2xl shadow-md object-cover w-full h-auto"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default HeroSection;
