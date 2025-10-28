"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/app/loading";

export default function AboutSectionStats() {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [skills, setSkills] = useState([]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.6 },
    }),
  };
  // total users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/users");
      setTotalUsers(data.length);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  //total skills
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/current-skills");
      setSkills(data);
    } catch (error) {
      console.error(" Failed to fetch skills", error);
      Swal.fire("Error", "Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      custom={4}
      variants={textVariants}
      className="flex flex-wrap items-center justify-center lg:justify-center gap-8 py-6 mt-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-md border border-white/10"
    >
      <div className="text-center">
        <div className="text-3xl font-extrabold text-red-500">
          {totalUsers}+
        </div>
        <div className="text-sm text-gray-400">Active Users</div>
      </div>
      <div className="w-px h-12 bg-gray-600/30 hidden sm:block"></div>
      <div className="text-center">
        <div className="text-3xl font-extrabold text-red-500">
          {skills.length}+
        </div>
        <div className="text-sm text-gray-400">Skills Available</div>
      </div>
      <div className="w-px h-12 bg-gray-600/30 hidden sm:block"></div>
      <div className="text-center">
        <div className="text-3xl font-extrabold text-red-500">4.9★</div>
        <div className="text-sm text-gray-400">User Rating</div>
      </div>
    </motion.div>
  );
}
