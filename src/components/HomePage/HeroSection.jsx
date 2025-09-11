"use client";
import { motion } from "framer-motion";
import HeroImage from "../../assets/banner-image.png";
import Image from "next/image";
import Container from "../shared/Container";
import Link from "next/link";

const textVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function HeroSection() {
  return (
    <section className="bg-white text-black min-h-screen flex items-center">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-10 mt-0 lg:mt-20 px-4">
          {/* Left Side Text */}
          <div className="space-y-6 w-full md:w-1/2">
            {/* Main Heading */}
            <motion.h1
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl font-bold"
            >
              Exchnage Your Skills With{" "}
              <span className="text-red-500">SwapSkill!</span>
            </motion.h1>

            {/* Sub Texts */}
            {[
              "A platform where you exchange skills with others and earn.",
              "Join us today and unlock endless learning opportunities.",
            ].map((text, i) => (
              <motion.p
                key={i}
                custom={i + 1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-lg md:text-xl text-gray-700"
              >
                {text}
              </motion.p>
            ))}

            {/* Buttons */}
            <motion.div
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-4 pt-4"
            >
              <Link href="login">
                <button className="px-6 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition">
                  Join Us
                </button>
              </Link>
              <button className="px-6 py-3 rounded-2xl border border-black text-black hover:bg-black hover:text-white transition">
                See More
              </button>
            </motion.div>
          </div>

          {/* Right Side Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center md:justify-end w-full md:w-1/2"
          >
            <Image
              src={HeroImage}
              alt="hero"
              className="object-contain w-[250px] md:w-[300px] lg:w-[350px]"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
