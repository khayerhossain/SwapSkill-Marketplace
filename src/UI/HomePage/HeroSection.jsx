"use client";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/shared/Container";
const HeroSection = () => {
  return (
    <section className="bg-background py-12 lg:py-16">
      <div className=" mx-auto">
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <Container>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 px-4">
              {/* LEFT CONTENT */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
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
                    A revolutionary platform where you exchange skills with
                    others and earn rewards. Learn, connect, and grow with
                    passionate people worldwide.
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

              {/* RIGHT IMAGES */}
              {/* ---------- RIGHT COLLAGE IMAGES ---------- */}
              <div className="relative flex-1 flex justify-center items-center mt-16 md:mt-0">
                {/* Top Main Image */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-10 md:left-16 z-30"
                >
                  <Image
                    src="https://i.ibb.co.com/wFLb2p50/Gemini-Generated-Image-eanwmheanwmheanw.png"
                    alt="Main Hero"
                    width={220}
                    height={240}
                    className="rounded-3xl shadow-lg object-cover"
                  />
                </motion.div>

                {/* Second Image */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="absolute top-2 right-0 md:right-6"
                >
                  <Image
                    src="https://i.ibb.co.com/q34F7pFw/Gemini-Generated-Image-u4wg2iu4wg2iu4wg.png"
                    alt="Laptop Girl"
                    width={230}
                    height={230}
                    className="rounded-3xl shadow-md object-cover relative -top-8"
                  />
                </motion.div>

                {/* Third Image */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="absolute bottom-0 left-0 md:left-10 z-10"
                >
                  <Image
                    src="https://i.ibb.co.com/8DKTMQ54/Des-webinars-sp-cialements-con-us-pour-les-entrepreneurs-Numbr.jpg"
                    alt="Student Boy"
                    width={230}
                    height={230}
                    className="rounded-3xl shadow-md object-cover"
                  />
                </motion.div>

                {/* Phone Girl (bottom-right) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute bottom-6 right-4 md:right-16 z-30"
                >
                  <Image
                    src="https://i.ibb.co.com/RTFd75VG/Smart-Professional-Start-Your-Digital-Success-Journey-Today.jpg"
                    alt="Phone Girl"
                    width={210}
                    height={210}
                    className="rounded-3xl shadow-lg object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
