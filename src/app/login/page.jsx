
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
          window.location.href = "/appBar";
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
        router.replace("/appBar");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <AnimatePresence mode="wait">
          {!isToggled ? (
            // ================= REGISTER PAGE (like first image) =================
        <motion.div
  key="register-layout"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -40 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-7xl bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden"
>
  {/* LEFT GRADIENT PANEL */}
  <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-10">
    
    {/* 5 Minute School top-left corner */}
    <div className="absolute top-6 left-6 flex items-start">
      <h1 className="text-4xl font-bold">5</h1>
      <div className="ml-1 mt-2 text-xs leading-tight">
        <p>Minute</p>
        <p>School</p>
      </div>
    </div>

    <p className="absolute top-15 left-6 flex items-start text-xs">
      Study Education on study
    </p>

    <h2 className="text-3xl font-bold mb-4 text-center">
      Learn From World's Best Instructors 🌍 Around The World.
    </h2>
    <img
      src={registerImage.src}
      alt="register"
      className="w-2/3 drop-shadow-lg"
    />
  </div>

  {/* RIGHT FORM PANEL */}
  <div className="col-span-2 rounded-3xl bg-white">
    <div className="p-12 flex flex-col justify-center w-full max-w-lg mx-auto">
      <div className="flex justify-between mb-6">
    
      </div>
<div className="flex items-center justify-between mb-6">
  {/* LEFT - Title */}
  <h2 className="text-3xl font-bold text-gray-900">
    Create Account
  </h2>

  {/* RIGHT - Language Selector */}
  <select className="text-gray-600 text-sm focus:outline-none">
    <option>English (USA)</option>
  </select>
</div>

      <form onSubmit={handleSubmitReg} className="space-y-6">
        {/* Full Name */}
        <input
          required
          name="name"
          type="text"
          value={regform.name}
          onChange={handleChangeReg}
          placeholder="Full Name"
          className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-indigo-500"
        />

        {/* Email */}
        <input
          required
          name="email"
          type="email"
          value={regform.email}
          onChange={handleChangeReg}
          placeholder="Email Address"
          className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-indigo-500"
        />

        {/* Password */}
        <input
          required
          name="password"
          type="password"
          value={regform.password}
          onChange={handleChangeReg}
          placeholder="Password"
          className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-indigo-500"
        />

        {/* Terms */}
        <div className="flex items-center text-sm text-gray-600">
          <input type="checkbox" required className="mr-2 accent-indigo-600" />
          <span>
            I agree to the{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              terms of service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              privacy policy
            </a>
          </span>
        </div>

        {/* Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
        >
          Sign Up
        </motion.button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">Or Sign Up With</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

     {/* Social */}
<div className="flex justify-center space-x-6 mt-4">
  {/* Google */}
  <button type="button">
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="google"
      className="w-6 h-6"
    />
  </button>

  {/* Facebook */}
  <button type="button">
    <img
      src="https://www.svgrepo.com/show/452196/facebook-1.svg"
      alt="facebook"
      className="w-6 h-6"
    />
  </button>

  {/* Instagram */}
  <button type="button">
    <img
      src="https://www.svgrepo.com/show/452229/instagram-1.svg"
      alt="instagram"
      className="w-6 h-6"
    />
  </button>

  {/* Twitter */}
  <button type="button">
    <img
      src="https://www.svgrepo.com/show/475689/twitter-color.svg"
      alt="twitter"
      className="w-6 h-6"
    />
  </button>

  {/* LinkedIn */}
  <button type="button">
    <img
      src="https://www.svgrepo.com/show/448234/linkedin.svg"
      alt="linkedin"
      className="w-6 h-6"
    />
  </button>
</div>



      {/* Already account */}
      <p className="mt-6 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <span
          onClick={() => setIsToggled(true)}
          className="text-indigo-600 font-bold cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </p>
    </div>
  </div>
</motion.div>
          ) : (
            // ================= LOGIN PAGE (like second image) =================
            <motion.div
              key="login-layout"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-7xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            >
              {/* LEFT FORM PANEL */}
              <div className="p-10 flex justify-center">
                <div className="bg-gray-100 p-20 rounded-2xl mt-5 mb-5">
                  <div className="flex justify-between">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                      Sign in
                    </h2>

                    {/* Google Sign in */}
                    <div className="flex justify-center mb-6">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition">
                        Sign with{" "}
                        <img
                          src="https://www.svgrepo.com/show/355037/google.svg"
                          alt="google"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block text-sm font-semibold text-gray-50 mb-2">
                      Username or email address
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-black bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="suborna@gmail.com"
                    />
                    <div className="">
                      <div className="flex justify-between">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
                          Password
                        </label>
                        <span className=" text-sm text-purple-600 cursor-pointer hover:underline">
                          Forgot password?
                        </span>
                      </div>

                      <input
                        required
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3  text-black bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="Enter your password"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-40 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Sign in
                    </motion.button>
                  </form>
                  <p className="mt-6 text-center text-gray-600">
                    Don’t have an account?
                    <span
                      onClick={() => setIsToggled(false)}
                      className="ml-2 text-indigo-600 font-bold cursor-pointer hover:underline"
                    >
                      Sign up
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT GRADIENT PANEL */}
              <div className=" bg-gradient-to-br from-pink-500 to-purple-600 flex flex-col justify-center items-center p-10  rounded-l-full">
                <img
                  src={loginImage.src}
                  alt="login"
                  className="w-7xl drop-shadow-lg"
                />
               
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
