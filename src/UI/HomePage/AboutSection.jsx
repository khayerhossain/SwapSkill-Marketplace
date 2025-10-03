"use client";
import Container from "@/components/shared/Container";
import Image from "next/image";
import { motion } from "framer-motion";
import AboutImage from "../../assets/about-image.png";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6 },
  }),
};

export default function AboutSection() {
  return (
    <section className="w-full bg-white py-24 flex items-center justify-center">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left side - Full-width Image */}
          <div className="flex justify-center lg:justify-start px-4">
            <div className="w-full max-w-lg rounded-3xl overflow-hidden transition-shadow duration-500">
              <Image
                src={AboutImage}
                alt="About Us"
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6 w-full text-center lg:text-left">
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              About{" "}
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Us
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
              We are a team of{" "}
              <span className="font-semibold text-purple-600">innovators</span>
              dedicated to building a platform where{" "}
              <span className="font-semibold text-blue-600">
                skills meet opportunity
              </span>
              . Our mission is to help everyone turn their talents into
              meaningful connections.
            </p>

            <p className="text-md md:text-lg text-gray-600 max-w-xl">
              Join thousands of learners and professionals transforming their
              expertise into
              <span className="font-semibold text-green-600">
                {" "}
                rewarding opportunities
              </span>
              . Together, we’re shaping a community where growth is unlimited.
            </p>

            {/* Enhanced Stats */}
            {/* it will be dynamic later */}
            <motion.div
              custom={4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center lg:justify-start gap-8 py-4 mt-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div className="text-sm text-gray-500">Skills Available</div>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.9★</div>
                <div className="text-sm text-gray-500">User Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
