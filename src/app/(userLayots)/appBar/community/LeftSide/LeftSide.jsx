"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStats } from "@/context/UserStatsContext";

export default function LeftSide() {
  const { data: session } = useSession();
  const router = useRouter();
  const { followingCount } = useUserStats();

  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await axiosInstance.get(
          `/api/posts?userId=${session.user.email}`
        );
        setPostCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
      }
    };
    fetchUserPosts();
  }, [session?.user?.email]);

  const shortcuts = [
    { name: "Art and Drawing", icon: "🎨" },
    { name: "Dribbble Pro", icon: "🏀" },
    { name: "Behance Creative", icon: "🎭" },
    { name: "One Piece Fan", icon: "🏴‍☠️" },
  ];

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      {/* Profile Card */}
      <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 text-center ">
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
            <p className="font-bold text-lg text-white">2022</p>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-white">{followingCount}</p>
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
          {shortcuts.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition cursor-pointer"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
