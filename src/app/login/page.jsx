"use client";
import Container from "@/components/shared/Container";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        router.push("/"); // login successful হলে redirect
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/post-login" });
    } catch {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1c1c1c] text-white px-4">
      <Container>
        <div className="absolute w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[180px] top-[-150px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-red-700/20 rounded-full blur-[200px] bottom-[-150px] right-[-100px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-between z-10"
        >
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden md:flex flex-col justify-center flex-1 p-8 md:p-14"
          >
            <Image src={logo} alt="Logo" width={70} height={70} className="mb-8 opacity-90 hover:opacity-100 transition" />
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
              Join the SwapSkill community to connect, collaborate, and grow.
              Let’s get you signed in!
            </p>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition-all font-semibold text-white shadow-lg shadow-red-700/40 w-fit">
              Learn More
            </button>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex-1 flex justify-center w-full"
          >
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-10 w-full sm:max-w-sm shadow-[0_0_25px_rgba(0,0,0,0.6)]"
            >
              <h2 className="text-2xl font-semibold text-center mb-6">
                Sign In
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-white/10 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white/10 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 placeholder-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-red-400 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-red-500 font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  Sign In
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-2.5 rounded-lg border border-[#2e2e2e]"
                >
                  <span className="font-medium text-sm">Log in with Google</span>
                </motion.button>

                <p className="mt-4 text-sm text-gray-400">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => router.push("/register")}
                    className="text-red-400 hover:text-red-300 underline ml-1"
                  >
                    Register
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
