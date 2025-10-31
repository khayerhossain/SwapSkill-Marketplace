"use client";
import Container from "@/components/shared/Container";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export default function RegisterFrom() {
  const [regform, setRegForm] = useState({ name: "", email: "", password: "" });
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const router = useRouter();

  const handleChangeReg = (e) => {
    setRegForm({ ...regform, [e.target.name]: e.target.value });
  };

  const handleSubmitReg = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/register", regform);
      if (data.success) {
        toast.success("Registration successful!!");
        const res = await signIn("credentials", {
          redirect: false,
          email: regform.email,
          password: regform.password,
        });
        if (res?.ok) {
          toast.success("Logged in successfully");
          window.location.href = "/";
        } else {
          toast.error("Auto login failed!");
        }
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in successfully");
        router.replace("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

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
          className="relative w-full  md:h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-lg md:border border-purple-600 bg-white"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* LEFT SIDE (Login) */}
          <motion.div
            key={isToggled ? "login-left" : "text-left"}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
            className={`flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 ${
              isToggled
                ? "bg-white"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
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
                  className="w-full max-w-[90%] sm:max-w-md mx-auto bg-white/90 rounded-2xl p-6 sm:p-8 shadow-lg border border-purple-200"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                    Login Now
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <input
                      required
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-black bg-gray-50 border border-purple-300 rounded-lg"
                      placeholder="Enter your email"
                    />
                    <input
                      required
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-black bg-gray-50 border border-purple-300 rounded-lg"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold"
                    >
                      Login
                    </motion.button>
                  </form>

                  {/* Google Login */}
                  <div className="mt-4">
                    <button
                      onClick={() => signIn("google")}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                        fill="currentColor"
                      >
                        <path d="M488 261.8c0-17.8-1.6-35-4.7-51.7H249v97.9h135c-5.8 31.1-23 57.4-49 75v62h79.2c46.4-42.8 73.8-105.9 73.8-183.2z" />
                        <path d="M249 492c66.1 0 121.5-21.7 161.9-58.8l-79.2-62c-22 15.1-50.1 24-82.7 24-63.7 0-117.8-43.1-137.2-101.2H29v63.7C69.7 437.4 153.6 492 249 492z" />
                        <path d="M111.8 293.9c-4.6-13.7-7.2-28.2-7.2-43.1s2.6-29.4 7.2-43.1V144H29c-14.4 28.5-22.7 60.7-22.7 96.8s8.3 68.3 22.7 96.8l82.8-63.7z" />
                        <path d="M249 97.8c35.9 0 68.2 12.4 93.5 36.4l70.1-70.1C370.4 27.6 315 4 249 4 153.6 4 69.7 58.6 29 144l82.8 63.7C131.2 140.9 185.3 97.8 249 97.8z" />
                      </svg>
                      Continue with Google
                    </button>
                  </div>

                  {message && (
                    <p className="mt-4 text-center text-red-400 font-medium">
                      {message}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="text-left"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <h1 className="text-3xl font-extrabold">Hello, Friend!</h1>
                  <p className="text-sm max-w-xs">
                    Sign up to embark on an exciting journey with us.
                  </p>
                  <motion.button
                    onClick={() => setIsToggled(true)}
                    className="px-6 py-2 bg-white text-purple-600 rounded-full font-semibold"
                  >
                    Go to Login
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT SIDE (Register) */}
          <motion.div
            key={isToggled ? "text-right" : "signup-right"}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className={`flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 ${
              isToggled
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
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
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <h1 className="text-3xl font-extrabold">Welcome Back!</h1>
                  <p className="text-sm max-w-xs">
                    New here? Create an account to join the adventure.
                  </p>
                  <motion.button
                    onClick={() => setIsToggled(false)}
                    className="px-6 py-2 bg-white text-purple-600 rounded-full font-semibold"
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
                  className="w-full max-w-md mx-auto bg-white/90 rounded-2xl p-6 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Sign Up Now
                  </h2>
                  <form onSubmit={handleSubmitReg} className="space-y-4">
                    <input
                      required
                      name="name"
                      type="text"
                      value={regform.name}
                      onChange={handleChangeReg}
                      className="w-full px-3 py-2 text-black bg-gray-50 border border-purple-300 rounded-lg"
                      placeholder="Enter your name"
                    />
                    <input
                      required
                      name="email"
                      type="email"
                      value={regform.email}
                      onChange={handleChangeReg}
                      className="w-full px-3 py-2 text-black bg-gray-50 border border-purple-300 rounded-lg"
                      placeholder="Enter your email"
                    />
                    <input
                      required
                      name="password"
                      type="password"
                      value={regform.password}
                      onChange={handleChangeReg}
                      className="w-full px-3 py-2 text-black bg-gray-50 border border-purple-300 rounded-lg"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold"
                    >
                      Sign Up
                    </motion.button>
                  </form>

                  {/* Google Signup */}
                  <div className="mt-4">
                    <button
                      onClick={() => signIn("google")}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="20"
                        height="20"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.5 0 6.3 1.2 8.3 3.2l6.1-6.1C34.8 3.3 29.8 1 24 1 14.7 1 6.7 6.6 3.1 14.4l7.1 5.5C11.9 13.3 17.4 9.5 24 9.5z"
                        />
                        <path
                          fill="#34A853"
                          d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.5-1.9 4.6-4 6.1l6.2 4.8c3.6-3.4 5.5-8.5 5.5-15.4z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.2 28.8c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.1-5.5C1.1 16.4 0 20.1 0 24s1.1 7.6 3.1 10.3l7.1-5.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M24 47c5.8 0 10.6-1.9 14.1-5.1l-6.2-4.8c-1.7 1.2-4 2-7.9 2-6.6 0-12.1-3.8-13.8-9l-7.1 5.5C6.7 41.4 14.7 47 24 47z"
                        />
                      </svg>
                      Continue with Google
                    </button>
                  </div>

                  {message && (
                    <p className="mt-4 text-center text-red-400 font-medium">
                      {message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </Container>
  );
}
