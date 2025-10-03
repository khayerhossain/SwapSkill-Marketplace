
"use client";
import Container from "@/components/shared/Container";
import axiosInstance from "@/lib/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const [regform, setRegForm] = useState({ name: "", email: "", password: "" });
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isToggled, setIsToggled] = useState(false); // false = register, true = login
  const router = useRouter();

  const handleChangeReg = (e) =>
    setRegForm({ ...regform, [e.target.name]: e.target.value });

  const handleSubmitReg = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/register", regform);
      if (data.success) {
        toast.success("Registration successful!");
        const res = await signIn("credentials", {
          redirect: false,
          email: regform.email,
          password: regform.password,
        });
        if (res?.ok) {
          toast.success("Logged in successfully");
          window.location.href = "/"; // allow middleware to route by role
        } else toast.error("Auto login failed!");
      } else toast.error(data.error || "Something went wrong!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (result?.error) toast.error("Invalid credentials");
      else {
        toast.success("Logged in successfully");
        router.replace("/"); // allow middleware to route by role
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      toast.error("Google login failed!");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -40, transition: { duration: 0.4, ease: "easeIn" } },
  };

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-8">
        <motion.div
          className={`relative w-full max-w-6xl h-[85vh] flex flex-col md:flex-row ${
            isToggled ? "md:flex-row" : "md:flex-row-reverse"
          } overflow-hidden rounded-3xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {/* LEFT/RIGHT PANEL */}
          <motion.div
            key={isToggled ? "login-panel" : "register-panel"}
            className="flex-1 flex items-center justify-center p-6 md:p-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              {isToggled ? (
                // LOGIN
                <motion.div
                  key="login-form"
                  className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-lg"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Login
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      required
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                    <input
                      required
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Login
                    </motion.button>
                  </form>

                  {/* GOOGLE LOGIN */}
                  <div className="mt-4">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="google"
                        className="w-5 h-5"
                      />
                      Continue with Google
                    </button>
                  </div>

                  <p className="mt-4 text-center text-gray-600">
                    Don't have an account?
                    <span
                      onClick={() => setIsToggled(false)}
                      className="ml-2 text-red-600 font-bold cursor-pointer hover:underline"
                    >
                      Register
                    </span>
                  </p>
                </motion.div>
              ) : (
                // REGISTER
                <motion.div
                  key="register-form"
                  className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-lg"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Sign Up
                  </h2>
                  <form onSubmit={handleSubmitReg} className="space-y-4">
                    <input
                      required
                      name="name"
                      type="text"
                      value={regform.name}
                      onChange={handleChangeReg}
                      className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Enter your name"
                    />
                    <input
                      required
                      name="email"
                      type="email"
                      value={regform.email}
                      onChange={handleChangeReg}
                      className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                    <input
                      required
                      name="password"
                      type="password"
                      value={regform.password}
                      onChange={handleChangeReg}
                      className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </form>

                  {/* GOOGLE SIGNUP */}
                  <div className="mt-4">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="google"
                        className="w-5 h-5"
                      />
                      Continue with Google
                    </button>
                  </div>

                  <p className="mt-4 text-center text-gray-600">
                    Already have an account?
                    <span
                      onClick={() => setIsToggled(true)}
                      className="ml-2 text-red-600 font-bold cursor-pointer hover:underline"
                    >
                      Login
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* TITLE PANEL */}
          <motion.div
            className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="text-center text-gray-800 px-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <Image
                  src={logo}
                  alt="SwapSkill Logo"
                  width={120}
                  height={120}
                  className="mx-auto drop-shadow-lg"
                />
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                {isToggled ? "Welcome Back!" : "Join SwapSkill"}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed"
              >
                {isToggled 
                  ? "Sign in to continue your skill exchange journey and connect with amazing people."
                  : "Start your skill exchange journey today. Learn new skills, teach others, and build meaningful connections."
                }
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Container>
  );
}
