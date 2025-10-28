"use client";
import Container from "@/components/shared/Container";
import Image from "next/image";
import { motion } from "framer-motion";
import AboutImage from "../../assets/about-image.png";
import AboutSectionStats from "@/app/(landingArea)/AboutSectionStats/AboutSectionStats";
import Head from "next/head";

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
    <section className="relative w-full py-24 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-gray-200">
      {/*  Subtle glow overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
      <Container>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full z-10">
          {/*  Left Side - Image */}
          <div className="flex justify-center lg:justify-start px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-lg rounded-3xl overflow-hidden "
            >
              <Image
                src={AboutImage}
                alt="About Us"
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                priority
              />
            </motion.div>
          </div>

          {/*  Right Side - Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 w-full text-center lg:text-left"
          >
            <motion.h2
              custom={1}
              variants={textVariants}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-white"
            >
              About{" "}
              <span className="bg-red-500 bg-clip-text text-transparent">
                Us
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={textVariants}
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              We are a team of{" "}
              <span className="font-semibold text-gray-100">innovators</span>{" "}
              dedicated to building a platform where{" "}
              <span className="font-semibold text-gray-200">
                skills meet opportunity
              </span>
              . Our mission is to help everyone turn their talents into
              meaningful connections.
            </motion.p>

            <motion.p
              custom={3}
              variants={textVariants}
              className="text-md md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0"
            >
              Join thousands of learners and professionals transforming their
              expertise into{" "}
              <span className="font-semibold text-gray-200">
                rewarding opportunities
              </span>
              . Together, we’re shaping a community where growth is unlimited.
            </motion.p>

            {/*  Stats Section */}
            <AboutSectionStats />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
