"use client";
import Container from "@/components/shared/Container";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function ToggleLayout() {
  const [isToggled, setIsToggled] = useState(false);

  // Animation variants for the container
  const containerVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  // Animation variants for text content
  const textVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { y: -30, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center bg-no-repeat bg-cover text-white p-4 sm:p-6 md:p-8">
        <motion.div
          className="relative w-full  md:h-[80vh]  flex flex-col md:flex-row overflow-hidden  shadow-lg md:border border-purple-600 bg-white"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* LEFT SIDE */}
          <motion.div
            key={isToggled ? "login-left" : "text-left"}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
            className={`flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 ${
              isToggled
                ? "bg-white"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 bg-no-repeat bg-cover text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {isToggled ? (
                <motion.div
                  key="login-form"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-[90%] sm:max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-purple-200"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                    Login Now
                  </h2>
                  <form className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Username or Email
                      </label>
                      <input
                        required
                        name="email"
                        type="email"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 text-sm sm:text-base placeholder:text-gray-500 placeholder:text-xs"
                        placeholder="Enter your username or email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 text-sm sm:text-base placeholder:text-gray-500 placeholder:text-xs "
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                    >
                      Login
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="text-left"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    Hello, Friend!
                  </h1>
                  <p className="text-sm sm:text-lg max-w-[80%] sm:max-w-xs">
                    Sign up to embark on an exciting journey with us.
                  </p>
                  <motion.button
                    onClick={() => setIsToggled(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-purple-600 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                  >
                    Go to Login
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            key={isToggled ? "text-right" : "signup-right"}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
            className={`flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 ${
              isToggled
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 bg-no-repeat bg-cover text-white"
                : "bg-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {isToggled ? (
                <motion.div
                  key="text-right"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    Welcome Back!
                  </h1>
                  <p className="text-sm sm:text-lg max-w-[80%] sm:max-w-xs">
                    New here? Create an account to join the adventure.
                  </p>
                  <motion.button
                    onClick={() => setIsToggled(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-purple-600 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                  >
                    Sign Up
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-form"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-[90%] sm:max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-purple-200"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                    Sign Up Now
                  </h2>
                  <form className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        required
                        name="name"
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 text-sm placeholder:text-gray-500 placeholder:text-xs sm:text-base"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Username or Email
                      </label>
                      <input
                        required
                        name="email"
                        type="email"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 placeholder:text-xs duration-300 text-sm sm:text-base"
                        placeholder="Enter your username or email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500 placeholder:text-xs transition-colors duration-300 text-sm sm:text-base"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                    >
                      Sign Up
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </Container>
  );
}
