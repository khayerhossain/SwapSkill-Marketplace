"use client";
import { motion } from "framer-motion";
import HeroImage from "../../assets/banner-image.png";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";


const textVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  }),
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          variants={gradientVariants}
          animate="animate"
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ backgroundSize: "200% 200%" }}
        />
        <motion.div
          variants={gradientVariants}
          animate="animate"
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ backgroundSize: "200% 200%" }}
        />
        <motion.div
          variants={gradientVariants}
          animate="animate"
          className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <Container>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full gap-16 mt-0 lg:mt-20 px-4 ">
          {/* Left Side Text */}
          <div className="space-y-7 w-full md:w-1/2">
            {/* Main Heading with Gradient Text */}
            <motion.h1
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-5xl lg:text-5xl font-bold leading-tight"
            >
              Exchange Your Skills With{" "}
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                SwapSkill!
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-xl md:text-xl text-gray-600 leading-relaxed max-w-lg"
            >
              A revolutionary platform where you{" "}
              <span className="font-semibold text-purple-600">
                exchange skills
              </span>{" "}
              with others and{" "}
              <span className="font-semibold text-green-600">earn rewards</span>
              .
            </motion.p>

            <motion.p
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-lg text-gray-500 max-w-lg"
            >
              Join thousands of learners and unlock endless opportunities to
              grow, connect, and monetize your expertise.
            </motion.p>

            {/* Enhanced Stats */}
            {/* that will be enabled in future */}
            {/* <motion.div
              custom={4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-8 py-4"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div className="text-sm text-gray-500">Skills Available</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.9★</div>
                <div className="text-sm text-gray-500">User Rating</div>
              </div>
            </motion.div> */}

            {/* Enhanced Buttons */}
            <motion.div
              custom={5}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Link href="login" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    Get Started
                  </span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 backdrop-blur-sm bg-white/70"
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Now
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side Image with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative flex justify-center md:justify-end w-full md:w-1/2"
          >
            {/* Decorative Elements */}
           
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full shadow-lg"
              transition={{ delay: 0.5 }}
            />
           

            {/* Main Image with Hover Effect */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-2xl opacity-20 scale-110"></div>
              <Image
                src={HeroImage}
                alt="SwapSkill Hero"
                className="relative object-contain w-[280px] md:w-[350px] drop-shadow-2xl hidden lg:block"
              />
            </motion.div>
          </motion.div>
        </div>
      </Container> 
    
    </section>
  );
}
