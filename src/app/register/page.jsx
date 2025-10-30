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
import logo from "../../assets/logo1.png";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/register", form);
      if (data.success) {
        toast.success("Registration successful!");
        const res = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });
        if (res?.ok) toast.success("Logged in successfully");
        else toast.error("Auto login failed!");
        router.push("/appBar");
      } else toast.error(data.error || "Something went wrong!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/appBar" });
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
            <Image
              src={logo}
              alt="Logo"
              width={70}
              height={70}
              className="mb-8 opacity-90 hover:opacity-100 transition"
            />
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Join Us
            </h1>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
              Create your account to start sharing, learning, and connecting
              with amazing people!
            </p>
            <Link href="/">
              <button className="px-6 py-2 rounded-lg bg-red-500 hover:opacity-90 transition-all font-semibold text-white shadow-lg shadow-red-700/40 w-fit cursor-pointer">
                Visit Home
              </button>
            </Link>
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
                Create Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-white/10 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-300">
                    Email
                  </label>
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
                  <label className="block mb-1 text-sm text-gray-300">
                    Password
                  </label>
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
                  className={`w-full py-2.5 rounded-lg bg-red-500 font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2`}
                  disabled={loading} // disable while loading
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}
                  {loading ? "Registering..." : "Register"}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-2.5 rounded-lg border border-[#2e2e2e] transition-all cursor-pointer"
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
                  <span className="font-medium text-sm">
                    Log in with Google
                  </span>
                </motion.button>

                <p className="mt-4 text-sm text-center text-gray-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-red-400 hover:text-red-300 underline ml-1 cursor-pointer"
                  >
                    Login
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
