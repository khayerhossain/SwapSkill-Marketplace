"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import RegisterFrom from "./RegisterFrom";

export default function Register() {
  // const [form, setForm] = useState({ name: "", email: "", password: "" });
  // const [message, setMessage] = useState("");

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axiosInstance.post("/register", form);

  //     if (data.success) {
  //       toast.success("Registration successful!");

  //       // Auto-login after registration
  //       const res = await signIn("credentials", {
  //         redirect: false,
  //         email: form.email,
  //         password: form.password,
  //       });

  //       if (res?.ok) {
  //         toast.success("Logged in successfully");
  //         window.location.href = "/";
  //       } else {
  //         toast.error("Auto login failed!");
  //       }
  //     } else {
  //      toast.error(data.error || "Something went wrong!");
  //     }
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "Something went wrong");
  //   }
  // };

  return ( <>
   {/* // <div className="flex items-center justify-center min-h-screen bg-gray-900">
    //   <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
    //     <h2 className="text-2xl font-bold text-white text-center mb-6">
    //       Register
    //     </h2>
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <input
    //         name="name"
    //         type="text"
    //         placeholder="Name"
    //         value={form.name}
    //         onChange={handleChange}
    //         className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         required
    //       />
    //       <input
    //         name="email"
    //         type="email"
    //         placeholder="Email"
    //         value={form.email}
    //         onChange={handleChange}
    //         className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         required
    //       />
    //       <input
    //         name="password"
    //         type="password"
    //         placeholder="Password"
    //         value={form.password}
    //         onChange={handleChange}
    //         className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //         required
    //       />
    //       <button
    //         type="submit"
    //         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
    //       >
    //         Register
    //       </button>
    //     </form>
    //     {message && (
    //       <p className="mt-4 text-center text-green-400 font-medium">
    //         {message}
    //       </p>
    //     )}
    //   </div>
    // </div>
   */} 

   <RegisterFrom></RegisterFrom>
  </>
   
  );
}
