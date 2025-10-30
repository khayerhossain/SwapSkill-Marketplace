"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Code, Zap, Palette, Users, BookOpen, Camera } from "lucide-react"; // 👈 Lucide icons

export default function LeftSide() {
  const { data: session } = useSession();
  const router = useRouter();
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchPostCount = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user-post-count?email=${session.user.email}`
        );
        if (data.success) setPostCount(data.totalPosts);
      } catch (error) {
        console.log("Error fetching post count:", error);
      }
    };

    fetchPostCount();
    const interval = setInterval(fetchPostCount, 5000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (!session?.user?.email) return;
    const fetchFollowerCount = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user-follower-count?email=${session.user.email}`
        );
        if (data.success) setFollowerCount(data.totalPosts);
      } catch (error) {
        console.log("Error fetching follower count:", error);
      }
    };
    fetchFollowerCount();
  }, [session]);

  useEffect(() => {
    if (!session?.user?.email) return;
    const fetchFollowCount = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user-following-count?email=${session.user.email}`
        );
        if (data.success) setFollowCount(data.totalPosts);
      } catch (error) {
        console.log("Error fetching following count:", error);
      }
    };
    fetchFollowCount();
  }, [session]);

  // Updated Shortcuts with Lucide React icons
  const shortcuts = [
    { name: "My Skills", icon: Code }, // skills user offers
    // { name: "Skill Requests", icon: Zap },         // skills users want to learn
    { name: "Community Tips", icon: Users }, // shared tips or advice
    { name: "Tutorials", icon: BookOpen }, // saved or trending tutorials
    // { name: "Workshops", icon: Palette },         // creative/practical workshops
    { name: "Networking", icon: Camera }, // connect with other users
  ];

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      {/* Profile Card */}
      <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 text-center">
        <img
          src={session?.user?.image || "https://i.pravatar.cc/100?img=12"}
          alt={session?.user?.name || "Profile"}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-md object-cover"
        />
        <h2 className="text-xl font-semibold text-white">
          {session?.user?.name || "Guest User"}
        </h2>
        <p className="text-sm text-gray-400">
          {session?.user?.email || "guest@example.com"}
        </p>

        <div className="flex justify-around mt-6 text-sm text-gray-300">
          <div className="text-center">
            <p className="font-bold text-lg text-white">{postCount}</p>
            <span className="text-gray-400">Posts</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-white">{followerCount}</p>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-white">{followCount}</p>
            <span className="text-gray-400">Following</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/appBar/profile")}
          className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-transform duration-200"
        >
          My Profile
        </button>
      </div>

      {/* Shortcuts */}
      <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 shadow-lg">
        <h3 className="font-semibold mb-4 text-white">Your Shortcuts</h3>
        <ul className="space-y-3">
          {shortcuts.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={index}
                className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition cursor-pointer"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
