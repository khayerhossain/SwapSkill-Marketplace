"use client";
import Container from "@/components/shared/Container";
import axiosInstance from "@/lib/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import loginImage from "../../assets/auth/login.gif";
import registerImage from "../../assets/auth/register.gif";

export default function LoginPage() {
  const [regform, setRegForm] = useState({ name: "", email: "", password: "" });

  const handleChangeReg = (e) => {
    setRegForm({ ...regform, [e.target.name]: e.target.value });
  };

  const handleSubmitReg = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/register", regform);

      if (data.success) {
        toast.success("Registration successful!");

        // Auto-login after registration
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

  // login
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

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
    <>
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-400 font-medium">{message}</p>
        )}
      </div>
    </div> */}

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
                isToggled ? "bg-white" : "bg-white"
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
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Username or Email
                        </label>
                        <input
                          required
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-3 text-black sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 text-sm sm:text-base placeholder:text-gray-500 placeholder:text-xs"
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
                          value={form.password}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 text-black bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 text-sm sm:text-base placeholder:text-gray-500 placeholder:text-xs "
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
                    {message && (
                      <p className="mt-4 text-center text-red-400 font-medium">
                        {message}
                      </p>
                    )}
                    <p className="text-black py-2 px-1">
                      Don’t have an account? please
                      <motion.button
                        onClick={() => setIsToggled(false)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-purple-600 underline font-bold ml-2 cursor-pointer"
                      >
                        Register
                      </motion.button>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="text-left"
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 w-full h-full"
                  >
                    <img
                      className="w-full h-full"
                      src={loginImage.src}
                      alt=""
                    />
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
                isToggled ? "bg-white" : "bg-white"
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
                    className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 w-full h-full"
                  >
                    <img
                      className="w-full h-full"
                      src={registerImage.src}
                      alt=""
                    />
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
                    <form
                      onSubmit={handleSubmitReg}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          required
                          name="name"
                          type="text"
                          value={regform.name}
                          onChange={handleChangeReg}
                          className="w-full px-3 text-black sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 text-sm placeholder:text-gray-500 placeholder:text-xs sm:text-base"
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
                          value={regform.email}
                          onChange={handleChangeReg}
                          className="w-full text-black px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-500 placeholder:text-xs duration-300 text-sm sm:text-base"
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
                          value={regform.password}
                          onChange={handleChangeReg}
                          className="w-full text-black px-3 sm:px-4 py-2 bg-gray-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500 placeholder:text-xs transition-colors duration-300 text-sm sm:text-base"
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
                    {message && (
                      <p className="mt-4 text-center text-red-400 font-medium">
                        {message}
                      </p>
                    )}

                    <p className="text-black py-2 px-1">
                      Already have an account? please
                      <motion.button
                        onClick={() => setIsToggled(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-purple-600 underline font-bold ml-2 cursor-pointer"
                      >
                        Login
                      </motion.button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </>
  );
}
